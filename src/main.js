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
            ( Map,   Stage,  Character,   Inventory,   util ) => {
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

        let antonius = new Character({
          walking: util.createAnimation(loader.resources['walk-cycle'], 1 / 8)
        }, 100, 100)
        antonius.clickable = true
        antonius.scale = new pixi.Point(2, 2)

        const sounds = util.range(1, 15).map(i => {
          const res = loader.resources[`gans-${util.intToString(i, 3)}`]
          return res.sound
        })
        antonius.on('pointerdown', () => {
          util.playRandomSound(sounds, 5)
        })

        const stages = {
          bard: new Stage.BardStage('background-bard', antonius),
          head: new Stage.HeadStage(antonius)
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

        stages.bard.visible = true
        antonius.visible = true

        app.stage.addChild(stage)
      }
    })
  })
})
