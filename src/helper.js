
/**
 * Linear Scale function similar to D3.js
 * @param {Array<Number>} domain output range (2-dimensional array)
 * @param {Array<Number>} range input range (2-dimensional array)
 * @returns {(value: Number) => Number}
 * @example
 * ```javascript
 * scaler = scaleLinear([100, 200], [0, 1])
 * scaler(0) == 100
 * scaler(0.5) == 150
 * scaler(1) == 200
 * ```
 */
const scaleLinear = (domain, range) => (val) => {
  const scaled = (val - range[0]) / (range[1] - range[0]) // value between 0 and 1
  return scaled * (domain[1] - domain[0]) + domain[0]  // scale into domain
}

/**
 * Converts degrees to radians
 * @param {Number} deg degrees [0 - 360]
 * @returns {Number} radians [0 - 6.283]
 * @example
 * ```javascript
 * deg2rad(0) == 0
 * deg2rad(180) == 3.1415
 * deg2rad(360) == 6.283
 * ```
 */
const deg2rad = deg => (2 * Math.PI / 360) * deg

/**
 * Calculates the point on a circle, given radius and angle
 * @param {Number} radius 
 * @param {Number} angle in degrees
 * @param {Array<Number>} offset array with two elements for offset
 * @returns {Array<Number>} x and y coordinate of point
 */
const pointOnCircle = (radius, angle, offset = undefined) => {
  let [x, y] = [radius * Math.cos(deg2rad(angle)), radius * Math.sin(deg2rad(angle))]
  if (offset !== undefined) {
    const [offsetX, offsetY] = offset
    x += offsetX, y += offsetY
  }
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100]  // round to two decimal places
}

/**
 * Range function, returns array of values from `min` to `max`. Why don't you have something like this, JS?
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Array<Number>}
 */
const range = (min, max, stepsize = 1) => {
  let items = []
  for (let i = min; i < max; i += stepsize) {
    items.push(i)
  }
  return items
}

export { scaleLinear, pointOnCircle, range }