'use strict'

define(['character', 'util'],
       ( Character,   util ) => {
  class Stage extends PIXI.Container {
    constructor(backgroundName, player) {
      super()
      this.addChild(new PIXI.Sprite(PIXI.loader.resources[backgroundName].texture))
      this.player = player
      this.visible = false
      this.stages = { }
    }

    transitionTo(newStage) {
      this.visible = false
      newStage.beforeShow(this)
      newStage.visible = true
    }

    show() {
      this.beforeShow()
      this.visible = true
      this.player.show()
    }

    beforeShow(previousStage) { }
  }

  class HeadStage extends Stage {
    constructor(player) {
      super('background-head', player)

      const nextStage = new PIXI.Sprite(PIXI.loader.resources['placeholder-1'].texture)
      nextStage.scale = new PIXI.Point(.25, .25)
      nextStage.interactive = true
      nextStage.buttonMode = true
      nextStage.on('pointerdown', () => {
        this.transitionTo(this.stages.bard)
      })
      this.addChild(nextStage)

      const self = this

      const sounds = util.range(1, 39).map(i => {
        const res = PIXI.loader.resources[`hellmouth-${util.intToString(i, 3)}`]
        return res.sound
      })

      this.head = new Character({
        speaking: util.createAnimation(PIXI.loader.resources['hellmouth-talk-cycle'], 1 / 4)
      }, 135, 40, {
        muted: function() {
          this.animations.speaking.loop = true
          this.activeAnimation = this.animations.speaking
          this.activeAnimation.gotoAndPlay(0)
        },
        speaking: function() {
          this.animations.speaking.loop = false
          this.activeAnimation = this.animations.speaking
          this.activeAnimation.gotoAndPlay(0)
          util.playRandomSound(
            sounds,
            () => self.visible && this.state == 'speaking',
            () => { self.head.animations.speaking.gotoAndPlay(0) }
          )
        }
      }, 'muted')

      this.head.clickable = true
      this.head.on('pointerdown', () => {
        this.head.state = this.head.state == 'muted' ? 'speaking' : 'muted'
      })

      this.addChild(this.head)
    }

    beforeShow(previousStage) {
      this.head.show()
      this.player.sizeMultiplier = 2
    }
  }

  class BardStage extends Stage {
    constructor(player) {
      super('background-bard', player)

      const nextStage = new PIXI.Sprite(PIXI.loader.resources['placeholder-1'].texture)
      nextStage.scale = new PIXI.Point(.25, .25)
      nextStage.interactive = true
      nextStage.buttonMode = true
      nextStage.on('pointerdown', () => {
        this.transitionTo(this.stages.head)
      })
      this.addChild(nextStage)

      const sounds = util.range(1, 15).map(i => {
        const res = PIXI.loader.resources[`gans-${util.intToString(i, 3)}`]
        return res.sound
      })

      this.goose = new Character({
        idle: util.createAnimation([PIXI.loader.resources['goose-talk-cycle'][0]], 1 / 8),
        speaking: util.createAnimation(PIXI.loader.resources['goose-talk-cycle'], 1 / 8)
      }, 145, 10, {
        speaking: function() {
          this.activeAnimation = this.animations.speaking
          util.playRandomSound(sounds, 5, null, () => {
            this.state = 'idle'
          })
        }
      })
      this.goose.clickable = true
      this.goose.on('pointerdown', () => {
        this.goose.state = 'speaking'
      })
      this.goose.animations.speaking.loop = true
      this.goose.state = 'idle'

      console.dir(PIXI.loader.resources['goose-talk-cycle'])
      this.addChild(this.goose)
    }

    beforeShow(previousStage) {
      this.goose.sizeMultiplier = 3
      this.goose.show()
      this.player.sizeMultiplier = 3
    }
  }

  return { Stage, HeadStage, BardStage }
})
