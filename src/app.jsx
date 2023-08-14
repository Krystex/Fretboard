import React, { useCallback, useState } from "react"
import { createRoot } from 'react-dom/client'
import "./musictheory.js"
import { Fretboard } from "./Fretboard.jsx"

new EventSource('/esbuild').addEventListener('change', () => location.reload())

const App = (props) => {

    const [count, setCount] = useState(0);
    const increment = useCallback(() => {
        setCount(count => count + 1)
    }, [count])

    return (
        <>
            <h1>{props.message}</h1>
            <h2>Count: {count}</h2>
            <Fretboard />
            <button onClick={increment}>Increment</button>
        </>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)