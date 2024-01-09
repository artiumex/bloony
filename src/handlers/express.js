const ExtendedClient = require('../class/ExtendedClient');
const { log } = require('../functions');
const { changeData } = require('../tools');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();

app.set('views', path.join('./src', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('./src', 'public')));

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = async (client) => {
    app.listen(process.env.SERVERPORT, () => {
        log("Server running on port " + process.env.SERVERPORT, 'done');
    });

    app.get('/', (req, res, next) => {
        res.render('index', { title: 'Data', cdata: client.data });
    });

    app.get('/grab', (req, res, next) => {
        res.json(client.data);
    });

    app.get('/updated', async (req, res) => {
        await changeData(client);
        res.json({ noted: true });
    });

    // app.post('/discord', (req, res, next) => {
    //     console.log(req.data);
    //     res.json({
    //         "type": 1
    //     });
    // });

    await changeData(client);
}