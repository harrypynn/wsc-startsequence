var starts = [
    {
        name: "Lark and RS 200",
        flag: "Lark Insignia"
    },
    {
        name: "Cadet",
        flag: "Y"
    },
    {
        name: "Dragonfly",
        flag: "W"
    },
    {
        name: "Wayfarer",
        flag: "Wayfarer Insignia"
    },
    {
        name: "Laser",
        flag: "Laser Insignia"
    },
    {
        name: "Squib",
        flag: "Nav 9"
    }
];
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
function showStartSequence(timeString) {
    var startTime = parseTime(timeString);
    $("#starts").empty().append(
        $('<tr/>').append(
            $('<th/>').text('Time'),
            $('<th/>').text('Event'),
            $('<th/>').text('Up'),
            $('<th/>').text('Down')
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
                name: el.name + " 3 minute",
                time: flagTime,
                up: el.flag + ', P'
            });
        }
        flagTime = addMinutes(flagTime, 2);
        flags.push({
            name: el.name + " 1 minute",
            time: flagTime,
            down: 'P'
        });
        flagTime = addMinutes(flagTime, 1);
        flags.push({
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
$(document).ready(function () {
    clock();
    setInterval(clock, 100);
    
    if (window.localStorage.getItem("startTime")) {
        $('#first_start').val(window.localStorage.getItem("startTime"));
    }
    showStartSequence($('#first_start').val());
    $('#first_start').on('input', function(p) {
        showStartSequence(p.target.value);
        window.localStorage.setItem("startTime", p.target.value);
    });
});
