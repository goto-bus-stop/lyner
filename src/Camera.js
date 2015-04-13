import assign from 'object-assign'

// Stores position and zoom level of the camera.
export default function Camera(opts = {}) {
  if (!(this instanceof Camera)) return new Camera(opts)

  this.x = opts.x
  this.y = opts.y
  this.zoom = opts.zoom
}

assign(Camera.prototype, {

  // Nothing much yet

})
