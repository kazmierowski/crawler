const express = require('express');
const request = require('request');
// const cheerio = require('cheerio');
const http    = require('http');
const app     = express();

const Crawler = require('./crawler/Crawler');
const helper  = require('./crawler/helpers');

const port = '5000';

app.get('/crawl', (req, res) => {

    let url = 'http://wiprodigital.com';
    let domain = helper.retrieveDomainFromUrl(url);

    request(url, (err, response, body) => {

        let crawl = new Crawler(body, {domain: domain});

        if(err) { throw err }
        else {
            // let html = cheerio.load(body);
        }
    })
});

const server = http.createServer(app);

server.listen(port, (err) => {
    console.log(err ? err : `API running on localhost:${{port}}`);
});