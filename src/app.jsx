import React, { useCallback, useState } from "react"
import { createRoot } from 'react-dom/client'
import { FretboardCtrl } from "./musictheory.js"
import { Fretboard } from "./Fretboard.jsx"


new EventSource('/esbuild').addEventListener('change', () => location.reload())

const App = () => {
    const tuning = ["E", "A", "D", "G", "B", "E"]
    const board = new FretboardCtrl(13, tuning)

    return (
        <>
            <svg width="800" height="600">
                <Fretboard width={800} board={board} />
            </svg>
        </>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)