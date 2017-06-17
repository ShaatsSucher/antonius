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
    require(['map', 'stage', 'player', 'inventory', 'util'],
            ( Map,   Stage,   Player,   Inventory,   util ) => {
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

        const test = util.range(1, 15).map(i => util.intToString(i, 3))
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

        let anim = loader.resources['walk-cycle']
        anim.animationSpeed = 1 / 8
        anim.play()
        anim.interactive = true
        anim.buttonMode = true
        anim.on('pointerdown', () => {
          playRandomSound(5)()
        })

        function moveTo(x, y, t, done) {
          let time = 0
          const initialX = anim.x
          const initialY = anim.y
          function tickerListener(deltaT) {
            time += deltaT
            let percent = time / t
            if (percent > 1) {
              anim.x = x
              anim.y = y
              app.ticker.remove(tickerListener)
              return done && done()
            }
            anim.x = initialX + (x - initialX) * percent
            anim.y = initialY + (y - initialY) * percent
          }
          app.ticker.add(tickerListener)
        }

        function moveToRandomLocation() {
          const rx = Math.floor(Math.random() * (app.renderer.width - anim.width))
          const ry = Math.floor(Math.random() * (app.renderer.height - anim.height))
          moveTo(rx, ry, 200, moveToRandomLocation)
        }
        moveToRandomLocation()

        stage.addChild(anim)

        app.stage.addChild(stage)
      }
    })
  })
})
