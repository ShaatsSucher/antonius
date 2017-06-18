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
      { name: 'goose-walk-cycle-sprites', url: 'img/goose-walkcycle.png'},
      { name: 'bard-walk-cycle-sprites', url: 'img/bard-walkcycle.png'},
      { name: 'bard-talk-cycle-sprites', url: 'img/bard-talkcycle.png'},
      { name: 'bard-play-cycle-sprites', url: 'img/bard-playcycle.png'},
      { name: 'cat-idle-cycle-sprites', url: 'img/cat-idlecycle.png'},
      { name: 'cat-walk-cycle-sprites', url: 'img/cat-walkcycle.png'},
      { name: 'background-head', url: 'img/background-head.png' },
      { name: 'background-bard', url: 'img/background-bard.png' },
      { name: 'arrow-sprites', url: 'img/arrow-sprites.png' },
      { name: 'fish', url: 'img/fish.png' },
      { name: 'bard-song', url: 'aud/bard/Song.ogg' },
      { name: 'music-head-screen', url: 'aud/music/music head screen.ogg' },
      { name: 'music-bard-screen', url: 'aud/music/music bard screen.ogg' },
      { name: 'atmo-head-screen', url: 'aud/soundscapes/Atmo Screen 1.ogg' },
      { name: 'atmo-bard-screen', url: 'aud/soundscapes/Atmo Screen 2.ogg' }
    ]

    util.range(1, 4).forEach(i => loadStuff.push({ name: `cat-${util.intToString(i, 3)}`, url: `aud/cat/cat denial-${util.intToString(i, 3)}.wav`}))
    util.range(1, 15).forEach(i => loadStuff.push({ name: `gans-${util.intToString(i, 3)}`, url: `aud/Gans-${util.intToString(i, 3)}.wav`}))
    util.range(1, 39).forEach(i => loadStuff.push({ name: `hellmouth-${util.intToString(i, 3)}`, url: `aud/craesbeeck/hellmouth-${util.intToString(i, 2)}.wav`}))
    util.range(1, 101).forEach(i => loadStuff.push({ name: `antonius-short-${util.intToString(i, 3)}`, url: `aud/antonius/kurz/Antonius kurz-${util.intToString(i, 3)}.wav`}))
    util.range(1, 31).forEach(i => loadStuff.push({ name: `antonius-long-${util.intToString(i, 3)}`, url: `aud/antonius/lang/Antonius lang-${util.intToString(i, 3)}.wav`}))
    util.range(1, 7).forEach(i => loadStuff.push({ name: `bard-do-${util.intToString(i, 3)}`, url: `aud/bard/Do/Do-${util.intToString(i, 3)}.wav`}))
    util.range(1, 7).forEach(i => loadStuff.push({ name: `bard-re-${util.intToString(i, 3)}`, url: `aud/bard/Re/Re-${util.intToString(i, 3)}.wav`}))
    util.range(1, 7).forEach(i => loadStuff.push({ name: `bard-mi-${util.intToString(i, 3)}`, url: `aud/bard/Mi/Mi-${util.intToString(i, 3)}.wav`}))
    util.range(1, 7).forEach(i => loadStuff.push({ name: `bard-fa-${util.intToString(i, 3)}`, url: `aud/bard/Fa/Fa-${util.intToString(i, 3)}.wav`}))
    util.range(1, 6).forEach(i => loadStuff.push({ name: `bard-so-${util.intToString(i, 3)}`, url: `aud/bard/So/So-${util.intToString(i, 3)}.wav`}))
    util.range(1, 6).forEach(i => loadStuff.push({ name: `bard-la-${util.intToString(i, 3)}`, url: `aud/bard/La/La-${util.intToString(i, 3)}.wav`}))
    util.range(1, 7).forEach(i => loadStuff.push({ name: `bard-ti-${util.intToString(i, 3)}`, url: `aud/bard/Ti/Ti-${util.intToString(i, 3)}.wav`}))

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
      PIXI.loader.resources['goose-walk-cycle'] = loadAnimation('goose-walk-cycle-sprites', 64, 64)
      PIXI.loader.resources['bard-talk-cycle'] = loadAnimation('bard-talk-cycle-sprites', 64, 64)
      PIXI.loader.resources['bard-walk-cycle'] = loadAnimation('bard-walk-cycle-sprites', 64, 64)
      PIXI.loader.resources['bard-play-cycle'] = loadAnimation('bard-play-cycle-sprites', 64, 64)
      PIXI.loader.resources['cat-idle-cycle'] = loadAnimation('cat-idle-cycle-sprites', 64, 64)
      PIXI.loader.resources['cat-walk-cycle'] = loadAnimation('cat-walk-cycle-sprites', 16, 16)
      PIXI.loader.resources['arrow'] = loadAnimation('arrow-sprites', 16, 16)

      console.log('loading done')
      loadingDone()
    }
  }}
})
