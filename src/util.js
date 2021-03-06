'use strict'

function* rangeGenerator(min, max) {
  if (!max) {
    max = min
    min = 0
  }
  let value = min
  while (value < max)
    yield value++
}

const utils = {
  range(min, max) {
    return [...rangeGenerator(min, max)]
  },
  intToString(value, padding) {
    const tmp = '0'.repeat(padding) + value
    return tmp.substr(tmp.length - padding)
  },
  createAnimation(texture, speed) {
    const animation = new PIXI.extras.AnimatedSprite(texture)
    animation.animationSpeed = speed
    return animation
  },
  playRandomSound(sounds, count, soundPlayed, playbackDone, lastSound) {
    if (count == 0) return playbackDone && playbackDone()
    let nextCount
    if (!Number.isInteger(count)) {
      if (!count()) {
        return playbackDone && playbackDone()
      }
      nextCount = count
    } else {
      nextCount = count - 1
    }
    let nextSound = lastSound
    do {
      const random = Math.floor(Math.random() * sounds.length)
      nextSound = sounds[random]
    } while (nextSound == lastSound)

    nextSound.play(() => {
      soundPlayed && soundPlayed()
      utils.playRandomSound(sounds, nextCount, soundPlayed, playbackDone, nextSound)
    })
  },
  wait(seconds, done) {
    let t = 0
    let max_t = seconds * PIXI.ticker.shared.FPS
    function sleep(deltaT) {
      t += deltaT
      if (t >= max_t) {
        PIXI.ticker.shared.remove(sleep)
        return done()
      }
    }
    PIXI.ticker.shared.add(sleep)
  }
}

define(utils)
