import React, { useCallback, useState } from "react"
import { createRoot } from 'react-dom/client'
import "./musictheory.js"
import { Fretboard } from "./Fretboard.jsx"

new EventSource('/esbuild').addEventListener('change', () => location.reload())

const App = (props) => {
    return (
        <>
            <svg width="800" height="600">
                <Fretboard width={800} />
            </svg>
        </>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)