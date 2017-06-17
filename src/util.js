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

define({
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
  }
})
