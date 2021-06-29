function getAllStarts() {
    var starts = {
        'saturday' : [
            {
                name: "RS 200",
                flag: "RS Insignia"
            },
            {
                name: "Cadet",
                flag: "Y"
            },
            {
                name: "K-Class",
                flag: "K"
            },
            {
                name: "Wayfarer",
                flag: "Wayfarer Insignia"
            },
            {
                name: "Laser & Radial",
                flag: "Laser Insignia"
            },
            {
                name: "Squib",
                flag: "Nav 9"
            }
        ],
        'wednesday' : [
            {
                name: "Laser",
                flag: "Laser Insignia"
            },
            {
                name: "Dragonfly",
                flag: "W"
            },
            {
                name: "Fast Handicap",
                flag: "E"
            },
            {
                name: "Squib",
                flag: "Nav 9"
            },
            {
                name: "Slow Handicap",
                flag: "K"
            }
        ]
    };
    var series = getSelectedSeries();
    return starts[series];
}
function getSelectedSeries() {
    return $('input[type=radio][name=series]:checked').val();
}
function getRemovedStarts() {
    return JSON.parse(window.localStorage.getItem("removedStarts." + getSelectedSeries())) || [];
}
function getGeneralRecalls() {
    return JSON.parse(window.localStorage.getItem("generalRecalls." + getSelectedSeries())) || [];
}
function getSelectedStarts() {
    var allStarts = getAllStarts();
    var removed = getRemovedStarts();
    var ret = [];
    $.each(allStarts, function (i, el) {
        if(jQuery.inArray(el.name, removed) == -1) {
            ret.push(el);
        }
    });
    var generalRecalls = getGeneralRecalls();
    $.each(ret, function (i, el) {
        if(jQuery.inArray(el.name, generalRecalls) > -1) {
            ret.push(el);
        }
    });
    return ret;
}
function formatTime(t) {
    var minutes = "0" + t.getMinutes();
    return t.getHours() + ":" + minutes.substr(-2);
}
function formatTimeWithSeconds(t) {
    var secs = "0" + t.getSeconds();
    return formatTime(t) + ":" + secs.substr(-2);
}
function addMinutes(t, minutes) {
    var d = new Date(t.getTime());
    d.setMinutes(d.getMinutes() + minutes);
    return d;
}

function secondsToHrsMinsSecs(d) {

    d = 1 + Number(d);
    
    if( d > -1) {
        
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        
        var result = "";
        
        if( h > 0 ) {
            result += h + ":";
        }
        if( m > 0 ) {
            result += numberTo2Digit(m) + ":";
        }
        
        result += numberTo2Digit(s);
    
    }
    else {
        result = "-";
    }
    return result; 
}
function numberTo2Digit(j) {
  return ('0' + j).slice(-2);
}


