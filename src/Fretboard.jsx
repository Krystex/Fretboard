import React from "react"
import { range, pointOnCircle, scaleLinear } from "./helper"
import { FretboardCtrl, Scale, Note } from "./musictheory"

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
 * @param {Number} props.outerRadius outer radius of circle
 * @param {Number} props.startAngle starting angle of arc (in degrees)
 * @param {Number} props.endAngle ending angle or arc (in degrees)
 * @returns
 * @example
 * <Arc x={70} y={70} innerRadius={50} outerRadius={70} startAngle={0} endAngle={350} fill="white" />
 */
const Arc = ({ x, y, innerRadius, outerRadius, startAngle, endAngle, padAngle = 0, ...rest }) => {
  const deg2rad = deg => (2 * Math.PI / 360) * deg
  const rad2deg = rad => rad * 180 / Math.PI
  const circle = (radius, angle) => [(radius * Math.cos(deg2rad(angle))).toFixed(3), (radius * Math.sin(deg2rad(angle))).toFixed(3)]

  const anglePadding = deg2rad(padAngle) / 2  // i don't really know what i'm doing with the padding angle. its all taken from d3's arc function
  const radiusPadding = Math.sqrt(innerRadius * innerRadius + outerRadius * outerRadius) // geometric mean of inner and outer radius
  const innerPadding = Math.asin(radiusPadding / innerRadius * Math.sin(anglePadding))
  const outerPadding = Math.asin(radiusPadding / outerRadius * Math.sin(anglePadding))
  const [innerStartX, innerStartY] = circle(innerRadius, startAngle - 90)
  const [innerStopX, innerStopY] = circle(innerRadius, endAngle - 90 - rad2deg(innerPadding))
  const [outerStartX, outerStartY] = circle(outerRadius, startAngle - 90)
  const [outerStopX, outerStopY] = circle(outerRadius, endAngle - 90 - rad2deg(outerPadding))

  const over180degrees = (endAngle - startAngle) > 180
  const sweepflag = over180degrees ? "1" : "0"

  return (
    <path d={`M ${outerStartX} ${outerStartY} A ${outerRadius} ${outerRadius} 0 ${sweepflag} 1 ${outerStopX} ${outerStopY} L ${innerStopX} ${innerStopY} A ${innerRadius} ${innerRadius} 0 ${sweepflag} 0 ${innerStartX} ${innerStartY}Z`} transform={`translate(${x},${y})`} {...rest}></path>
  )
}

/**
 * Arcs arranged in a circle, similar to a pie-plot
 */
const CircleOfArcs = ({ num, ...rest }) => {
  const angle = 360. / num
  return (
    <>{range(0, 360, angle).map(i => (
      <Arc key={i} {...rest} startAngle={i} endAngle={i + angle} text={i} />
    ))}</>
  )
}

/**
 * Text component for embedding in svg
 * @param {object} props
 * @param {Number} props.x x position
 * @param {Number} props.y y position
 * @param {JSX.Element} props.children children of object eg. text
 * @returns 
 * @example <Text x={10} y={20}>Example text</Text>
 */
const Text = ({ x, y, children, ...rest }) => (
  <text x={x} y={y} fontFamily="-apple-system, BlinkMacSystemFont, Roboto, sans-serif"
    alignmentBaseline="central" fontWeight="bold" fontSize={14}
    textAnchor="middle"
    pointerEvents="none" {...rest}>{children}</text>
)

/**
 * 12-note circle, used for Circle of Fifths and Chromatic Circle
 * @param {object} props props
 * @param {Number} props.x x position
 * @param {Number} props.y y position
 * @param {String} props.highlightNote note which should be highlighted on circle
 * @param {Number} props.innerRadius inner radius of circle
 * @param {Number} props.outerRadius outer radius of circle
 * @param {(String) => boolean} props.onNoteEnter function gets triggered if note is hovered
 * @param {(String) => boolean} props.onNoteOut function gets triggered if note is not hovered anymore
 * @param {(String) => String} props.colorFunc color function which determines which color should be shown for specific note
 * @param {Array<string>} props.scale scale to display (eg. `Scale.Chromatic`)
 */
