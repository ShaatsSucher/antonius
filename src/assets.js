'use strict'

define(['lib/pixi.min'],
       ( PIXI         ) => {
  return { load: (loadingDone) => {
    const { loader } = PIXI

    loader.add([
      { name: 'placeholder-1', url: 'img/placeholder-1.png' },
      { name: 'placeholder-2', url: 'img/placeholder-2.png' },
      { name: 'placeholder-3', url: 'img/placeholder-3.png' },
      { name: 'placeholder-4', url: 'img/placeholder-4.png' }
    ])
    .on('progress', onProgress)
    .load(() => { console.log('loading done'); loadingDone() })

    function onProgress(loader, resource) {
      console.log(`loading ${resource.url}`)
      console.log(`progress: ${loader.progress}%`)
    }
  }}
})
