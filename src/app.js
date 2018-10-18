#!/usr/bin/env nodejs

const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const port = 3000;
const sport = 3443;

const app = express();
app.use(require('helmet')());
app.use(express.static(path.join(__dirname+'/../public')));
app.all('*', ensureSecure);

const options = {
    cert: fs.readFileSync(path.join(__dirname+'/../sslcert/fullchain.pem'), 'utf8'),
    key: fs.readFileSync(path.join(__dirname+'/../sslcert/privkey.pem'), 'utf8')
};

function ensureSecure(req, res, next) { 
    if(req.secure) {
        return next();
    } 
    res.redirect('https://' + req.headers.host)
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/../public/portfolio/index.html'));
});

app.get('/health-check', (req, res) => {res.sendStatus(200)});

app.listen(port, () => console.log(`App listening on port ${port}.`));
https.createServer(options, app).listen(sport, () => console.log(`Secure app is listening on port ${sport}.`));
