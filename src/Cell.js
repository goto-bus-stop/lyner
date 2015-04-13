import { createCanvas } from './util'
import assign from 'object-assign'

// Keeps track of lines in a grid cell.
// `x` is the x coordinate of this cell, usually a multiple of
// the cell width.
// `y` is the y coordinate.
// `opts` can take options:
//  * width: Coordinate width of this cell. Defaults to `opts.size` or 100.
//  * height: Height of this cell. Defaults to `opts.size` or 100.
//  * size: Size of this cell, for both width and height. Overridden by
//    `opts.width` and `opts.height` if those are given. Defaults to 100.
export default function Cell(x, y, opts = {}) {
  if (!(this instanceof Cell)) return new Cell(x, y, opts)

  this.x = x
  this.y = y
  this.width = opts.width != null ? opts.width
             : opts.size  != null ? opts.size
             : 100
  this.height = opts.height != null ? opts.height
              : opts.size   != null ? opts.size
              : 100
  this.lines = []
}

assign(Cell.prototype, {

  // Nothing much yet

})
