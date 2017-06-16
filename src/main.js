'use strict'

requirejs.config({
  baseUrl: 'src',
  paths: {
    lib: '../lib'
  }
})

require(['lib/pixi.min', 'assets'],
        ( PIXI,           Assets ) => {
  Assets.load(() => {
    require(['map', 'stage', 'player', 'inventory'],
            ( Map,   Stage,   Player,   Inventory ) => {
      const { Application, Container, Sprite, loader } = PIXI
      const { resources } = loader
      const app = initRenderer()

      setup()

      function initRenderer() {
        const app = new Application(256, 256, { backgroundColor: 0x00deff })
        app.view.style.position = 'absolute'
        app.view.style.display = 'block'
        app.autoresize = true
        app.renderer.resize(window.innerWidth, window.innerHeight)

        document.body.appendChild(app.view)

        return app
      }

      function setup() {
        const sprites = [1,2,3,4]
          .map(i => `placeholder-${i}`)
          .map(name => loader.resources[name].texture)
          .map(texture => new Sprite(texture))

        const stage = new Container()
        sprites.forEach(sprite => {
          stage.addChild(sprite)
        })

        app.stage.addChild(stage)
        stage.alpha = 0.5
      }
    })
  })
})
