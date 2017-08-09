/**
 * Custom helpers module
 *      helpers used to reduce class code / redundancy and improve readability
 *
 * @author [kamil.kazmierowski@gmail.com]
 */

/**
 * Checks if provided link is valid as a crawling link
 *
 * @param {string} link
 * @param {string} domain - domain against which link is tested
 *
 * @returns {boolean}
 */
const isValidLinkForCrawling = (link, domain) => {

    return link !== undefined ?
        (isValidLink(link) && checkDomainValidity(retrieveDomainFromUrl(link), domain)) || link.charAt(0) === '/' : false;
};

/**
 * Checks if provided string is a valid link
 *
 * @param {string} link
 *
 * @returns {boolean}
 */
const isValidLink = (link) => {
    return /^(f|ht)tps?:\/\//i.test(link)
};

/**
 * Retrieve href / src attributes from provided cheerio objects
 *
 * @param {Object} allLinkObjects
 * @param {string} domain - domain against which link is tested
 * @param {Array} filter - filter used to remove duplications from links array | default : []
 * @param {boolean} forCrawl - determines if retrieves links for crawling | default : true
 *
 * @returns {Array}
 */
const retrieveAllUrlAttributes = (allLinkObjects, domain, filter = [], forCrawl = true) => {
    let allLinks = [];
    let option = forCrawl ? isValidLinkForCrawling : isValidLink;

    allLinkObjects.each((i, object) => {
        if(option(object.attribs.href, domain) && filter.indexOf(object.attribs.href) === -1) {
            allLinks.push(
                object.attribs.href.charAt(0) === '/' ?
                    'http://' + domain + object.attribs.href : object.attribs.href
            )
        }

        else if(option(object.attribs.src) && filter.indexOf(object.attribs.src) === -1) {
            allLinks.push(
                object.attribs.src.charAt(0) === '/' ?
                    'http://' + domain + object.attribs.src : object.attribs.src
            )
        }
    });

    return [...new Set(allLinks)];
};

/**
 * Retrieves domain name from url
 *
 * @param {string} url
 *
 * @returns {string}
 */
const retrieveDomainFromUrl = (url) => {

    let domain;

    url.indexOf("://") > -1 ?
        domain = url.split('/')[2] : domain = url.split('/')[0];

    domain = domain.split(':')[0];
    domain = domain.split('?')[0];

    // console.log(domain);
    return domain;
};

/**
 * Checks if test domain is equal to domain
 *
 * @param {string} testDomain
 * @param {string} domain
 *
 * @returns {boolean}
 */
const checkDomainValidity = (testDomain, domain) => {
    return testDomain === domain;
};

/**
 * Creates object from array
 *
 * @param {Array} links - array of links to be transformed
 *
 * @returns {Object}
 */
const createLinksTreeInObject = (links = []) => {
    return links.reduce(function(acc, cur, i) {
        acc[i] = cur;
        return acc;
    }, {});
};

module.exports.isValidLinkForCrawling = isValidLinkForCrawling;
module.exports.isValidLink = isValidLink;
module.exports.retrieveAllUrlAttributes = retrieveAllUrlAttributes;
module.exports.retrieveDomainFromUrl = retrieveDomainFromUrl;
module.exports.checkDomainValidity = checkDomainValidity;
module.exports.createLinksTreeInObject = createLinksTreeInObject;