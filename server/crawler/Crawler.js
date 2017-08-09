/**
 * Crawler class
 *
 * @uses cheerio
 * @uses custom helpers
 * @uses request-promise
 *
 * @author [kamil.kazmierowski@gmail.com]
 */

const cheerio = require('cheerio');
const helper = require('./helpers');
const rp = require('request-promise');

class Crawler {

    /**
     * @Constructor
     *
     * @param {string} body - body from response
     * @param {Object} options - crawler options
     * @param {Array} linksArray - init array of links to visit
     * @param {function} callback - function to be called after crawling
     */
    constructor(body, options, linksArray, callback) {
        this.body = body;
        this.options = options || {};
        this.queue = linksArray;

        this.visited = [];
        this.linksCount = 0;
        this.result = {};

        this.callback = callback;
    }

    /**
     * Initialize crawling
     *      update links queue with links from the home / starting page
     */
    startCrawling() {
        this.queue = [...this.queue, ...this.getAllLinks([this.visited]).links];
        this.getAnotherPage();
    }

    /**
     * Update visited links array
     * Update visited links count
     * Return request-promise
     *
     * @param {string} url of page to visit
     *
     * @returns {promise} request to the url
     */
    loadNextBody(url) {
        this.visited.push(url);
        this.linksCount ++;
        return rp(url, (err, response, body) => {})
    }

    /**
     * Travers the html
     *
     * @returns {Object} - cheerio DOM object
     */
    traversBody() {
        return cheerio.load(this.body);
    }

    /**
     * Retrieve all image and href url's from provided html
     *
     * @param {Array} filter - filter used to remove duplications from links array | default : []
     * @param {boolean} forCrawl - determines if retrieves links for crawling | default : true
     *
     * @returns {Object} {{links: *, images: *}}
     */
    getAllLinks(filter = [], forCrawl = true) {
        let $ = this.traversBody();

        return {
            links: helper.retrieveAllUrlAttributes($('a'), this.options.domain, filter, forCrawl),
            images: helper.retrieveAllUrlAttributes($('img'), this.options.domain, filter, forCrawl)
        };
    }

    /**
     * Updates result and queue from provided url
     *
     */
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
                this.queue = [...this.queue, ...this.getAllLinks(this.visited).links];
            }, (err) => {
                // because that is the only option
                console.error('URL access denied');
            })
            .then(() => {
                this.getAnotherPage()
            })
    }

    /**
     * Get next valid url from queue | valid === not visited
     *
     * @returns {string} - nex valid url to visit
     */
    getNextProperUrl() {
        let nextUrl;

        do {
            nextUrl = this.queue.pop();
        }
        while (this.visited.indexOf(nextUrl) !== -1);

        // for visualisation - not needed in production
        console.log('pop ' + this.queue.length);
        console.log('next url: ' + nextUrl);
        console.log('==========================');

        return nextUrl;

    }
}

module.exports = Crawler;