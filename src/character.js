'use strict'

define(() => {
  class Character extends PIXI.Container {
    constructor(animations, posX, posY, states, defaultState) {
      super()
      this.x = posX
      this.y = posY
      this.pivot = new PIXI.Point(16, 32)
      this.animations = animations

      this.states = {}
      Object.keys(animations).forEach(name => {
        this.states[name] = function() {
          this.activeAnimation = this.animations[name]
        }
      })
      Object.keys(states || {}).forEach(name => {
        this.states[name] = states[name]
      })

      for (let key of Object.keys(this.animations)) {
        const animation = this.animations[key]
        this.addChild(animation)
        animation.visible = false
      }

      this.state = defaultState || Object.keys(this.states)[0]
      if (!this.activeAnimation) {
        this.activeAnimation = this.animations[Object.keys(this.animations)[0]]
      }
      console.dir(this.activeAnimation)
      this.width = this.activeAnimation.width
      this.height = this.activeAnimation.height
    }

    get activeAnimation() {
      return this._activeAnimation
    }

    set activeAnimation(animation) {
      if (this._activeAnimation) {
        this.activeAnimation.stop && this.activeAnimation.stop()
        this.activeAnimation.visible = false
      }
      this._activeAnimation = animation
      this.activeAnimation.visible = true
      this.activeAnimation.gotoAndPlay && this.activeAnimation.gotoAndPlay(0)
    }

    set state(newState) {
      this._state = newState
      if (this.states[newState]) {
        this.states[newState].call(this)
      }
    }

    get state() {
      return this._state
    }

    faceLeft() {
      this.scale = new PIXI.Point(Math.abs(this.scale.x), this.scale.y)
    }

    faceRight() {
      this.scale = new PIXI.Point(-Math.abs(this.scale.x), this.scale.y)
    }

    get clickable() {
      return this.interactive && this.buttonMode
    }

    set clickable(value) {
      this.interactive = this.buttonMode = value
    }

    moveTo(x, y, speed, done) {
      speed /= PIXI.ticker.shared.FPS
      const initialX = this.x
      const initialY = this.y
      const dx = x - initialX
      const dy = y - initialY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const ndx = dx * speed / distance
      const ndy = dy * speed / distance

      let time = 0
      let endTime = distance / speed

      if (dx > 0) {
        this.faceRight()
      } else {
        this.faceLeft()
      }

      self = this
      function tickerListener(deltaT) {
        time += deltaT
        if (time >= endTime) {
          self.x = x
          self.y = y
          PIXI.ticker.shared.remove(tickerListener)
          return done && done()
        }
        self.x += ndx * deltaT
        self.y += ndy * deltaT
      }
      PIXI.ticker.shared.add(tickerListener)
    }

    say(string) {

    }
  }

  return Character
})
