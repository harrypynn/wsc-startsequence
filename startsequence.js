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
function parseTime(timeString) {
    var now = new Date();
    var hour = timeString.split(":")[0];
    var minute = timeString.split(":")[1];
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
}
$(document).ready(function () {
    showStartSequence($('#first_start').val());
    $('#first_start').on('input', function(p) {
        showStartSequence(p.target.value);
    });
});

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
                    el.time
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