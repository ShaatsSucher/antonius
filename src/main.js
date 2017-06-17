'use strict'

requirejs.config({
  baseUrl: 'src',
  paths: {
    lib: '../lib'
  }
})

require(['lib/pixi.min', 'assets'],
        ( PIXI,           Assets ) => {
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  Assets.load(() => {
    require(['map', 'stage', 'player', 'inventory'],
            ( Map,   Stage,   Player,   Inventory ) => {
      const { Application, Container, Sprite, loader } = PIXI
      const { resources } = loader
      const app = initRenderer()

      setup()

      function initRenderer() {
        const app = new Application(384, 260, { backgroundColor: 0x00deff })
        app.view.style.position = 'absolute'
        app.view.style.display = 'block'
        // app.autoresize = true
        // app.renderer.resize(window.innerWidth, window.innerHeight)

        document.body.appendChild(app.view)

        return app
      }

      function setup() {
        const frames = [1,2,3,4]
          .map(i => `placeholder-${i}`)
          .map(name => loader.resources[name].texture)

        const stage = new Container()

        let anim = loader.resources['walk-cycle']
        anim.animationSpeed = 1 / 8
        anim.play()
        stage.addChild(anim)

        app.stage.addChild(stage)
      }
    })
  })
})
