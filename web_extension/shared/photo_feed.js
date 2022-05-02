"use strict";

import Storage from './storage_manager.js';

class PhotoFeed {
  #fetched = false
  #fetchingPromise = null

  constructor () {
    this.parsed_feed = null
    this.#fetched = false
  }

  async ensureFetched() {
    if (this.fetched)
      return true

    if (this.fetchingPromise)
      return this.fetchingPromise

    this.fetchingPromise = this.#downloadFeed()
    return this.fetchingPromise
  }

  async #downloadFeed () {
    let result
    const feed_options = Storage.feed_options
    await feed_options.ensureRead()
    const urls = feed_options.searchUrls

    while (urls.length > 0) {
      const url = urls.shift()
      console.info(`Fetching feed data from ${url}.`)
      result = await this.#fetchFeed(url)
      if (result) break
    }

    this.parsed_feed = result
  }

  async #fetchFeed (url) {
    if (typeof url == "undefined") return

    return fetch(
        url, { redirect: "follow", referrer: "no-referrer", credentials: "omit" }
      )
    .then(feed => feed.json())
    .then(feed => feed.items)
    .catch((e) => {
      console.error(`Error fetching feed (${url}):`, e)
      return null
    })
  }

  get images () {
    return this.parsed_feed
  }

  find(image_id) {
    return this.images.find(image => image.id == image_id)
  }
}

export default new PhotoFeed()
