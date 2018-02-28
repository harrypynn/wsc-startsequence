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
var now = new Date();
var startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 20, 0, 0);
function formatTime(t) {
    return t.getHours() + ":" + t.getMinutes()
}
function addMinutes(t, minutes) {
    t.setMinutes(t.getMinutes() + minutes);
}
$(document).ready(function () {
    var flags = [];

    var flagTime = startTime;
    addMinutes(flagTime, -3);
    $.each(starts, function (i, el) {
        var lastStart = flags[flags.length - 1];
        if (lastStart) {
            lastStart.name = lastStart.name +  ", " +  el.name + " 3 minute";
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
            name: el.name  + " Start",
            time: formatTime(flagTime),
            down: el.flag
        });
    });
    $.each(flags, function (i,  el) {
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
});