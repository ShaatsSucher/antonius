'use strict'

define(['character', 'util'],
       ( Character,   util ) => {
  class Stage extends PIXI.Container {
    constructor(backgroundName, character) {
      super()
      this.addChild(new pixi.Sprite(PIXI.loader.resources[backgroundName].texture))
      this.visible = false
      this.stages = { }
    }

    beforeShow(previousStage) { }
  }

  class HeadStage extends Stage {
    constructor(character) {
      super('background-head', character)

      const head = new Character({
        speaking: util.createAnimation(PIXI.loader.resources['hellmouth-talk-cycle'], 1 / 4)
      }, 135, 80)
      head.animations.speaking.loop = false
      this.addChild(head)

      const sounds = util.range(1, 39).map(i => {
        const res = PIXI.loader.resources[`hellmouth-${util.intToString(i, 3)}`]
        return res.sound
      })
      util.playRandomSound(sounds, -1, () => { head.animations.speaking.gotoAndPlay(0) })
    }
  }

  class BardStage extends Stage {
    constructor(character) {
      super('background-bard', character)
    }
  }

  return { Stage, HeadStage, BardStage }
})
