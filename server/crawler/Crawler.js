/**
 * Crawler class
 *
 */

const cheerio = require('cheerio');
const helper  = require('./helpers');

class Crawler {

    constructor(body, options) {
        this.body = body;
        this.options = options || {};
        this.allLinks = this.getAllLinks();

        console.log(this.allLinks)
    }

    traversBody() {
        return cheerio.load(this.body);
    }

    getAllLinks() {
        let $ = this.traversBody();

        return helper.retrieveAllHrefAttributes($('a'), this.options.domain);
    }
}

module.exports = Crawler;