'use strict'

const renderer = PIXI.autoDetectRenderer(256, 256)
renderer.view.style.position = 'absolute'
renderer.view.style.display = 'block'
renderer.autoresize = true
renderer.resize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.view)

const stage = new PIXI.Container();

renderer.render(stage)
