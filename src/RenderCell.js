const Vec2 = require('vec2')
const { createCanvas } = require('./util')
const assign = require('object-assign')

module.exports = RenderCell

// A single render cache cell. This draws lines to canvas elements
// and keeps them cached. It does *not* keep track of which lines
// are in the locations of this grid cell, but instead receives
// a list of lines to draw every time it's rendered.
function RenderCell(x, y, opts = {}) {
  if (!(this instanceof RenderCell)) return new RenderCell(x, y, opts)

  this.x = x
  this.y = y
  this.width = opts.width != null ? opts.width
             : opts.size  != null ? opts.size
             : 100
  this.height = opts.height != null ? opts.height
              : opts.size   != null ? opts.size
              : 100

  // Caching canvas
  this._canvas = null
  // Array of arrays of lines that have been drawn on the
  // cache canvas. This is used to allow multiple layers of
  // grid cells to draw to the same render cache.
  this._drawn = []
}

assign(RenderCell.prototype, {

  // Clears the cache.
  clear() {
    this._canvas = null
    // Reset knowledge of which line arrays we've drawn
    this._drawn = []
  },

  // Check if a list of lines has already been drawn to the current
  // cache canvas element.
  _hasDrawn(lines) { return this._drawn.indexOf(lines) !== -1 },

  // Draw lines to this cell's cache canvas. Returns the canvas
  // element.
  draw(lines, cam) {
    if (this._canvas && this._hasDrawn(lines)) return this._canvas

    const canvas = this._canvas ||
                   createCanvas(Vec2(this.width, this.height).multiply(cam.zoom))
    const ctx = canvas.getContext('2d')
    this._draw(lines, ctx,
               // camera
               { x: this.x + this.width / 2
               , y: this.y + this.height / 2
               , zoom: cam.zoom },
               // viewport
               Vec2(this.width, this.height).multiply(cam.zoom))

    this._drawn.push(lines)
    this._canvas = canvas
    return canvas
  },

  _draw(lines, ctx, cam, viewport) {
    const center = viewport.divide(2, true)

    lines.forEach(line => {
      ctx.beginPath()
      ctx.strokeStyle = line.color
      ctx.lineWidth = line.width * cam.zoom
      ctx.moveTo((line.start.x - cam.x) * cam.zoom + center.x,
                 (line.start.y - cam.y) * cam.zoom + center.y)
      ctx.lineTo((line.end.x - cam.x) * cam.zoom + center.x,
                 (line.end.y - cam.y) * cam.zoom + center.y)
      ctx.stroke()
    })
  }

})
