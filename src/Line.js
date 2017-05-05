const inherits = require('inherits')
const Segment2 = require('segment2')

module.exports = Line

// Represents a line segment in the grid.
function Line(start, end, opts = {}) {
  if (!(this instanceof Line)) return new Line(start, end, opts)

  Segment2.call(this, start, end)

  this.color = opts.color || 'black'
  this.width = opts.width != null ? opts.width : 1
}

inherits(Line, Segment2)

