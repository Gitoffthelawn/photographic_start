"use strict";

class PhotoRandomizerEngine {
  constructor () {
    this.history_manager = Storage().history_manager
    this.feed = Feed()
  }

  async pick () {
    // Pivot the feed of images by matching them up with history items
    // and then grouping by the number of times this browser has seen
    // the image.
    let sorted_images = []
    await this.feed.ensureFetched()

    for (let feed_image of this.feed.images) {
      let history_image = this.history_manager.history.find(history_item => history_item.id == feed_image.id)

      let seen_count = 0
      if (history_image) seen_count = history_image.seen_count

      if (sorted_images[seen_count] === undefined)
        sorted_images[seen_count] = []

      sorted_images[seen_count].push(feed_image)
    }

    // The first slot in the array represents the collection of images
    // which have been viewed the fewest times.
    const seen_the_least = sorted_images.find(list => list && list.length > 0)

    if (! seen_the_least) return

    console.info(`Choosing from ${seen_the_least.length} images which have been seen the least.`)

    // Randomly choose one of the images which has been seen the least.
    const number = parseInt(Math.random() * seen_the_least.length)
    return seen_the_least[number]
  }
}

const photo_randomizer_instance = new PhotoRandomizerEngine()
const PhotoRandomizer = () => photo_randomizer_instance
