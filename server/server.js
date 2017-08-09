const express = require('express');
const request = require('request');
const http = require('http');
const fs = require('fs');
const app = express();

const Crawler = require('./crawler/Crawler');
const helper = require('./crawler/helpers');

const port = '5000';
const dir = './tmp';

app.get('/crawl', (req, res) => {

    let url = ['http://wiprodigital.com/'];
    let domain = helper.retrieveDomainFromUrl(url[0]);

    request(url[0], (err, response, body) => {

        if (err) throw err;

        let timeStart = new Date();
        let crawl = new Crawler(body, {domain: domain}, url, (data, linksCount) => {

            if (!fs.existsSync(dir)) fs.mkdirSync(dir);

            fs.writeFile('./tmp/result.json', JSON.stringify(data), (err) => {
                if (err) throw err;
                console.log('File with result is saved in ./tmp/result.json');
            });
            console.log('Total number of visited links: ', linksCount);
            console.log('Execution time: ', (new Date() - timeStart) / 1000, 's');
        });

        crawl.startCrawling();
    })
});

const server = http.createServer(app);

server.listen(port, (err) => {
    console.log(err ? err : `API running on localhost:${{port}}`);
});