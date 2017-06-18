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
      const self = this
      const transitionDuration = 2 * PIXI.ticker.shared.FPS
      PIXI.ticker.shared.add(fadeOut)
      let fadeOutTime = 0
      function fadeOut(dt) {
        fadeOutTime += dt
        self.alpha = Math.max(0, 1 - (fadeOutTime / transitionDuration))
        self.player.alpha = Math.max(0, 1 - (fadeOutTime / transitionDuration))
        if (fadeOutTime >= transitionDuration) {
          PIXI.ticker.shared.remove(fadeOut)
          self.alpha = 0
          self.visible = false
          PIXI.ticker.shared.add(fadeIn)
          newStage.beforeShow(this)
          newStage.visible = true
        }
      }
      let fadeInTime = 0
      function fadeIn(dt) {
        fadeInTime += dt
        newStage.alpha = Math.min(1, fadeInTime / transitionDuration)
        newStage.player.alpha = Math.min(1, fadeInTime / transitionDuration)
        if (fadeInTime >= transitionDuration) {
          PIXI.ticker.shared.remove(fadeIn)
          newStage.alpha = 1
        }
      }
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

      this.toBardArrow = util.createAnimation(PIXI.loader.resources['arrow'], 1 / 8)
      this.toBardArrow.x = 300
      this.toBardArrow.y = 95
      this.toBardArrow.interactive = true
      this.toBardArrow.buttonMode = true
      this.toBardArrow.on('pointerdown', () => {
        this.transitionTo(this.stages.bard)
      })
      this.addChild(this.toBardArrow)

      this.music = PIXI.loader.resources['music-head-screen'].sound
      this.music.loop = true
      this.music.volume = 0.2
      this.atmo = PIXI.loader.resources['atmo-head-screen'].sound
      this.atmo.loop = true
      this.atmo.volume = 0.2

      this.head = new Character({
        idle: util.createAnimation([PIXI.loader.resources['hellmouth-talk-cycle'][0]], 1 / 32),
        speaking: util.createAnimation(PIXI.loader.resources['hellmouth-talk-cycle'], 1 / 4)
      }, 135, 40)

      this.addChild(this.head)
    }

    transitionTo(newStage) {
      this.music.stop()
      this.atmo.stop()
      super.transitionTo(newStage)
    }

    beforeShow(previousStage) {
      this.head.show()
      this.player.sizeMultiplier = 2
      this.player.x = 290
      this.player.y = 120
      this.music.play()
      this.atmo.play()
    }

    scene1() {
      const sounds = util.range(1, 39).map(i => {
        const res = PIXI.loader.resources[`hellmouth-${util.intToString(i, 3)}`]
        return res.sound
      })

      this.toBardArrow.visible = false
      this.head.clickable = true
      this.head.state = 'idle'

      this.head.once('pointerdown', () => {
        this.head.clickable = false
        this.head.state = 'speaking'
        let done = false
        util.playRandomSound(sounds, () => !done)
        this.head.say('Um Gottes Willen...', 4, () => {
          this.head.say('Es toben ganz schön viele\ndieser Dämonen herum!!', 8, () => {
            this.head.say('Wenn du irgendwelche Fragen hast,\nkannst du dich jederzeit an mich wenden!', 8, () => {
              this.head.say('Du schaffst das, Antonius!', 4, () => {
                this.head.say('Wenn nicht du, wer dann?', 4, () => {
                  this.head.say('Nun geh und leg los...', 6, () => {
                    done = true
                    this.head.state = 'idle'
                    this.toBardArrow.visible = true
                  }, 64)
                }, 64)
              }, 64)
            }, 64)
          }, 64)
        }, 64)
      })
    }

    scene2() {
      const self = this
      const sounds = util.range(1, 39).map(i => {
        const res = PIXI.loader.resources[`hellmouth-${util.intToString(i, 3)}`]
        return res.sound
      })

      this.toBardArrow.visible = true
      this.head.clickable = true
      this.head.state = 'idle'

      function helpText() {
        self.toBardArrow.visible = false
        self.head.clickable = false
        self.head.state = 'speaking'
        let done = false
        util.playRandomSound(sounds, () => !done)
        self.head.say('Im Moment kannst du dem Minnesänger\nleider noch nicht helfen.', 8, () => {
          self.head.say('Im weiteren Spielverlauf findest du bestimmt\ngenau den richtigen Gegenstand für diese Situation.', 15, () => {
            self.head.say('Komme später noch einmal zurück.', 4, () => {
              // self.head.say('Moment Mal, hier riecht es doch nach Fisch, oder?', 6, () => {
                // self.head.say('Ein Hinweis?', 3, () => {
                  done = true
                  self.head.state = 'idle'
                  self.head.clickable = true
                  self.toBardArrow.visible = true
                  self.head.once('pointerdown', helpText)
                // }, 64)
              // }, 64)
            }, 64)
          }, 64)
        }, 64)
      }
      this.head.once('pointerdown', helpText)
    }
  }

  class BardStage extends Stage {
    constructor(player) {
      super('background-bard', player)

      this.music = PIXI.loader.resources['music-bard-screen'].sound
      this.music.loop = true
      this.music.volume = 0.2
      this.atmo = PIXI.loader.resources['atmo-bard-screen'].sound
      this.atmo.loop = true
      this.atmo.volume = 0.2

      this.playMusic = false

      this.toHeadArrow = util.createAnimation(PIXI.loader.resources['arrow'], 1 / 8)
      this.toHeadArrow.x = 26
      this.toHeadArrow.y = 95
      this.toHeadArrow.scale = new PIXI.Point(-1, 1)
      this.toHeadArrow.interactive = true
      this.toHeadArrow.buttonMode = true
      this.toHeadArrow.on('pointerdown', () => {
        this.transitionTo(this.stages.head)
        this.stages.head.scene2()
      })
      this.addChild(this.toHeadArrow)

      const gooseSounds = util.range(1, 15).map(i => {
        const res = PIXI.loader.resources[`gans-${util.intToString(i, 3)}`]
        return res.sound
      })

      this.goose = new Character({
        idle: util.createAnimation([PIXI.loader.resources['goose-talk-cycle'][0]], 1 / 8),
        speaking: util.createAnimation(PIXI.loader.resources['goose-talk-cycle'], 1 / 8)
      }, 145, 10, {
        speaking: function() {
          this.activeAnimation = this.animations.speaking
          util.playRandomSound(gooseSounds, () => this.state == 'speaking')
        }
      })
      this.goose.clickable = true
      this.goose.animations.speaking.loop = true
      this.goose.state = 'idle'

      this.bardHead = new Character({
        idle: util.createAnimation([PIXI.loader.resources['bard-talk-cycle'][0]], 1 / 8),
        talking: util.createAnimation(PIXI.loader.resources['bard-talk-cycle'], 1 / 8),
        walk: util.createAnimation([PIXI.loader.resources['bard-talk-cycle'][0]], 1 / 8)
      }, 145, 10)

      this.bardBody = new Character({
        idle: util.createAnimation([PIXI.loader.resources['bard-play-cycle'][0]], 1 / 8),
        singing: util.createAnimation(PIXI.loader.resources['bard-play-cycle'], 1 / 8),
        walk: util.createAnimation(PIXI.loader.resources['bard-walk-cycle'], 1 / 8)
      }, 145, 10)

      const catSounds = util.range(1, 4).map(i => {
        const res = PIXI.loader.resources[`cat-${util.intToString(i, 3)}`]
        return res.sound
      })

      this.cat = new Character({
        idle: util.createAnimation(PIXI.loader.resources['cat-idle-cycle'], 1 / 16),
        walk: util.createAnimation(PIXI.loader.resources['cat-walk-cycle'], 1 / 16),
        speaking: util.createAnimation(PIXI.loader.resources['cat-idle-cycle'], 1 / 8)
      }, 145, 10, {
        speaking: function() {
          this.activeAnimation = this.animations.speaking
          util.playRandomSound(catSounds, () => this.state == 'speaking')
        }
      })

      const bardSamples = [
        util.range(1, 7).map(i => PIXI.loader.resources[`bard-do-${util.intToString(i, 3)}`].sound),
        util.range(1, 7).map(i => PIXI.loader.resources[`bard-re-${util.intToString(i, 3)}`].sound),
        util.range(1, 7).map(i => PIXI.loader.resources[`bard-mi-${util.intToString(i, 3)}`].sound),
        util.range(1, 7).map(i => PIXI.loader.resources[`bard-fa-${util.intToString(i, 3)}`].sound),
        util.range(1, 6).map(i => PIXI.loader.resources[`bard-so-${util.intToString(i, 3)}`].sound),
        util.range(1, 6).map(i => PIXI.loader.resources[`bard-la-${util.intToString(i, 3)}`].sound),
        util.range(1, 7).map(i => PIXI.loader.resources[`bard-ti-${util.intToString(i, 3)}`].sound)
      ]
      function bardTalk(sampleCount, done) {
        let count = 0
        function playNext() {
          if (count >= sampleCount) return done && done()
          const samples = bardSamples[count++ % bardSamples.length]
          const random = Math.floor(Math.random() * samples.length)
          const sound = samples[random]
          sound.play(playNext)
        }
        playNext()
      }

      this.toHeadArrow.visible = false
      this.goose.once('pointerdown', () => {
        this.goose.clickable = false
        this.bardHead.state = 'talking'
        this.bardBody.state = 'singing'
        PIXI.loader.resources['bard-song'].sound.play(() => {
          this.bardHead.state = 'idle'
          this.bardBody.state = 'idle'
          this.goose.state = 'speaking'
          this.goose.say('Ach du meine Güte. Wie theatralisch!', 3, () => {
            this.goose.state = 'idle'
            this.player.state = 'walking'
            this.player.moveTo(250, 100, 40, () => {
              this.player.state = 'talking'
              this.player.talk('ssssssllsll')
              this.player.say('Ihr da, auf dem fantastischen Reitwesen!', 8, () => {
                this.player.talk('sslsssllslssllsll')
                this.player.say('Dieses Lied klingt so unendlich einsam,\nwarum seid Ihr so traurig?', 12, () => {
                  this.player.state = 'idle'
                  this.bardHead.state = 'talking'
                  bardTalk(12)
                  this.bardHead.say('Hört mir denn keiner zu?\nIch vermisse meine Freundin,\ndie Reitgans, sehr!', 8, () => {
                    this.bardHead.state = 'idle'
                    this.goose.state = 'speaking'
                    this.goose.say('So weit sind wir ja nicht voneinander entfernt…', 4, () => {
                      this.goose.state = 'idle'
                      this.player.state = 'talking'
                      this.player.talk('sslsssllslssll')
                      this.player.say('Stimmt, soweit seid ihr doch\nnicht voneinander entfernt.', 10, () => {
                        this.player.talk('ssssss')
                        this.player.say('Dreh dich doch mal um. ', 3, () => {
                          this.player.state = 'idle'
                          this.bardHead.state = 'talking'
                          bardTalk(8)
                          this.bardHead.say('Das geht nicht. Da ist etwas hinter mir!', 6, () => {
                            this.bardHead.state = 'idle'
                            this.player.state = 'talking'
                            this.player.talk('sssslsssls')
                            this.player.say('Ich sehe das Problem.\nVielleicht kann ich helfen.', 8, () => {
                              this.player.state = 'idle'
                              this.cat.clickable = true
                              this.toHeadArrow.visible = true
                              this.playMusic = true
                              this.music.play()
                              this.cat.once('pointerdown', () => {
                                this.cat.clickable = false
                                this.player.state = 'talking'
                                this.player.talk('sssllss')
                                this.player.say('Husch, Husch Katze.\nLass die beiden in Ruhe!', 6, () => {
                                  this.player.state = 'idle'
                                  this.cat.state = 'speaking'
                                  this.cat.say('[genervtes Miauen]', 4, () => {
                                    this.cat.state = 'idle'
                                    this.player.state = 'talking'
                                    this.player.talk('slssssls')
                                    this.player.say('Das wird wohl schwieriger als gedacht…', 6, () => {
                                      this.player.state = 'idle'
                                    })
                                  }, 0, -30)
                                })
                              })
                            })
                          }, -20, -27)
                        })
                      })
                    }, 50, -45)
                  }, -20, -27)
                })
              })
              // this.player.talk('sssllssslss', () => {
              //   this.player.state = 'idle'
              //   this.bardHead.state = 'talking'
              //   bardTalk(14, () => {
              //     this.player.state = 'talking'
              //     this.bardHead.state = 'idle'
              //     this.player.talk('slsssl', () => {
              //       this.player.state = 'walking'
              //       this.player.moveTo(340, 120, 30, () => {
              //         this.player.moveTo(240, 125, 20, () => {
              //           this.player.moveTo(340, 115, 20, () => {
              //             this.player.moveTo(250, 120, 20, () => {
              //               this.player.state = 'idle'
              //             })
              //           })
              //         })
              //       })
              //     })
              //   })
              // })
            })
          }, 50, -45)
        })
      })


      this.addChild(this.goose)
      this.addChild(this.bardBody)
      this.addChild(this.bardHead)
      this.addChild(this.cat)
    }

    transitionTo(newStage) {
      this.music.stop()
      this.atmo.stop()
      super.transitionTo(newStage)
    }

    beforeShow(previousStage) {
      this.goose.sizeMultiplier = 3
      this.bardBody.sizeMultiplier = 3
      this.bardHead.sizeMultiplier = 3
      this.cat.sizeMultiplier = 3
      this.goose.show()
      this.bardBody.show()
      this.bardHead.show()
      this.cat.show()
      this.player.x = 340
      this.player.y = 120
      this.player.sizeMultiplier = 3
      this.atmo.play()
      if (this.playMusic) {
        this.music.play()
      }
    }
  }

  return { Stage, HeadStage, BardStage }
})
