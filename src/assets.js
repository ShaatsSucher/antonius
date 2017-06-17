'use strict'

define(() => {
  return { load: (loadingDone) => {
    // const { loader } = PIXI

    PIXI.loader.add([
      { name: 'placeholder-1', url: 'img/placeholder-1.png' },
      { name: 'placeholder-2', url: 'img/placeholder-2.png' },
      { name: 'placeholder-3', url: 'img/placeholder-3.png' },
      { name: 'placeholder-4', url: 'img/placeholder-4.png' },
      { name: 'walk-cycle-sprites', url: 'img/antonius-walkcycle.png'},
      { name: 'gans-001', url: 'aud/Gans-001.wav' },
      { name: 'gans-002', url: 'aud/Gans-002.wav' },
      { name: 'gans-003', url: 'aud/Gans-003.wav' },
      { name: 'gans-004', url: 'aud/Gans-004.wav' },
      { name: 'gans-005', url: 'aud/Gans-005.wav' }
    ])
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
