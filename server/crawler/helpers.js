

const isValidLinkForCrawling = (link, domain) => {

    return link !== undefined ?
        (isValidLink(link) && checkDomainValidity(retrieveDomainFromUrl(link), domain)) || link.charAt(0) === '/' : false;
};

const isValidLink = (link) => {
    return /^(f|ht)tps?:\/\//i.test(link)
};

const retrieveAllHrefAttributes = (allLinkObjects, domain, filter, destination) => {
    let allLinks = [];
    let option = destination ? isValidLinkForCrawling : isValidLink;

    allLinkObjects.each((i, link) => {
        if(option(link.attribs.href, domain) && filter.indexOf(link.attribs.href) === -1) {
            allLinks.push(
                link.attribs.href.charAt(0) === '/' ?
                    'http://' + domain + link.attribs.href : link.attribs.href
            )
        }
    });

    return allLinks;
};

const retrieveDomainFromUrl = (url) => {

    let domain;

    url.indexOf("://") > -1 ?
        domain = url.split('/')[2] : domain = url.split('/')[0];

    domain = domain.split(':')[0];
    domain = domain.split('?')[0];

    // console.log(domain);
    return domain;
};

const checkDomainValidity = (testDomain, domain) => {
    return testDomain === domain;
};

const createLinksTreeInObject = (links = []) => {
    return links.reduce(function(acc, cur, i) {
        acc[i] = cur;
        return acc;
    }, {});
};

module.exports.isValidLinkForCrawling = isValidLinkForCrawling;
module.exports.isValidLink = isValidLink;
module.exports.retrieveAllHrefAttributes = retrieveAllHrefAttributes;
module.exports.retrieveDomainFromUrl = retrieveDomainFromUrl;
module.exports.checkDomainValidity = checkDomainValidity;
module.exports.createLinksTreeInObject = createLinksTreeInObject;