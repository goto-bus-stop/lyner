const assign = require('object-assign')
const Cell = require('./Cell')
const RenderCache = require('./RenderCache')
const { getCells } = require('./util')

module.exports = Grid

// Manages line data across grid cells, and manages the render cache.
// `opts` can take options:
//  * cellSize: Size of cells in the grid. Defaults to 100.
//  * renderCache: A RenderCache instance to use. Used for sharing cache
//    instances. Defaults to a new render cache with the same cell size as
//    this grid instance.
//    Note that the render cache cell size and the grid cell size **must**
//    always be the same to get decent results.
function Grid(opts = {}) {
  if (!(this instanceof Grid)) return new Grid(opts)

  this.cellSize = opts.cellSize || 100
  this.renderCache = opts.renderCache || RenderCache({ cellSize: this.cellSize })

  this._grid = {}
}

assign(Grid.prototype, {

  // Turns a cell index pair into a string key for the grid object.
  // TODO find some non-hacky data structure for this?
  _key(x, y) { return `${x},${y}` },

  // Returns the cell at the given index. The x and y parameters here are
  // in "N cell widths", rather than the top left coordinates of the cell.
  // Creates a new cell if one wasn't found at the given index.
  cell(x, y) {
    const key = this._key(x, y)
    return this._grid[key] ||
      (this._grid[key] = Cell(x * this.cellSize, y * this.cellSize, { size: this.cellSize }))
  },

  // Adds a line to the relevant cells in the grid,
  // and clears the relevant cache objects.
  add(line) {
    const cs = this.cellSize
    this._findCellsFor(line).forEach(cell => {
      cell.lines.push(line)
      this.renderCache.cell(cell.x / cs, cell.y / cs).clear()
    })
  },

  // Removes a line from the relevant cells in the grid,
  // and clears the relevant cache objects.
  remove(line) {
    const cs = this.cellSize
    this._findCellsFor(line).forEach(({ x, y, lines }) => {
      for (let i = 0, l = lines.length; i < l; i++) {
        if (lines[i] === line) {
          lines.splice(i, 1)
          i--
          this.renderCache.cell(x / cs, y / cs).clear()
        }
      }
    })
  },

  // Returns cell instances that are crossed by a given line.
  _findCellsFor(line) {
    const cs = this.cellSize
    return getCells(line.x0, line.y0, line.x1, line.y1, cs)
      .map(({ x, y }) => this.cell(x, y))
  }

})
