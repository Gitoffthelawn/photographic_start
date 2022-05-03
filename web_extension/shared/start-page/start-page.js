"use strict";

import BaseComponent from '../lib/base-component.js'
import Builder from '../lib/builder.js'
import ImageChooser from '../image_chooser.js'
import InfoBox from '../../shared/info-box/info-box.js'
import Storage from '../storage_manager.js'

export default class StartPage extends BaseComponent {
  #history_offset = 0
  #chooser = null

  constructor () {
    super()

    this.attachCSS('../shared/start-page/start-page.css')
    this.attachHTML('../shared/start-page/start-page.html')
    this.cache = Storage.cache
    this.cache.onImageAdded((image) => {
      this.preload(image)
    })

    this.#chooser = new ImageChooser()
  }

  async readyCallback () {
    this.info_box = this.shadowRoot.querySelector('body').appendChild(Builder.tag('info-box'))

    this.#chooser.choose().then(image => this.image = image)

    this.cache.topUp()
  }

  async navigate(offset) {
    // Moving forward (fetching a new image on demand) is disabled for now
    // because the logic which decides if it is time to fetch a new image lives
    // far down in the cache and it needs to be moved in order for this
    // feature to be usable.

    // If moving forward in time, fetch an image from the cache and exit
    // if (offset > 0 && this.#history_offset == 0)
    //   return this.#chooser.choose().then(image => this.image = image)

    // If moving backwards, instead fetch an image from history
    await this.#chooser.sortHistory()
    const new_offset = this.#history_offset + offset

    if (! this.#chooser.validHistoryOffset(new_offset)) return

    this.#history_offset = new_offset
    this.image = this.#chooser.historicalImage(this.#history_offset)

    if (this.#chooser.validHistoryOffset(this.#history_offset + offset))
      this.preload(this.#chooser.historicalImage(this.#history_offset + offset))
  }

  set image (image) {
    if (typeof image === 'undefined') return console.error('no image provided to viewer#set')

    this.info_box.image = image

    this.shadowRoot.querySelector('background')
      .style
      .setProperty('background-image', `url(${image.url})`)
  }

  preload(image) {
    const prefetch = this.shadowRoot.querySelector('prefetch')
    const alreadyLoaded = prefetch.querySelectorAll(`[data-image-id*="${image.id}"]`).length > 0

    if (alreadyLoaded) return
    prefetch.appendChild(Builder.img(image))
  }
}

customElements.define('start-page', StartPage)
