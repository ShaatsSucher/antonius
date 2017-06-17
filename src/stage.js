'use strict'

define(() => {
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
    }
  }

  class BardStage extends Stage {
    constructor(character) {
      super('background-bard', character)
    }
  }

  return { Stage, HeadStage, BardStage }
})
