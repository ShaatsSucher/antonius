'use strict'

requirejs.config({
  baseUrl: 'src',
  paths: {
    lib: '../lib'
  }
})

require(['lib/pixi.min', 'map', 'stage', 'player', 'inventory'],
        ( PIXI,           Map,   Stage,   Player,   Inventory ) => {

  const { Container, Sprite, loader } = PIXI
  const { resources } = loader
  const { stage, renderer } = init()

  loader
    .add([
      'img/placeholder-1.png',
      'img/placeholder-2.png',
      'img/placeholder-3.png',
      'img/placeholder-4.png'
    ])
    .on('progress', loadProgressHandler)
    .load(setup)

  function setup() {
    console.log('All files loaded')

    const sprites = [1,2,3,4]
      .map(i => `img/placeholder-${i}.png`)
      .map(name => loader.resources[name].texture)
      .map(texture => new Sprite(texture))

    sprites.forEach(sprite => {
      stage.addChild(sprite)
    })

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
