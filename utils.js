var moment = require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");

module.exports.log = function (caller, msg, args, msg_color) {
    var STR_MAX_LEN = 20;

    for(var key in args) {
        if(typeof args[key] === 'string') {
            if(args[key].length > STR_MAX_LEN) {
                args[key] = args[key].substring(0, STR_MAX_LEN) + "...";
            }
        }
    }

    var date = moment().format("YYYY-MM-DD HH:mm:ss");

    switch (msg_color) {
        case "r": //red
            msg_color = "\x1b[31m";
            break;
        case "y": //yellow
            msg_color = "\x1b[33m";
            break;
        case "b": //blue
            msg_color = "\x1b[34m";
            break;
        default:
            msg_color = "\x1b[0m";
            break;
    }

    if (msg === undefined) {
        msg = "";
    }

    if (args === undefined) {
        args = "";
    }

    var print = `\x1b[32m[Demo Webserver, ${date}]\x1b[0m`;
    if (caller.length != 0) print += `\x1b[32m [${caller}]\x1b[0m`;
    print += ` ${msg_color}${msg}\x1b[0m`;
    if (Object.keys(args).length != 0) print += ` - ${JSON.stringify(args)}`;
    //print += `\n`;

    console.log(print);
}

