
// Represents a line segment in the grid.
export default function Line(x0, y0, x1, y1, opts = {}) {
  if (!(this instanceof Line)) return new Line(x0, y0, x1, y1, opts)

  this.x0 = x0
  this.y0 = y0
  this.x1 = x1
  this.y1 = y1

  this.color = opts.color || 'black'
  this.width = opts.width != null ? opts.width : 1
}
