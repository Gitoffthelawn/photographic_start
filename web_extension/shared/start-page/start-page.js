"use strict";

import BaseComponent from '../lib/base-component.js'
import Builder from '../lib/builder.js'
import ImageChooser from '../../shared/image_chooser.js'
import InfoBox from '../../shared/info-box/info-box.js'

export default class StartPage extends BaseComponent {
  constructor () {
    super()

    this.attachCSS('../shared/start-page/start-page.css')
    this.attachHTML('../shared/start-page/start-page.html')
  }

  async readyCallback () {
    this.info_box = this.shadowRoot.querySelector('body').appendChild(Builder.tag('info-box'))
  }

  set image (image) {
    if (typeof image === 'undefined') return console.error('no image provided to viewer#set')

    this.shadowRoot.querySelector('background')
      .style
      .setProperty('background-image', `url(${image.url})`)
  }

  preloadHistory(image) {
    this.shadowRoot.querySelector('prefetch').appendChild(Builder.img(image))
  }
}

customElements.define('start-page', StartPage)
