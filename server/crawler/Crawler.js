/**
 * Crawler class
 *
 */

const cheerio = require('cheerio');
const helper = require('./helpers');
const rp = require('request-promise');

class Crawler {

    constructor(body, options, linksArray, callback) {
        this.body = body;
        this.options = options || {};
        this.allLinks = linksArray;

        this.result = {};
        this.visited = linksArray;

        this.callback = callback;
    }

    startCrawling() {
        this.allLinks = [...this.allLinks, ...this.getAllLinks([this.visited])];
        this.getAnotherPage();
    }

    loadNextBody(url) {
        this.visited.push(url);
        return rp(url, (err, response, body) => {})
    }

    traversBody() {
        return cheerio.load(this.body);
    }

    getAllLinks(filter = [], forCrawl = true) {
        let $ = this.traversBody();
        return helper.retrieveAllHrefAttributes($('a' || 'img'), this.options.domain, filter, forCrawl);
    }

    getAnotherPage() {

        let nextUrl = this.getNextProperUrl();

        if (nextUrl === undefined) {
            this.callback(this.result);
            return false;
        }

        this.loadNextBody(nextUrl)
            .then((body) => {
                this.body = body;
                this.result[nextUrl] = helper.createLinksTreeInObject(this.getAllLinks([], false));
                this.allLinks = [...this.allLinks, ...this.getAllLinks(this.visited)];

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