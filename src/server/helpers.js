const moment = require('moment');
const helpers = {};

helpers.timeago = timestamp =>
{
    return moment(timestamp).startOf('minutes').fromNow();
};

helpers.comments_count = object =>
{
    return object.length;
}

module.exports = helpers;