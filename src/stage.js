'use strict'

define(['character', 'util'],
       ( Character,   util ) => {
  class Stage extends PIXI.Container {
    constructor(backgroundName, character) {
      super()
      this.addChild(new PIXI.Sprite(PIXI.loader.resources[backgroundName].texture))
      this.visible = false
      this.stages = { }
    }

    transitionTo(newStage) {
      this.visible = false
      newStage.beforeShow(this)
      newStage.visible = true
    }

    beforeShow(previousStage) { }
  }

  class HeadStage extends Stage {
    constructor(character) {
      super('background-head', character)
      const self = this

      const sounds = util.range(1, 39).map(i => {
        const res = PIXI.loader.resources[`hellmouth-${util.intToString(i, 3)}`]
        return res.sound
      })

      const head = new Character({
        speaking: util.createAnimation(PIXI.loader.resources['hellmouth-talk-cycle'], 1 / 4)
      }, 135, 80, {
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
            () => { head.animations.speaking.gotoAndPlay(0) }
          )
        }
      }, 'muted')

      head.clickable = true
      head.on('pointerdown', () => {
        head.state = head.state == 'muted' ? 'speaking' : 'muted'
      })

      this.addChild(head)
    }

    beforeShow(previousStage) {
    }
  }

  class BardStage extends Stage {
    constructor(character) {
      super('background-bard', character)

      const sounds = util.range(1, 15).map(i => {
        const res = PIXI.loader.resources[`gans-${util.intToString(i, 3)}`]
        return res.sound
      })

      const goose = new Character({
        idle: util.createAnimation([PIXI.loader.resources['goose-talk-cycle'][0]], 1 / 8),
        speaking: util.createAnimation(PIXI.loader.resources['goose-talk-cycle'], 1 / 8)
      }, 135, 120, {
        speaking: function() {
          this.activeAnimation = this.animations.speaking
          util.playRandomSound(sounds, 5, null, () => {
            this.state = 'idle'
          })
        }
      })
      goose.scale = new pixi.Point(2, 2)
      goose.clickable = true
      goose.on('pointerdown', () => {
        // util.playRandomSound(sounds, 5)
        goose.state = 'speaking'
      })
      goose.animations.speaking.loop = true
      // goose.activeAnimation.gotoAndPlay(0)
      goose.state = 'idle'

      console.dir(PIXI.loader.resources['goose-talk-cycle'])
      this.addChild(goose)
    }

    beforeShow(previousStage) {
    }
  }

  return { Stage, HeadStage, BardStage }
})
