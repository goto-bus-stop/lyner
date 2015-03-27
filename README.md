lyner
=====

Somewhat speedy `<canvas>` renderer for drawing lots of mostly-unchanging lines.

## Usage

```javascript
const renderer = lyner({
  camera: { x: 0, y: 0, zoom: 1 }
})

renderer.line(20, 20, 50, 50, { color: '#f00' })

$('div#wrapper').append(renderer.canvas)

requestAnimationFrame(renderer.draw)
```