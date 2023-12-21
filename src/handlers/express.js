const { log } = require('../functions');
const { changeData } = require('../tools');
const ExtendedClient = require('../class/ExtendedClient');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

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
module.exports = (client) => {
    changeData(client);

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
}