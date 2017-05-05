const assign = require('object-assign')
const RenderCell = require('./RenderCell')

module.exports = RenderCache

// The RenderCache is a kind of separate grid from the data grid,
// that only handles drawing. It keeps track of caching canvases
// for every grid cell, so Lyner can just copy those canvases to
// the output canvas instead of redrawing millions of lines all
// the time.
// This is separated from the data grid because you might want to
// layer multiple instances of Lyner, while not vastly increasing
// the amount of work that's done on every render.
function RenderCache(opts = {}) {
  if (!(this instanceof RenderCache)) return new RenderCache(opts)

  this.cellSize = opts.cellSize || 100
  this._grid = {}
}

assign(RenderCache.prototype, {

  _key(x, y) { return `${x},${y}` },

  cell(x, y) {
    const key = this._key(x, y)
    return this._grid[key] ||
      (this._grid[key] = RenderCell(x * this.cellSize, y * this.cellSize, { size: this.cellSize }))
  },

  clear() {
    Object.keys(this._grid).forEach(key => this._grid[key].clear())
  }

})
