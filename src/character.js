'use strict'

define(() => {
  class Character extends PIXI.Container {
    constructor(animations, posX, posY, states, defaultState) {
      super()
      this.x = posX
      this.y = posY
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
      this.defaultState = defaultState || Object.keys(this.states)[0]

      for (let key of Object.keys(this.animations)) {
        const animation = this.animations[key]
        this.addChild(animation)
        animation.visible = false
      }
    }

    show() {
      this.state = this.defaultState
      if (!this.activeAnimation) {
        this.activeAnimation = this.animations[Object.keys(this.animations)[0]]
      }
      this.visible = true
    }

    hide() {
      this.visible = false
    }

    get sizeMultiplier() {
      return this._sizeMultiplier
    }

    set sizeMultiplier(value) {
      this._sizeMultiplier = value
      Object.keys(this.animations).forEach(key => {
        const animation = this.animations[key]
        const scaleX = value * Math.sign(animation.scale.x)
        const scaleY = value * Math.sign(animation.scale.y)
        animation.scale = new PIXI.Point(scaleX, scaleY)
        animation.pivot = new PIXI.Point(Math.abs(animation.width) / 2 / value, 0)
      })
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
      this.width = this.activeAnimation.width
      this.height = this.activeAnimation.height
      this.activeAnimation.visible = true
      this.activeAnimation.gotoAndPlay && this.activeAnimation.gotoAndPlay(0)
    }

    set state(newState) {
      if (this._state == newState) return
      this._state = newState
      if (this.states[newState]) {
        this.states[newState].call(this)
      }
    }

    get state() {
      return this._state
    }

    faceLeft() {
      Object.keys(this.animations).forEach(key => {
        const animation = this.animations[key]
        animation.scale = new PIXI.Point(Math.abs(animation.scale.x), animation.scale.y)
      })
    }

    faceRight() {
      Object.keys(this.animations).forEach(key => {
        const animation = this.animations[key]
        animation.scale = new PIXI.Point(-Math.abs(animation.scale.x), animation.scale.y)
      })
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

    say(string, done) {
      // create some white text using the Snippet webfont
      this.text.setText(string)
      this.text.visible = true

      let time = 0
      let ttl = 100

      PIXI.ticker.shared.remove(tickerListener)

      self = this
      function tickerListener(deltaT) {
        time += deltaT
        if (time >= ttl) {
          self.text.visible = false
          PIXI.ticker.shared.remove(tickerListener)
          return done && done()
        }
      }
      PIXI.ticker.shared.add(tickerListener)

    }
  }

  return Character
})
