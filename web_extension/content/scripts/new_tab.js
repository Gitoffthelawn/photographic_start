'use strict';

import Builder from '../../shared/lib/builder.js'
import StartPage from '../../shared/start-page/start-page.js'
import SettingsPage from '../../shared/settings-page/settings-page.js'
import Version from '../../shared/version.js'

// injects the start page
const start_page = document.querySelector('body').appendChild(Builder.tag('start-page'))

// Listens for keypresses to switch between images
document.addEventListener('keydown',
  async function (e) {
    switch (e.code) {
      case "ArrowRight":
        // loadImage(1)
        start_page.navigate(1)
        break
      case "ArrowLeft":
        // loadImage(-1)
        start_page.navigate(-1)
        break;
    }
  }
);

// Insert the version number
document.querySelector('body').appendChild(
  Builder.tag('version', Version.number)
)

// Add the settings page and controls
const settings = Builder.tag('settings-page')
settings.classList.add('hidden')
settings.addEventListener('close', () => settings.classList.add('hidden'))
document.querySelector('body').appendChild(settings)

document.querySelector('#gear').addEventListener('click', ()  => {
  document.querySelector('settings-page').classList.toggle('hidden')
})
