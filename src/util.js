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
    if (count == 0) return playbackDone()
    let nextSound = lastSound
    do {
      const random = Math.floor(Math.random() * sounds.length)
      nextSound = sounds[random]
    } while (nextSound == lastSound)

    nextSound.play(() => {
      soundPlayed && soundPlayed()
      utils.playRandomSound(sounds, count - 1, soundPlayed, playbackDone, nextSound)
    })
  }
}

define(utils)
