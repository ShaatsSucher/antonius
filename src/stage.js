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

      // const nextStage = new PIXI.Sprite(PIXI.loader.resources['placeholder-1'].texture)
      // nextStage.scale = new PIXI.Point(.25, .25)
      // nextStage.interactive = true
      // nextStage.buttonMode = true
      // nextStage.on('pointerdown', () => {
      //   this.transitionTo(this.stages.bard)
      // })
      // this.addChild(nextStage)

      this.head = new Character({
        idle: util.createAnimation([PIXI.loader.resources['hellmouth-talk-cycle'][0]], 1 / 32),
        speaking: util.createAnimation(PIXI.loader.resources['hellmouth-talk-cycle'], 1 / 4)
      }, 135, 40)

      // this.head.clickable = true
      // this.head.on('pointerdown', () => {
      //   this.head.state = this.head.state == 'idle' ? 'speaking' : 'idle'
      // })

      this.addChild(this.head)
    }

    beforeShow(previousStage) {
      this.head.show()
      this.player.sizeMultiplier = 2
      this.player.x = 290
      this.player.y = 120
    }

    scene1() {
      const sounds = util.range(1, 39).map(i => {
        const res = PIXI.loader.resources[`hellmouth-${util.intToString(i, 3)}`]
        return res.sound
      })

      // this.head.state = 'speaking'
      // let done = false
      // util.playRandomSound(sounds, () => !done)
      // this.head.say('Um Gottes Willen...', 4 * 60, () => {
      //   this.head.say('Es toben ganz schön viele\ndieser Dämonen herum!!', 8 * 60, () => {
      //     this.head.say('Wenn du irgendwelche Fragen hast,\nkannst du dich jederzeit an mich wenden!', 8 * 60, () => {
      //       this.head.say('Du schaffst das, Antonius!', 4 * 60, () => {
      //         this.head.say('Wenn nicht du, wer dann?', 4 * 60, () => {
      //           this.head.say('Nun geh und leg los...', 6 * 60, () => {
      //             done = true
      //             this.transitionTo(this.stages.bard)
      //           })
      //         })
      //       })
      //     })
      //   })
      // })
      this.transitionTo(this.stages.bard)
    }
  }

  class BardStage extends Stage {
    constructor(player) {
      super('background-bard', player)

      // const nextStage = new PIXI.Sprite(PIXI.loader.resources['placeholder-1'].texture)
      // nextStage.scale = new PIXI.Point(.25, .25)
      // nextStage.interactive = true
      // nextStage.buttonMode = true
      // nextStage.on('pointerdown', () => {
      //   this.transitionTo(this.stages.head)
      // })
      // this.addChild(nextStage)

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
      // this.goose.on('pointerdown', () => {
      //   this.player.state = 'walking'
      //   this.player.moveTo(200, 110, 40, () => { this.player.state = 'idle'; this.goose.state = 'speaking' })
      // })
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

      // this.cat = new Character({
      //   idle: util.createAnimation([PIXI.loader.resources['cat-idle-cycle']], 1 / 8)
      // }, 145, 10)
      // this.cat.state = 'idle'

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

      this.goose.once('pointerdown', () => {
        // this.goose.clickable = false
        // this.bardHead.state = 'talking'
        // this.bardBody.state = 'singing'
        // PIXI.loader.resources['bard-song'].sound.play(() => {
        //   this.bardHead.state = 'idle'
        //   this.bardBody.state = 'idle'
        //   this.goose.state = 'speaking'
        //   this.goose.say('Ach du meine Güte. Wie theatralisch!', 3 * 60, () => {
        //     this.goose.state = 'idle'
        //     this.player.state = 'walking'
        //     this.player.moveTo(250, 100, 40, () => {
        //       this.player.state = 'talking'
        //       this.player.talk('ssssssllsll')
        //       this.player.say('Ihr da, auf dem fantastischen Reitwesen!', 8 * 60, () => {
        //         this.player.talk('sslsssllslssllsll')
        //         this.player.say('Dieses Lied klingt so unendlich einsam,\nwarum seid Ihr so traurig?', 12 * 60, () => {
        //           this.player.state = 'idle'
        //           this.bardHead.state = 'talking'
        //           bardTalk(12)
        //           this.bardHead.say('Hört mir denn keiner zu?\nIch vermisse meine Freundin, die Reitgans, sehr!', 8 * 60, () => {
        //             this.bardHead.state = 'idle'
        //             this.goose.state = 'speaking'
        //             this.goose.say('Soweit sind wir ja nicht voneinander entfernt…', 4 * 60, () => {
                      // this.goose.state = 'idle'
                      // this.player.state = 'talking'
                      // this.player.talk('sslsssllslssll')
                      // this.player.say('Stimmt, soweit seid ihr doch\nnicht voneinander entfernt.', 10 * 60, () => {
                      //   this.player.talk('ssssss')
                      //   this.player.say('Dreh dich doch mal um. ', 3 * 60, () => {
                      //     this.player.state = 'idle'
                      //     this.bardHead.state = 'talking'
                      //     bardTalk(8)
                      //     this.bardHead.say('Das geht nicht. Da ist etwas hinter mir!', 6 * 60, () => {
                      //       this.bardHead.state = 'idle'
                      //       this.player.state = 'talking'
                      //       this.player.talk('sssslsssls')
                      //       this.player.say('Ich sehe das Problem.\nVielleicht kann ich helfen.', 8 * 60, () => {
                              this.player.talk('sssllss')
                              this.player.say('Husch, Husch Katze. Lass die beiden in Ruhe!', 6 * 60, () => {
                                this.player.state = 'idle'
                                this.cat.state = 'speaking'
                                this.cat.say('[genervtes Miauen]', 4 * 60, () => {
                                  this.cat.state = 'idle'
                                  this.player.state = 'talking'
                                  this.player.talk('slssssls')
                                  this.player.say('Das wird wohl schwieriger als gedacht…', 6 * 60, () => {
                                    this.player.state = 'idle'
                            //     })
                            //   })
                            // })
              //             })
              //           })
              //         })
              //       })
              //     })
              //   })
              // })
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
          })

        })
      })


      this.addChild(this.goose)
      this.addChild(this.bardBody)
      this.addChild(this.bardHead)
      this.addChild(this.cat)
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
    }
  }

  return { Stage, HeadStage, BardStage }
})
