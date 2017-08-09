/**
 * Crawler class
 *
 */

const cheerio = require('cheerio');
const helper = require('./helpers');
const rp = require('request-promise');
const objectAssign = require('object-assign');

class Crawler {

    constructor(body, options, linksArray, callback) {
        this.body = body;
        this.options = options || {};
        this.allLinks = linksArray;

        this.result = {};
        this.visited = [];
        this.linksCount = 0;

        this.callback = callback;
    }

    startCrawling() {
        this.allLinks = [...this.allLinks, ...this.getAllLinks([this.visited]).links];
        this.getAnotherPage();
    }

    loadNextBody(url) {
        this.visited.push(url);
        this.linksCount ++;
        return rp(url, (err, response, body) => {})
    }

    traversBody() {
        return cheerio.load(this.body);
    }

    getAllLinks(filter = [], forCrawl = true) {
        let $ = this.traversBody();

        // let testArr = ['kamil', 'ania', 'alicja', 'ania', 'kamil'];
        // console.log([...new Set(testArr)]);
        // return;

        return {
            links: helper.retrieveAllHrefAttributes($('a'), this.options.domain, filter, forCrawl),
            images: helper.retrieveAllHrefAttributes($('img'), this.options.domain, filter, forCrawl)
        };
    }

    getAnotherPage() {

        let nextUrl = this.getNextProperUrl();

        if (nextUrl === undefined) {
            this.callback(this.result, this.linksCount);
            return false;
        }

        this.loadNextBody(nextUrl)
            .then((body) => {
                this.body = body;
                this.result[nextUrl] = {
                    links: helper.createLinksTreeInObject(this.getAllLinks([], false).links),
                    images: helper.createLinksTreeInObject(this.getAllLinks([], false).images)
                };
                this.allLinks = [...this.allLinks, ...this.getAllLinks(this.visited).links];
            }, (err) => {
                console.error('URL access denied');
            })
            .then(() => {
                console.log('=================another');
                this.getAnotherPage()
            })
    }

    getNextProperUrl() {
        let nextUrl;

        do {
            nextUrl = this.allLinks.pop();
        }
        while (this.visited.indexOf(nextUrl) !== -1);

        console.log('pop ' + this.allLinks.length);
        console.log('next url: ' + nextUrl);

        return nextUrl;

    }
}

module.exports = Crawler;