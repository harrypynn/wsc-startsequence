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
function addMinutes(t, minutes) {
    t.setMinutes(t.getMinutes() + minutes);
}
$(document).ready(function () {
    var picker = new Picker(document.querySelector('.js-time-picker'), {
        format: 'HH:mm',
    });
    var now = new Date();
    var startTime = picker.getDate();
    showStartSequence(startTime);
    $('.js-time-picker').on('pick', function(p) {
        var pickedDate = p.target.picker.getDate();
        showStartSequence(pickedDate);
    });
});

function showStartSequence(startTime) {
    $("#starts").empty().append(
        $('<tr/>').append(
            $('<th/>').text('Event'),
            $('<th/>').text('Time'),
            $('<th/>').text('Up'),
            $('<th/>').text('Down')
        )
    );

    var flags = [];
    var flagTime = startTime;
    addMinutes(flagTime, -3);
    $.each(starts, function (i, el) {
        var lastStart = flags[flags.length - 1];
        if (lastStart) {
            lastStart.name = lastStart.name + ", " + el.name + " 3 minute";
            lastStart.up = el.flag + ', P'
        }
        else {
            flags.push({
                name: el.name + " 3 minute",
                time: formatTime(flagTime),
                up: el.flag + ', P'
            });
        }
        addMinutes(flagTime, 2);
        flags.push({
            name: el.name + " 1 minute",
            time: formatTime(flagTime),
            down: 'P'
        });
        addMinutes(flagTime, 1);
        flags.push({
            name: el.name + " Start",
            time: formatTime(flagTime),
            down: el.flag
        });
    });
    $.each(flags, function (i, el) {
        $("#starts").append(
            $("<tr/>").append(
                $("<td/>").text(
                    el.name
                ),
                $("<td/>").text(
                    el.time
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