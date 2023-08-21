import React, { useCallback, useState } from "react"
import { range, scaleLinear } from "./helper"
import { FretboardCtrl, Scale } from "./musictheory"

/**
 * Simple SVG Line component
 * @param {{fromx: Number, fromy: Number, tox: Number, toy: Number}} props 
 * @returns 
 */
const Line = (props) => {
    const { fromx, fromy, tox, toy } = props
    return <path d={`M ${fromx} ${fromy} L ${tox} ${toy}`} {...props}></path>
}

/**
 * Arc SVG component, similar to `d3.arc()`
 * @param {object} props 
 * @param {Number} props.x x position of circle
 * @param {Number} props.y y position of circle
 * @param {Number} props.innerRadius inner radius of circle
 * @param {Number} props.outerRaidus outer radius of circle
 * @param {Number} props.startAngle starting angle of arc (in degrees)
 * @param {Number} props.endAngle ending angle or arc (in degrees)
 * @returns
 * @example
 * <Arc x={70} y={70} innerRadius={50} outerRadius={70} startAngle={0} endAngle={350} fill="white" />
 */
const Arc = ({ x, y, innerRadius, outerRadius, startAngle, endAngle, padAngle=0, ...rest }) => {
    const deg2rad = deg => (2*Math.PI/360)*deg
    const rad2deg = rad => rad * 180 / Math.PI
    const circle = (radius, angle) => [(radius * Math.cos(deg2rad(angle))).toFixed(3), (radius * Math.sin(deg2rad(angle))).toFixed(3)]
    
    const anglePadding = deg2rad(padAngle) / 2  // i don't really know what i'm doing with the padding angle. its all taken from d3's arc function
    const radiusPadding = Math.sqrt(innerRadius*innerRadius + outerRadius*outerRadius) // geometric mean of inner and outer radius
    const innerPadding = Math.asin(radiusPadding / innerRadius * Math.sin(anglePadding))
    const outerPadding = Math.asin(radiusPadding / outerRadius * Math.sin(anglePadding))
    const [innerStartX, innerStartY] = circle(innerRadius, startAngle-90)
    const [innerStopX, innerStopY] = circle(innerRadius, endAngle-90-rad2deg(innerPadding))
    const [outerStartX, outerStartY] = circle(outerRadius, startAngle-90)
    const [outerStopX, outerStopY] = circle(outerRadius, endAngle-90-rad2deg(outerPadding))

    const over180degrees = (endAngle - startAngle) > 180
    const sweepflag = over180degrees ? "1" : "0"
    
    return (
        <path d={`M ${outerStartX} ${outerStartY} A ${outerRadius} ${outerRadius} 0 ${sweepflag} 1 ${outerStopX} ${outerStopY} L ${innerStopX} ${innerStopY} A ${innerRadius} ${innerRadius} 0 ${sweepflag} 0 ${innerStartX} ${innerStartY}Z`} transform={`translate(${x},${y})`} {...rest}></path>
    )
}

/**
 * Arcs arranged in a circle, similar to a pie-plot
 */
const CircleOfArcs = ({num, ...rest}) => {
    const angle = 360. / num
    return (
        <>{range(0, 360, angle).map(i => (
            <Arc key={i} {...rest} startAngle={i} endAngle={i+angle} text={i} />
        ))}</>
    )
}

/**
 * 
 * @param {object} props 
 * @param {Number} props.width width of svg context
 * @param {FretboardCtrl} props.board fretboard controller which holds note names, num of strings, num of frets
 * @param {() => (Number, Number, String)} props.onMouseEnter event handler when mouse hovers note circle
 * @param {() => (Number, Number, String)} props.onMouseOut event handler when mouse stops hovering note circle
 * @returns 
 */
const Fretboard = ({width, board, onMouseEnter=null, onMouseOut=null}) => {
    // padding on left and right side: 10%
    const paddingSide = 0.1 * width
    // x scaler
    const scx = scaleLinear([paddingSide, width-paddingSide], [0,board.numFrets])
    // y scaler
    const scy = scaleLinear([20, 200], [0, board.numStrings])

    return (
        <>
            { /* Horizontal Lines */ }
            { range(0, board.numStrings).map(i => (
                <Line key={i} fromx={scx(0)} fromy={scy(i)} tox={scx(board.numFrets-1)} toy={scy(i)} stroke="#aaa" strokeWidth="1.5"/>
            ))}
            { /* Vertical Lines */ }
            { range(0, board.numFrets).map(i => (
                <Line key={i} fromx={scx(i)} fromy={scy(0)} tox={scx(i)} toy={scy(board.numStrings-1)} stroke="#aaa" strokeWidth="1.5" />
            ))}
            { /* Fretboard navigation dots */ }
            { [3, 5, 7, 9].map(i => (
                <circle key={i} cx={scx(i-0.5)} cy={scy(board.numStrings/2-0.5)} r="8" fill="#444"></circle>
            ))}
            { /* Fretboard note circles */ }
            { board.map((x, y, note) => (
                <circle key={`${x}-${y}`} cx={scx(x-0.5)} cy={scy(y)} r="12" fill="green" stroke="#000"
                    onMouseEnter={() => onMouseEnter && onMouseEnter(x, y, note)}
                    onMouseOut={() => onMouseOut && onMouseOut(x, y, note)}></circle>
            ))}
            { /* Fretboard note circles texts */ }
            { board.map((x, y, note) => (
                <text x={scx(x-0.5)} y={scy(y)} key={`${x}-${y}`} fill="#000" fontSize="14"
                    fontFamily="-apple-system, BlinkMacSystemFont, Roboto, sans-serif"
                    alignmentBaseline="central"
                    textAnchor="middle"
                    pointerEvents="none">{note}</text>
            ))}
            { /* Circle of fifths circle */}
            { Scale.CircleOfFifths.map((notes, i) => (
                <Arc key={i} x={350} y={300} innerRadius={30} outerRadius={100} startAngle={i*30-14} endAngle={(i+1)*30-14} padAngle={3} fill="white" />
            ))}
        </>
    )
}

export { Fretboard }