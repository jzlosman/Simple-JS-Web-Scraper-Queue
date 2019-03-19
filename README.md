# Simple JS Web Scraper Queue

## Challenge

"Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results."

### Solutions

* Implements topic-based in-memory queue
* Runs a worker to perform web-scraping
* Exposes POST API to request website to be scraped
* Caches websites in DB for future lookups
* Exposes GET API endpoint to check status of request and see result
* Port and Topic configurable with `.env` file (copy  `.env.example`)

### Important Vendor Libs Used

* [in-memory-queue](https://github.com/void666/in-memory-queue#readme) - Queue Service
* [LokiJS](https://github.com/techfort/LokiJS) - Simple NoSQL DB

## Installation
Install the dependencies with
```sh
npm install
```

## Start the Server
Start the server with
```sh
node index.js
```
4 things will happen when you do this:
1. API server will start at **http://127.0.0.1:8080** by default
2. The In-Memory Queue will be created
3. A topic (**webscrapers** by default) will be created
4. A single worker will spin up, subscribing to that topic

## Add a new job to the Queue

To get started, make a **POST** request to the root of the API at **http://127.0.0.1:8080**

The body should be a simple JSON object with a **url** property
```JSON
{
  "url": "http://www.google.com"
}
```

**NOTES:**
* A protocol (http:// or https://) is required. `www.google.com` will return a `422 Unprocessible Entity` because that is not a valid URL and this application will not attempt to guess which protocol you meant to use.

### In-Queue Response

If the URL you are requesting has not already been scraped in your session, your request will be added to a queue and processed.

In this case, your response object will look something like this:

```JSON
{
    "links": {
        "status": "http://127.0.0.1:8080/IG6PSLt6M"
    },
    "data": {
        "queueId": "IG6PSLt6M",
        "url": "http://www.google.com/",
        "processed": false,
        "hasError": null,
        "html": null,
        "meta": {
            "revision": 0,
            "created": 1552974578712,
            "version": 0
        },
        "$loki": 1
    }
}
```
If `processed` is **false** the request has not been completed.  In this case, you can use the `link.status` URL to check the status of the request.

## Retrieve Result

To check the status of a request, use the `queueId` property returned from your request, and make a **GET** request to **http://127.0.0.1:8080/:queueId**

**NOTES:**
* The LokiJS DB is not being persisted by default, so the database is wiped each time the server is started.

### Processed Response

If the URL you are requesting **has already been scraped in your session** or you make a `GET` request to the `links.status` URL and the process has completed, you will see a response that looks like this:

```JSON
{
    "links": {
        "status": "http://127.0.0.1:8080/IG6PSLt6M"
    },
    "data": {
        "queueId": "IG6PSLt6M",
        "url": "http://www.google.com/",
        "processed": true,
        "hasError": false,
        "html": "<html><head><title>Google</title>...</html>",
        "meta": {
            "revision": 1,
            "created": 1552974578712,
            "version": 0,
            "updated": 1552974579924
        },
        "$loki": 3
```

## In-Queue vs Processed Response

`queueId`, `url`, and `links.status` will not change.  

The following properties that will differ between an in-queue response and a processed response:

| Property | In-Queue Value | Processed Value | Description |
| -------- | -------------- | ----------- | ------- |
| processed | `false` | `true` | Has the queue been processed |
| hasError | `null` | `true` or `false` | Was there an error during the scrape |
| html | `null` | `string` | Raw HTML string from scrape |

#### DISCLAIMERS & NOTES

* This was created in an evening, as a coding challenge. As such, I would not recommend this for any real use.
* While Redis is extremely popular for cases such as this, I chose to build a solution that did not depend on Redis.
