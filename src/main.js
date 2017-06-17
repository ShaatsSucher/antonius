'use strict'

requirejs.config({
  baseUrl: 'src',
  paths: {
    lib: '../lib'
  }
})

// Workarunod for PIXI not being correctly defined inside the Assets.load callback
const pixi = PIXI

require(['assets'],
        ( Assets ) => {
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  Assets.load(() => {
    require(['map', 'stage', 'player', 'inventory'],
            ( Map,   Stage,   Player,   Inventory ) => {
      const { Application, Container, Sprite, loader, sound } = pixi
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
        const stage = new Container()

        const sounds = [1,2,3,4,5].map(i => loader.resources[`gans-00${i}`].sound)
        function playRandomSound (count) {
          return () => {
            if (count <= 0) return
            const random = Math.floor(Math.random() * 5)
            const nextSound = sounds[random]
            nextSound.play(playRandomSound(count - 1))
          }
        }
        playRandomSound(10)()

        let anim = loader.resources['walk-cycle']
        anim.animationSpeed = 1 / 8
        anim.play()
        stage.addChild(anim)

        app.stage.addChild(stage)
      }
    })
  })
})
