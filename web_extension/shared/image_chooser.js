"use strict";

import Storage from './storage_manager.js'
import Feed from './photo_feed.js'
import PhotoRandomizer from './photo_randomizer_engine.js'

export default class ImageChooser {
  constructor () {
    this.history_manager = Storage.history_manager
    this.cache = Storage.photo_cache
    this.sorted_history = null
    this.sorted = false

    Feed.ensureFetched()
  }

  async sortHistory () {
    if (this.sorted) return
    this.sorted = true

    await this.history_manager.ensureRead()
    this.sorted_history = this.history_manager.history.sort(
      (a,b) => new Date(a.last_seen_at) - new Date(b.last_seen_at)
    )
  }

  // Fetches an image and tracks the view count.
  async choose() {
    const cache = Storage.cache
    await cache.ensureRead()
    const image = await this.cache.pop()

    if (image) {
      this.#incrementViewCount(image)
    }

    return image
  }

  async #incrementViewCount(image) {
    const history = Storage.history_manager
    await history.ensureRead()
    history.increment(image)
  }

  // Checks to see if a candidate history position is within the realm of
  // retrievable history. A history position of 0 is the current image, -1
  // is the previous image, and so on.
  validHistoryOffset(history_position) {
    return history_position <= 0 && history_position * -1 < this.sorted_history.length - 1
  }

  // Returns the image at the specified history position.
  historicalImage(history_position) {
    if (! this.validHistoryOffset(history_position)) return

    const offset = this.sorted_history.length - 1 + history_position
    const image_id = this.sorted_history[offset].id
    const image_object = Feed.find(image_id)
    return image_object
  }
}
