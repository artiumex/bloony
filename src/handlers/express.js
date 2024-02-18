const ExtendedClient = require('../class/ExtendedClient');
const { log } = require('../functions');
const { changeData } = require('../tools');
const { setup, resettemp } = require('../chat/module');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const dayjs = require('dayjs');
// var logger = require('morgan');

const app = express();

app.set('views', path.join('./src', 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
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
        await setup();
        res.json({ noted: true });
    });
    
    app.get('/newchats', async (req, res) => {
        await resettemp();
        res.json({ noted: true });
    });

    app.get('/log', async (req, res) => {
        await client.forceNotify();
        res.send(`Updated log at ${dayjs().format()}`);
    });

    await changeData(client);
}