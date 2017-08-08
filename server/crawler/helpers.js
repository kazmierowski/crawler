

const isValidLink = (link, domain) => {
    return /^(f|ht)tps?:\/\//i.test(link) && checkDomainValidity(retrieveDomainFromUrl(link), domain);
};

const retrieveAllHrefAttributes = (allLinkObjects, domain) => {
    let allLinks = [];

    allLinkObjects.each((i, link) => {
        if(isValidLink(link.attribs.href, domain)) allLinks.push(link.attribs.href)
    });

    return allLinks;
};

const retrieveDomainFromUrl = (url) => {

    let domain;

    url.indexOf("://") > -1 ?
        domain = url.split('/')[2] : domain = url.split('/')[0];

    domain = domain.split(':')[0];
    domain = domain.split('?')[0];

    return domain;
};

const checkDomainValidity = (testDomain, domain) => {
    return testDomain === domain;
};

module.exports.isValidLink = isValidLink;
module.exports.retrieveAllHrefAttributes = retrieveAllHrefAttributes;
module.exports.retrieveDomainFromUrl = retrieveDomainFromUrl;
module.exports.checkDomainValidity = checkDomainValidity;