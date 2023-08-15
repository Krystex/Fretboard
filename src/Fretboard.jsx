import React, { useCallback, useState } from "react"
import { range } from "./helper"

/**
 * Linear Scale function similar to D3.js
 *  */
const scaleLinear = (domain, range) => (val) => {
    const scaled = (val - range[0]) / (range[1] - range[0]) // value between 0 and 1
    return scaled * (domain[1] - domain[0]) + domain[0]  // scale into domain
}

const Fretboard = ({width, frets=12, strings=6}) => {
    // padding on left and right side: 10%
    const paddingSide = 0.1 * width
    const scx = scaleLinear(domain=[paddingSide, width-paddingSide], [0,frets])
    const scy = scaleLinear(domain=[10, 200], [0, strings])

    return (
        <>
            { /* Vertical Lines */ }
            { range(0, strings).map(i => (
                <path key={i} d={`M${scx(0)} ${scy(i)} L ${scx(frets)} ${scy(i)}`} stroke="#aaa" strokeWidth="1.5"></path>
            ))}
        </>
    )
}

export { Fretboard }