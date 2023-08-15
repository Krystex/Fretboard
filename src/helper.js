
/**
 * Linear Scale function similar to D3.js
 *  */
const scaleLinear = (domain, range) => (val) => {
    const scaled = (val - range[0]) / (range[1] - range[0]) // value between 0 and 1
    return scaled * (domain[1] - domain[0]) + domain[0]  // scale into domain
}

/**
 * Range function, returns array of values from `min` to `max`. Why don't you have something like this, JS?
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Array<Number>}
 */
const range = (min, max) => {
    let items = []
    for (let i=min; i<max; i++) {
        items.push(i)
    }
    return items
}

export { scaleLinear, range }