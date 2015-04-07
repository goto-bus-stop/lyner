lyner
=====

Somewhat speedy `<canvas>` renderer for drawing lots of mostly-unchanging lines.

## Usage

### Basic

```javascript
const renderer = lyner({
  camera: { x: 0, y: 0, zoom: 1 }
})

renderer.line(20, 20, 50, 50, { color: '#f00' })

$('div#wrapper').append(renderer.canvas)

requestAnimationFrame(function frame() {
  renderer.clear()
  renderer.draw()
  requestAnimationFrame(frame)
})
```

### Layered

```javascript
const background = lyner()
const foreground = lyner({ canvas: background.canvas })

background.line(0, 0, 100, 100, { color: 'black' })
foreground.line(0, 100, 100, 0, { color: 'pink'  })

requestAnimationFrame(function frame() {
  // .clear() clears the canvas, so it clears both `background`
  // and `foreground`s artistry at once
  background.clear()
  background.draw()
  foreground.draw()
  requestAnimationFrame(frame)
})

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
   camera position. Here, `x` and `y` define which coordinates will be rendered in
   the center of the canvas. Defaults to `{ x: 0, y: 0, zoom: 1 }`.
 * cellSize: Pixel size of the caching grid cells. Larger cells means a longer
   initial drawing time, but fewer `drawImage` calls on every rerender. Cells are
   initialised when they are in view, so if you're drawing lots of lines, large cells
   might cause some panning jank. Defaults to 100 pixels.
 * renderCache: `lyner.RenderCache` instance used for rendering this `lyner`'s
   lines to. By sharing `RenderCache` instances between `lyner` instances, you can
   draw different layers of lines (in different `lyner` instances) on the same set of
   cache canvases, which can save lots of time in `drawImage` calls on every frame if
   you have many layers (say, more than two).

### let line = renderer.line(x0, y0, x1, y1, opts={})

Adds a line from `(x0, y0)` to `(x1, y1)`. Possible options are:

 * width: Width of the line. Defaults to 1, which equals 1 pixel at zoom level 1.
 * color: Rendered color of the line (its `strokeStyle`). Defaults to "black".

Returns the newly added line. A line has `x0`, `y0`, `x1`, `y1`, `width` and `color`
properties intended primarily for reading.

### renderer.remove(line)

Removes a line from the world.

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

### renderer.renderCache()

Returns the `RenderCache` instance used. You can then pass that instance to other
`lyner` instances.

### let renderCache = lyner.RenderCache(opts={})

Creates a new render cache grid. This has no public methods and should only be used
to share render caches between `lyner` instances.

`opts` are:

 * cellSize: Pixel size of individual grid cells. This *must* be equal to the size
   given in the `lyner()` constructor. Defaults to 100 pixels.

## License

MIT
