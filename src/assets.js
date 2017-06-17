'use strict'

define(['util'], (util) => {
  return { load: (loadingDone) => {
    // const { loader } = PIXI

    let loadStuff = [
      { name: 'placeholder-1', url: 'img/placeholder-1.png' },
      { name: 'placeholder-2', url: 'img/placeholder-2.png' },
      { name: 'placeholder-3', url: 'img/placeholder-3.png' },
      { name: 'placeholder-4', url: 'img/placeholder-4.png' },
      { name: 'antonius-walk-cycle-sprites', url: 'img/antonius-walkcycle.png'},
      { name: 'antonius-talk-cycle-sprites', url: 'img/antonius-talkcycle.png'},
      { name: 'hellmouth-talk-cycle-sprites', url: 'img/hellmouth-talkcycle.png'},
      { name: 'goose-talk-cycle-sprites', url: 'img/goose-talkcycle.png'},
      { name: 'background-head', url: 'img/background-head.png' },
      { name: 'background-bard', url: 'img/background-bard.png' }
    ]

    util.range(1, 15).forEach(i => loadStuff.push({ name: `gans-${util.intToString(i, 3)}`, url: `aud/Gans-${util.intToString(i, 3)}.wav`}))
    util.range(1, 39).forEach(i => loadStuff.push({ name: `hellmouth-${util.intToString(i, 3)}`, url: `aud/craesbeeck/hellmouth-${util.intToString(i, 2)}.wav`}))

    PIXI.loader
      .add(loadStuff)
      .on('progress', onProgress)
      .load(doneLoading)

    function onProgress(loader, resource) {
      console.log(`loading ${resource.url}`)
      console.log(`progress: ${loader.progress}%`)
    }

    function loadAnimation(textureName, width, height) {
      const spriteSheet = PIXI.loader.resources[textureName].texture.baseTexture
      let frames = []
      for (let i = 0; i <= spriteSheet.width - width; i += width) {
        const frameTexture = new PIXI.Texture(spriteSheet)
        frameTexture.frame = new PIXI.Rectangle(i, 0, width, height)
        frames.push(frameTexture)
      }
      return frames
    }

    function doneLoading() {
      PIXI.loader.resources['walk-cycle'] = loadAnimation('antonius-walk-cycle-sprites', 32, 32)
      PIXI.loader.resources['talk-cycle'] = loadAnimation('antonius-talk-cycle-sprites', 32, 32)
      PIXI.loader.resources['hellmouth-talk-cycle'] = loadAnimation('hellmouth-talk-cycle-sprites', 128, 128)
      PIXI.loader.resources['goose-talk-cycle'] = loadAnimation('goose-talk-cycle-sprites', 64, 64)

      console.log('loading done')
      loadingDone()
    }
  }}
})
