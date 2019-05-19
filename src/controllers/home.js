const ctrl = {};
const { image } = require('../model/index');
ctrl.index = async (req, res) =>
{
    const images = await image.find().sort({timestamp : -1})
    res.render('index', { images });
};

module.exports = ctrl;