function parseTime(timeString) {
    var now = new Date();
    var hour = timeString.split(":")[0];
    var minute = timeString.split(":")[1];
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
}
function showStartSequence(starts, timeString) {
    var startTime = parseTime(timeString);
    $("#starts").empty().append(
        $('<tr/>').append(
            $('<th/>').text('Time'),
            $('<th/>').text('Event'),
            $('<th/>').text('Up'),
            $('<th/>').text('Down'),
            $('<th/>')
        )
    );

    var flags = [];
    var flagTime = startTime;
    flagTime = addMinutes(flagTime, -3);
    $.each(starts, function (i, el) {
        var lastStart = flags[flags.length - 1];
        if (lastStart) {
            lastStart.name = lastStart.name + ", " + el.name + " 3 minute";
            lastStart.up = el.flag + ', P'
        }
        else {
            flags.push({
                startName: el.name,
                name: el.name + " 3 minute",
                time: flagTime,
                up: el.flag + ', P'
            });
        }
        flagTime = addMinutes(flagTime, 2);
        flags.push({
            startName: el.name,
            name: el.name + " 1 minute",
            time: flagTime,
            down: 'P'
        });
        flagTime = addMinutes(flagTime, 1);
        flags.push({
            startName: el.name,
            name: el.name + " Start",
            time: flagTime,
            down: el.flag
        });
    });
    $.each(flags, function (i, el) {
        $("#starts").append(
            $("<tr/>").attr({
                "id":  el.time.getTime(),
                "class": "timeRow"
            }).append(
                $("<td/>").text(
                    formatTime(el.time)
                ),
                $("<td/>").text(
                    el.name
                ),
                $("<td/>").text(
                    el.up
                ),
                $("<td/>").text(
                    el.down
                )
            )
        );
    });
}
function showStartListCheckboxes(starts) {
    var removed = getRemovedStarts();
    var generalRecalls = getGeneralRecalls();
    $.each(starts, function(i, el) {
        var checked = jQuery.inArray(el.name, removed) == -1;
        var generalRecalled = jQuery.inArray(el.name, generalRecalls) > -1;

        $('#startList').append(
            $('<div/>').append(
                $('<label/>').text(el.name).append(
                    $('<input/>').attr({type:"checkbox", name:"checkbox", value:el.name}).prop( "checked", checked )

            .click(function(el2) {
                if($(this).is(":checked")) {
                    removed.splice( $.inArray(el.name, removed), 1 );
                }
                else {
                    removed.push(el.name);
                }
                window.localStorage.setItem("removedStarts." + getSelectedSeries(), JSON.stringify(removed));
                showStartSequence(getSelectedStarts(), $('#first_start').val());
            })
        ),
            $('<button/>').text('General Recall')
                          .addClass('general_recall')
                          .addClass(function() {
                              return generalRecalled ? 'on' : '';
                          })
                          .click(function() {
                $(this).toggleClass("on");
                if($(this).hasClass("on")) {
                    generalRecalls.push(el.name);
                }
                else {
                    generalRecalls.splice( $.inArray(el.name, generalRecalls), 1 );
                }
                window.localStorage.setItem("generalRecalls." + getSelectedSeries(), JSON.stringify(generalRecalls));
                showStartSequence(getSelectedStarts(), $('#first_start').val());
              })
        ));
    });
}
function clock(){
    var currentTime = new Date();
    var currentTimeString = formatTimeWithSeconds(currentTime);
    var currentTimeInt = parseInt(currentTimeString.replace(/:/g, ""));
    $("#clock").text(currentTimeString);
    
    var nextActionTime = -1;
    $(".timeRow").each(function(i, el) {
        var timeId = parseInt($(el).attr("id"));
        if (timeId < currentTime) {
            $(el).addClass("past");
            $(el).removeClass("thisStart");
        }
        else {
            if(nextActionTime == -1) {
                nextActionTime = timeId;
            }
            
            if (timeId > currentTime && timeId <= addMinutes(currentTime, 1)) {
                $(el).addClass("thisStart");
            }
            else {
                $(el).removeClass("thisStart");
            }
        }
    });

    //  update the countdown timer
    $("#countdown").html( secondsToHrsMinsSecs((nextActionTime - currentTime) /1000));
}
function loadSeries() {
    var series = 'saturday';
    if (window.localStorage.getItem("series")) {
        series = window.localStorage.getItem("series");
    }
    var $radios = $('input:radio[name=series]');
    if($radios.is(':checked') === false) {
        $radios.filter('[value=' + series + ']').prop('checked', true);
    }
}
function loadSequence() {
    var sequence = 'sequence3';
    if (window.localStorage.getItem("sequence")) {
        sequence = window.localStorage.getItem("sequence");
    }
    var $radios = $('input:radio[name=sequence]');
    if($radios.is(':checked') === false) {
        $radios.filter('[value=' + sequence + ']').prop('checked', true);
    }
}
function loadFirstStart() {
    if (window.localStorage.getItem("startTime." + getSelectedSeries())) {
        $('#first_start').val(window.localStorage.getItem("startTime." + getSelectedSeries()));
    }
    else {
        var defaultStartTime = 'wednesday' == getSelectedSeries() ? '18:54' : '13:20';
        $('#first_start').val(defaultStartTime);
    }
}
$(document).ready(function () {
    clock();
    setInterval(clock, 100);

    loadSeries();
    loadSequence();
    loadFirstStart();
    $('input[name=series]').change(function() {
        window.localStorage.setItem("series", this.value);
        $('#startList').empty();
        showStartListCheckboxes(getAllStarts());
        loadFirstStart();
        showStartSequence(getSelectedStarts(), $('#first_start').val());
    });
    $('input[name=sequence]').change(function() {
        window.localStorage.setItem("sequence", this.value);
        $('#startList').empty();
        showStartListCheckboxes(getAllStarts());
        loadFirstStart();
        showStartSequence(getSelectedStarts(), $('#first_start').val());
    });
    showStartSequence(getSelectedStarts(), $('#first_start').val());
    $('#first_start').on('input', function(p) {
        showStartSequence(getSelectedStarts(), p.target.value);
        window.localStorage.setItem("startTime." + getSelectedSeries(), p.target.value);
    });
    $('#editSettings').on('click', function(p) {
        $('#startList').empty();
        showStartListCheckboxes(getAllStarts());
        $('#settings').toggle();
    });

});
