# CRAWLER


Web **crawler** for single domain.

## System

* NodeJS: `v8.2.1`
* npm: `v5.3.0`

## Build

Clone the repo to your directory and run `npm install`. <br />
Crawler is ready to go!

## Run
Now application is set up to run automatically after server start.

To start server:
1. for default option type in your command line: `npm run serve`. This will start server with default wep page setup: http://wiprodigital.com/
2. for custom option type in your command line: `npm run serve domain` where domain is your domain name that you want to crawl on 

## What we can / should change with more time
1. Front-end accessibility (backend code is ready)
2. Unit tests
3. Update `getAllLinks()` inside *Crawler* class to go through html once (better performance)
4. Update exception handling for sites with dead end links (for example order page with dynamic url generation)
5. We can create pseudo *'abstract'* class and than create more universal crawlers | in the same time we can use provided `options` as a extension for already created class.
6. We can add generators in couple of places 
7. Support for different links version / www.wp.pl / wp.pl /
8. Use of `node-worker-farm` to spread the task to couple different nodes
9. Add clustering for better performance with more than one request