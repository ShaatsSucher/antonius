'use strict'

requirejs.config({
  baseUrl: 'src',
  paths: {
    lib: '../lib'
  }
})

require(['lib/pixi.min', 'test'], (PIXI, test) => {
  console.log(test.string)

  const { Container, Sprite, loader } = PIXI
  const { resources } = loader
  const { stage, renderer } = init()

  loader
    .on('progress', loadProgressHandler)
    .load(setup)

  function setup() {
    console.log('All files loaded')

    renderer.render(stage)
  }

  function init() {
    const stage = new Container()
    const renderer = PIXI.autoDetectRenderer(256, 256)
    renderer.view.style.position = 'absolute'
    renderer.view.style.display = 'block'
    renderer.autoresize = true
    renderer.resize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.view)

    return { stage, renderer }
  }

  function loadProgressHandler(loader, resource) {
    console.log(`loading ${resource.url}`)
    console.log(`progress: ${loader.progress}%`)
  }
})
