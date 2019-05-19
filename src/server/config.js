const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const routes = require('../routes/index');
const errorhandler = require('errorhandler');

module.exports = app =>
{
    //Setting

    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '../views'));
    app.engine('.hbs', exphbs(
        {
            defaultLayout : 'main',
            layoutsDir : path.join(app.get('views'), 'layouts'),
            partialsDir : path.join(app.get('views'), 'partials'),
            extname : '.hbs',
            helpers : require('./helpers')
        }));
    app.set('view engine', '.hbs');

    //MiddleWare

    app.use(morgan('dev'));
    app.use(multer({dest : path.join(__dirname, '../public/upload/temp')}).single('image'));
    app.use(express.urlencoded({extended : false}));
    app.use(express.json()); 

    //Static Files

    app.use('/public',express.static(path.join(__dirname, '../public')));

    //Routes

    routes(app);

    //ErrorHandler

    if('development' === app.get('dev'))
    {
        app.use(errorhandler)
    }
    
    return app;
}