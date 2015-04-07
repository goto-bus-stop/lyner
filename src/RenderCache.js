import assign from 'object-assign'
import RenderCell from './RenderCell'

export default function RenderCache(opts = {}) {
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
