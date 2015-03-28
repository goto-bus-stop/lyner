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

## API

### let renderer = lyner(opts={})

Creates a new `lyner` instance.

`opts` is an object with properties:

 * width: Width of the canvas. Defaults to 640.
 * height: Height of the canvas. Defaults to 480.
 * canvas: An existing canvas element. `lyner` creates a new canvas element of the
   given dimensions if no existing canvas is passed in.
 * camera: An object with `x`, `y` and `zoom` properties specifying the initial
   camera position. Defaults to `{ x: 0, y: 0, zoom: 1 }`. Here, `x` and `y` define
   which coordinates will be rendered in the center of the canvas.

### let line = renderer.line(x0, y0, x1, y1, opts={})

Adds a line from `(x0, y0)` to `(x1, y1)`. Possible options are:

 * width: Width of the line. Defaults to 1, which equals 1 pixel at zoom level 1.
 * color: Rendered color of the line (its `strokeStyle`). Defaults to "black".

Returns the newly added line. A line has `x0`, `y0`, `x1`, `y1`, `width` and `color`
properties intended primarily for reading.

### renderer.canvas

Contains the underlying canvas DOM element in the browser, or a `canvas` instance
in Node/io.js.

### renderer.clear()

Clears the canvas.

### renderer.draw()

Draws lines to the canvas.

### renderer.camera

Contains the camera position. This object has `x`, `y` and `zoom` properties, just
like the `opts.camera` parameter in `lyner()`.

### renderer.zoom(ticks)

Adjusts the zoom level. Negative numbers zoom out, while positive numbers zoom in.

## License
MIT