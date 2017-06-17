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
    require(['map', 'stage', 'character', 'inventory', 'util'],
            ( Map,   Stage,   Character,   Inventory,   util ) => {
      const { Application, Container, Sprite, loader, sound } = pixi
      const { resources } = loader
      const app = initRenderer()

      setup()

      function initRenderer() {
        const app = new Application(384, 216, { backgroundColor: 0x00deff })
        app.view.style.position = 'absolute'
        app.view.style.display = 'block'
        // app.autoresize = true
        // app.renderer.resize(window.innerWidth, window.innerHeight)

        document.body.appendChild(app.view)

        return app
      }

      function setup() {
        const stage = new Container()

        const sounds = util.range(1, 15).map(i => {
          const res = loader.resources[`gans-${util.intToString(i, 3)}`]
          return res.sound
        })

        function playRandomSound (count) {
          return () => {
            if (count <= 0) return
            const random = Math.floor(Math.random() * sounds.length)
            const nextSound = sounds[random]
            nextSound.play(playRandomSound(count - 1))
          }
        }

        let antonius = new Character({
          walking: util.createAnimation(loader.resources['walk-cycle'], 1 / 8)
        }, 100, 100)
        antonius.clickable = true
        antonius.scale = new pixi.Point(2, 2)
        antonius.on('pointerdown', () => {
          playRandomSound(5)()
        })

        const stages = {
          bard: new Stage(new pixi.Sprite(loader.resources['background-bard'].texture), antonius),
          head: new Stage(new pixi.Sprite(loader.resources['background-head'].texture), antonius)
        }

        function moveToRandomLocation() {
          const rx = Math.floor(32 / 2 + Math.random() * (app.renderer.width - 32 / 2))
          const ry = Math.floor(antonius.height / 2 + Math.random() * (app.renderer.height - antonius.height / 2))
          antonius.moveTo(rx, ry, 40, moveToRandomLocation)
        }
        moveToRandomLocation()

        Object.keys(stages).forEach((key) => {
          stages[key].stages = stages
          stage.addChild(stages[key])
        })
        stage.addChild(antonius)

        stages.head.visible = true
        antonius.visible = true

        app.stage.addChild(stage)
      }
    })
  })
})
