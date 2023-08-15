import React, { useCallback, useState } from "react"
import { range, scaleLinear } from "./helper"

/**
 * Simple SVG Line component
 * @param {{fromx, fromy, tox, toy}} props 
 * @returns 
 */
const Line = (props) => {
    const { fromx, fromy, tox, toy } = props
    return <path d={`M ${fromx} ${fromy} L ${tox} ${toy}`} {...props}></path>
}

const Fretboard = ({width, frets=12, strings=6}) => {
    // padding on left and right side: 10%
    const paddingSide = 0.1 * width
    // x scaler
    const scx = scaleLinear([paddingSide, width-paddingSide], [0,frets])
    // y scaler
    const scy = scaleLinear([10, 200], [0, strings])

    return (
        <>
            { /* Horizontal Lines */ }
            { range(0, strings).map(i => (
                <Line key={i} fromx={scx(0)} fromy={scy(i)} tox={scx(frets-1)} toy={scy(i)} stroke="#aaa" strokeWidth="1.5"/>
            ))}
            { /* Vertical Lines */}
            { range(0, frets).map(i => (
                <Line key={i} fromx={scx(i)} fromy={scy(0)} tox={scx(i)} toy={scy(strings-1)} stroke="#aaa" strokeWidth="1.5" />
            ))}
            { /* Fretboard navigation dots */}
            { [3, 5, 7, 9].map(i => (
                <circle key={i} cx={scx(i-0.5)} cy={scy(strings/2-0.5)} r="8" fill="#444"></circle>
            ))}
        </>
    )
}

export { Fretboard }