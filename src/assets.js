'use strict'

define(['util'], (util) => {
  return { load: (loadingDone) => {
    // const { loader } = PIXI

    let loadStuff = [
      { name: 'placeholder-1', url: 'img/placeholder-1.png' },
      { name: 'placeholder-2', url: 'img/placeholder-2.png' },
      { name: 'placeholder-3', url: 'img/placeholder-3.png' },
      { name: 'placeholder-4', url: 'img/placeholder-4.png' },
      { name: 'walk-cycle-sprites', url: 'img/antonius-walkcycle.png'}
    ]

    util.range(1, 15).forEach(i => loadStuff.push({ name: `gans-${util.intToString(i, 3)}`, url: `aud/Gans-${util.intToString(i, 3)}.wav`}))

    PIXI.loader.add(loadStuff)
    .on('progress', onProgress)
    .load(doneLoading)

    function onProgress(loader, resource) {
      console.log(`loading ${resource.url}`)
      console.log(`progress: ${loader.progress}%`)
    }

    function loadAnimation(textureName, width, height) {
      const spriteSheet = PIXI.loader.resources[textureName].texture.baseTexture
      let frames = []
      for (let i = 0; i < spriteSheet.width - width; i += width) {
        const frameTexture = new PIXI.Texture(spriteSheet)
        frameTexture.frame = new PIXI.Rectangle(i, 0, width, height)
        frames.push(frameTexture)
      }
      return new PIXI.extras.AnimatedSprite(frames)
    }

    function doneLoading() {
      PIXI.loader.resources['walk-cycle'] = loadAnimation('walk-cycle-sprites', 32, 32)

      console.log('loading done')
      loadingDone()
    }
  }}
})
