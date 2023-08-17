import React, { useCallback, useState } from "react"
import { range, scaleLinear } from "./helper"

/**
 * Simple SVG Line component
 * @param {{fromx: Number, fromy: Number, tox: Number, toy: Number}} props 
 * @returns 
 */
const Line = (props) => {
    const { fromx, fromy, tox, toy } = props
    return <path d={`M ${fromx} ${fromy} L ${tox} ${toy}`} {...props}></path>
}


const Arc = (props) => {
    const { x, y, innerRadius, outerRadius, startAngle, endAngle } = props
    const deg2rad = deg => (2*Math.PI/360)*deg
    const circle = (radius, angle) => [(radius * Math.cos(deg2rad(angle))).toFixed(3), (radius * Math.sin(deg2rad(angle))).toFixed(3)]
    
    const [innerStartX, innerStartY] = circle(innerRadius, startAngle)
    const [innerStopX, innerStopY] = circle(innerRadius, endAngle)
    const [outerStartX, outerStartY] = circle(outerRadius, startAngle)
    const [outerStopX, outerStopY] = circle(outerRadius, endAngle)
    
    // d3.arc().innerRadius(50).outerRadius(70).startAngle(0).endAngle(Math.PI/2)()
    // return <path d="M0,-70A70,70,0,0,1,70,0L50,0A50,50,0,0,0,0,-50Z" transform="translate(70,70)"></path>
    // arc syntax: A radius x-axis, radius y-axis, rotation x-axis, large arc flag, sweep flag, xy coords endpoint
    return <path d={`M ${-outerStopX} ${-outerStopY} A ${outerRadius} ${outerRadius} 0 0 1 ${outerStartX} ${outerStartY} L ${innerStartX} ${innerStartY} A ${innerRadius} ${innerRadius} 0 0 0 ${-innerStopX} ${-innerStopY}Z`} fill="white" transform={`translate(${x},${y})`}></path>
}

const Fretboard = ({width, board, frets=12, strings=6}) => {
    // padding on left and right side: 10%
    const paddingSide = 0.1 * width
    // x scaler
    const scx = scaleLinear([paddingSide, width-paddingSide], [0,frets])
    // y scaler
    const scy = scaleLinear([20, 200], [0, strings])

    return (
        <>
            { /* Horizontal Lines */ }
            { range(0, strings).map(i => (
                <Line key={i} fromx={scx(0)} fromy={scy(i)} tox={scx(frets-1)} toy={scy(i)} stroke="#aaa" strokeWidth="1.5"/>
            ))}
            { /* Vertical Lines */ }
            { range(0, frets).map(i => (
                <Line key={i} fromx={scx(i)} fromy={scy(0)} tox={scx(i)} toy={scy(strings-1)} stroke="#aaa" strokeWidth="1.5" />
            ))}
            { /* Fretboard navigation dots */ }
            { [3, 5, 7, 9].map(i => (
                <circle key={i} cx={scx(i-0.5)} cy={scy(strings/2-0.5)} r="8" fill="#444"></circle>
            ))}
            { /* Fretboard note circles */ }
            { board.map((x, y, note) => (
                <circle key={`${x}-${y}`} cx={scx(x-0.5)} cy={scy(y)} r="12" fill="green" stroke="#000"></circle>
            ))}
            { /* Fretboard note circles texts */ }
            { board.map((x, y, note) => (
                <text x={scx(x-0.5)} y={scy(y)} key={`${x}-${y}`} fill="#000" fontSize="14"
                    fontFamily="-apple-system, BlinkMacSystemFont, Roboto, sans-serif"
                    alignmentBaseline="central"
                    textAnchor="middle"
                    pointerEvents="none">{note}</text>
            ))}
            <Arc x={70} y={70} innerRadius={50} outerRadius={70} startAngle={0} endAngle={90} />
        </>
    )
}

export { Fretboard }