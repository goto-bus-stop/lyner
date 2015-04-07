import assign from 'object-assign'

export default function Camera(opts = {}) {
  if (!(this instanceof Camera)) return new Camera(opts)

  this.x = opts.x
  this.y = opts.y
  this.zoom = opts.zoom
}

assign(Camera.prototype, {


})
