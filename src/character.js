'use strict'

define(() => {
  class Character extends PIXI.Container {
    constructor(animations, posX, posY) {
      super()
      this.x = posX
      this.y = posY
      this.pivot = new PIXI.Point(16, 32)
      this.animations = animations

      for (let key of Object.keys(this.animations)) {
        const animation = this.animations[key]
        this.addChild(animation)
        animation.visible = false
      }

      this.state = Object.keys(animations)[0]
      this.width = this.activeAnimation.width
      this.height = this.activeAnimation.height

      this.text = new PIXI.Text("ihre Werbung hier!", {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 'white',
          align: 'left'
      });
      this.text.visible = false
      this.addChild(this.text)
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
      this.activeAnimation = this.animations[newState]
    }

    get state() {
      return this._state
    }

    faceLeft() {
      this.activeAnimation.scale = new PIXI.Point(Math.abs(this.activeAnimation.scale.x), this.activeAnimation.scale.y)
    }

    faceRight() {
      this.activeAnimation.scale = new PIXI.Point(-Math.abs(this.activeAnimation.scale.x), this.activeAnimation.scale.y)
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
