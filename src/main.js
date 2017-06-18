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
        const app = new Application(384, 216, { backgroundColor: 0x000000 })
        // app.autoresize = true
        // app.renderer.resize(window.innerWidth, window.innerHeight)
        app.stage.displayList = new PIXI.DisplayList()

        document.body.appendChild(app.view)

        return app
      }

      function setup() {
        const stage = new Container()

        const sounds = util.range(1, 15).map(i => {
          const res = loader.resources[`gans-${util.intToString(i, 3)}`]
          return res.sound
        })

        let antonius = new Character({
          idle: util.createAnimation([loader.resources['talk-cycle'][0]], 1 / 8),
          walking: util.createAnimation(loader.resources['walk-cycle'], 1 / 8),
          talking: util.createAnimation(loader.resources['talk-cycle'], 1 / 8)
        }, 100, 100)
        const talkingShort = util.range(1, 101).map(i => PIXI.loader.resources[`antonius-short-${util.intToString(i, 3)}`].sound)
        const talkingLong = util.range(1, 31).map(i => PIXI.loader.resources[`antonius-long-${util.intToString(i, 3)}`].sound)
        antonius.talk = function talk(sequence, done) {
          let seq = sequence.split('')
          function playNext() {
            if (seq.length == 0) return done && done()
            const samples = seq.shift() == 's' ? talkingShort : talkingLong
            const random = Math.floor(Math.random() * samples.length)
            const sound = samples[random]
            sound.play(playNext)
          }
          playNext()
        }

        const stages = {
          bard: new Stage.BardStage(antonius),
          head: new Stage.HeadStage(antonius)
        }

        Object.keys(stages).forEach((key) => {
          stages[key].stages = stages
          stage.addChild(stages[key])
        })

        app.stage.addChild(stage)
        app.stage.addChild(antonius)

        let startButton = new PIXI.Text('START', {
          fontFamily: 'Arial',
          fontSize: 40,
          fill: 'white',
          stroke: 'black',
          strokeThickness: 5
        })

        // Position the button
        startButton.x = (app.renderer.width - startButton.width) / 2;
        startButton.y = (app.renderer.height - startButton.height) / 2;

        // Enable interactivity on the button
        startButton.interactive = true;
        startButton.buttonMode = true;

        app.stage.addChild(startButton)

        startButton.on('pointertap', playVideo)

        function playVideo() {
          startButton.destroy()

          // let videoTexture = PIXI.Texture.fromVideo("vid/cutscene.mp4");
          // let videoSprite = new PIXI.Sprite(videoTexture);
          //
          // // Stetch the fullscreen
          // videoSprite.width = app.renderer.width;
          // videoSprite.height = app.renderer.height;
          //
          // app.stage.addChild(videoSprite)
          //
          // util.wait(83, () => {
          //   console.log('foo')
          //   videoSprite._texture.baseTexture.source.pause()
          //   videoSprite.destroy()
          //

            stages.head.show()
            stages.head.scene1()
          // })
        }
      }
    })
  })
})