const Circle12Notes = ({ x, y, innerRadius, outerRadius, highlightNote, onNoteEnter = null, onNoteOut = null, colorFunc, scale }) => {
  const angle = 360. / 12
  const halfAngle = angle / 2 - 1  // used for shifting arcs so they are centered. minus one just because it looks a little nicer
  const padAngle = 2

  return (
    <>
      { /* Circle of fifths circle */}
      {scale.map((notes, i) => (
        <Arc key={i} x={x} y={y} innerRadius={innerRadius} outerRadius={outerRadius}
          startAngle={i * angle - halfAngle} endAngle={(i + 1) * angle - halfAngle} padAngle={padAngle}
          onMouseEnter={() => onNoteEnter(notes[0])} onMouseOut={() => onNoteOut()}
          fill={Note.eq(highlightNote, notes[0]) ? colorFunc(notes[0]) : "white"} />
      ))}
      { /* Circle of fifths texts */}
      {scale.map((notes, i) => {
        const startAngle = i * angle - halfAngle, endAngle = (i + 1) * angle - halfAngle
        // radiusOffset is used if two notes are displayed (eg. F# and Gb)
        //   0.18 is scaling factor for distance from middle point of radii
        const radiusOffset = notes.length == 2 ? 0.18 * (outerRadius - innerRadius) : 0
        const [textPosX, textPosY] = pointOnCircle(innerRadius + (outerRadius - innerRadius) / 2 + radiusOffset, startAngle + (endAngle - startAngle) / 2 - 90, offset = [x, y])
        const [textPosX2, textPosY2] = pointOnCircle(innerRadius + (outerRadius - innerRadius) / 2 - radiusOffset, startAngle + (endAngle - startAngle) / 2 - 90, offset = [x, y])

        return (
          <g key={i}>
            <Text x={textPosX} y={textPosY}>{notes[0]}</Text>
            {notes.length == 2 ? <Text x={textPosX2} y={textPosY2}>{notes[1]}</Text> : ""}
          </g>
        )
      })}
    </>
  )
}

/**
 * Circle of fifths component in svg
 * @param {object} props props
 * @param {Number} props.x x position
 * @param {Number} props.y y position
 * @param {String} props.highlightNote note which should be highlighted on circle
 * @param {Number} props.innerRadius inner radius of circle
 * @param {Number} props.outerRadius outer radius of circle
 * @param {(String) => boolean} props.onNoteEnter function gets triggered if note is hovered
 * @param {(String) => boolean} props.onNoteOut function gets triggered if note is not hovered anymore
 * @param {(String) => String} props.colorFunc color function which determines which color should be shown for specific note
 */
const CircleOfFifths = (props) => (
  <Circle12Notes {...props} scale={Scale.CircleOfFifths} />
)

const ChromaticNoteCircle = (props) => (
  <Circle12Notes {...props} scale={Scale.Chromatic} />
)

/**
 * 
 * @param {object} props 
 * @param {Number} props.width width of svg context
 * @param {FretboardCtrl} props.board fretboard controller which holds note names, num of strings, num of frets
 * @param {(String) => boolean} props.noteFunc note function which determines if note should be shown or not
 * @param {(String) => String} props.colorFunc color function which determines which color should be shown for specific note
 * @param {() => (Number, Number, String)} props.onMouseEnter event handler when mouse hovers note circle
 * @param {() => (Number, Number, String)} props.onMouseOut event handler when mouse stops hovering note circle
 * @returns 
 */
const Fretboard = ({ width, board, noteFunc, colorFunc, onMouseEnter, onMouseOut }) => {
  // padding on left and right side: 10%
  const paddingSide = 0.1 * width
  // x scaler
  const scx = scaleLinear([paddingSide, width - paddingSide], [0, board.numFrets])
  // y scaler
  const scy = scaleLinear([20, 200], [0, board.numStrings])

  return (
    <>
      { /* Horizontal Lines */}
      {range(0, board.numStrings).map(i => (
        <Line key={i} fromx={scx(0)} fromy={scy(i)} tox={scx(board.numFrets - 1)} toy={scy(i)} stroke="#aaa" strokeWidth="1.5" />
      ))}
      { /* Vertical Lines */}
      {range(0, board.numFrets).map(i => (
        <Line key={i} fromx={scx(i)} fromy={scy(0)} tox={scx(i)} toy={scy(board.numStrings - 1)} stroke="#aaa" strokeWidth={i == 0 || i == 11 ? 3 : 1.5} strokeLinecap="round" />
      ))}
      { /* Fretboard navigation dots */}
      {[3, 5, 7, 9].map(i => (
        <circle key={i} cx={scx(i - 0.5)} cy={scy(board.numStrings / 2 - 0.5)} r="8" fill="#444"></circle>
      ))}
      { /* Fretboard note circles */}
      {board.map((x, y, note) => (
        <circle key={`${x}-${y}`} cx={scx(x - 0.5)} cy={scy(y)} r="12" stroke="#000"
          fill={colorFunc(note)} opacity={noteFunc(note) ? 1 : 0}
          onMouseEnter={() => onMouseEnter && onMouseEnter(x, y, note)}
          onMouseOut={() => onMouseOut && onMouseOut(x, y, note)}></circle>
      ))}
      { /* Fretboard note circles texts */}
      {board.map((x, y, note) => (
        <text x={scx(x - 0.5)} y={scy(y)} key={`${x}-${y}`} fill="#000" fontSize="14"
          opacity={noteFunc(note) ? 1 : 0}
          fontFamily="-apple-system, BlinkMacSystemFont, Roboto, sans-serif"
          alignmentBaseline="central"
          textAnchor="middle"
          pointerEvents="none">{note}</text>
      ))}
    </>
  )
}

export { Fretboard, CircleOfFifths, ChromaticNoteCircle }