import React, { useCallback, useState } from "react"
import { createRoot } from 'react-dom/client'
import { FretboardCtrl, Note, Scale } from "./musictheory.js"
import { Fretboard, CircleOfFifths, ChromaticNoteCircle } from "./Fretboard.jsx"

if (!window.IS_PRODUCTION) {
    // if in development mode, wait for change message from live server
    console.log("Development mode")
    new EventSource('/esbuild').addEventListener('change', _ => location.reload())
}

const App = () => {
    const tuning = ["E", "A", "D", "G", "B", "E"]
    const board = new FretboardCtrl(13, tuning)

    // active note in circle of fifths
    const [cofNote, setCofNote] = useState(null)
    // color function. calculates the color according to the circle of fifths
    const colorFunc = (note) => Scale.Colormap[Scale.indexOfCircleOfFifths(note)]

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="800" height="600">
                <Fretboard width={800} board={board}
                    noteFunc={(note) => Note.eq(cofNote, note)} colorFunc={colorFunc}
                    onMouseEnter={(x, y, note) => setCofNote(note)} onMouseOut={(x, y, note) => setCofNote(null)} />
                <CircleOfFifths x={230} y={300} innerRadius={30} outerRadius={100}
                    highlightNote={cofNote}
                    onNoteEnter={note => setCofNote(note)} onNoteOut={_ => setCofNote(null)} />
                <ChromaticNoteCircle x={530} y={300} innerRadius={30} outerRadius={100}
                    highlightNote={cofNote}
                    onNoteEnter={note => setCofNote(note)} onNoteOut={_ => setCofNote(null)} />
            </svg>
        </div>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)