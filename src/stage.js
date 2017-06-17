'use strict'

define(() => {
  class Stage extends PIXI.Container {
    constructor(background, character) {
      super()
      this.addChild(background)
      this.visible = false
      this.stages = { }
    }

    beforeShow(previousStage) { }
  }

  return Stage
})
