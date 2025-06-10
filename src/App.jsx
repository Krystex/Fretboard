import React, { useState, useMemo, useEffect } from "react"
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider, Outlet, NavLink } from "react-router-dom"
import { FretboardCtrl, Note, Scale } from "./musictheory.js"
import { Fretboard, CircleOfFifths, ChromaticNoteCircle } from "./Fretboard.jsx"
import { Row, Box, ToggleTwoText } from "./UI.jsx"

if (!window.IS_PRODUCTION) {
  // if in development mode, wait for change message from live server
  console.log("Development mode")
  new EventSource('/esbuild').addEventListener('change', _ => location.reload())
}

/**
 * Home Page, global page which links to all other pages
 */
const HomePage = () => {
  return (
    <div className="mx-auto max-w-4xl px-2 sm:px-6 lg:px-8">
      <Navbar />
      <Outlet />
    </div>
  )
}

const NavbarLink = ({to, children}) => {
  const className = "block py-2 px-3 rounded"
  const classNameActive = className + " text-blue-500 border-red"
  const classNameInactive = className + " text-white"
  return (
    <NavLink to={to} className={({isActive}) => isActive ? classNameActive : classNameInactive}>{children}</NavLink>
  )
}

// Taken from https://flowbite.com/docs/components/navbar/#default-navbar
const Navbar = () => (
  <nav className="border-gray-200">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-start mx-auto p-4">
      <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap text-white">Fretboard</span>
      </a>
      <button type="button" className="hidden items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div className="pl-4 sm:pl-14">
        <ul className="font-medium flex justify-center p-4 md:p-0 border-gray-100 rounded-lg space-x-2 sm:space-x-8 border-0 md">
          <NavbarLink to="">Scales</NavbarLink>
          <NavbarLink to="circle-of-fifths">Circle of Fifths</NavbarLink>
        </ul>
      </div>
    </div>
  </nav>
)

/**
 * Make sure tuning input is valid. Only returns valid tuning string
 * @param {string} text Tuning input
 * @returns {string} Valid tuning input
 */
const processTuning = (text) => {
  const validChars = ["A", "B", "C", "D", "E", "F", "G"]
  let notes = []
  for (let i=0; i<text.length; i++) {
    if (validChars.includes(text[i])) {
      notes.push(text[i])
    } else if (["b", "#"].includes(text[i]) && notes.length && validChars.includes(notes[notes.length - 1])) {
      notes[notes.length-1] += text[i]
    }
  }
  return notes
}

const ScalesPage = () => {
  const [tuning, setTuning] = useState(["E", "A", "D", "G", "B", "E"])
  const [tuningText, setTuningText] = useState(tuning.join(""))
  const [rootNote, setRootNote] = useState("C")
  const [scaleName, setScaleName] = useState("major")
  const [notesOrInterval, setNotesOrInterval] = useState(true)
  const [fretboardWidth, setFretboardWidth] = useState(800)

  const onEnterTuningText = (text) => {
    setTuningText(processTuning(text).join(""))
  }
  const onChangeTuning = () => {
    setTuning(processTuning(tuningText))
  }

  useEffect(() => {
    const updateFretboardWidth = () => {
      const maxWidth = window.innerWidth - 64 // Account for padding
      console.log("maxWidth", maxWidth)
      setFretboardWidth(Math.min(800, maxWidth))
    }

    updateFretboardWidth()
    window.addEventListener('resize', updateFretboardWidth)
    return () => window.removeEventListener('resize', updateFretboardWidth)
  }, [])
  
  const scale = useMemo(() => new Scale(rootNote, scaleName), [rootNote, scaleName])
  const board = useMemo(() => new FretboardCtrl(13, tuning, scale.whichAccidental()), [scale, tuning])
  const colorFunc = (note) => Scale.Colormap[Note.dist(rootNote, note)]
  // if interval mode is enable, display the intervals with this function
  const displayFunc = (note) => Scale.Intervals[Note.dist(rootNote, note)]

  return (
    <div className="flex flex-col items-center mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-8 sm:my-12 lg:my-20">
      <div className="w-full mb-8 sm:mb-12 lg:mb-20">
        {/* Intro Card */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 items-start sm:items-center">
          <input type="text" 
            onChange={(e) => onEnterTuningText(e.target.value)} 
            onBlur={() => onChangeTuning()} 
            onKeyUp={(e) => e.key == "Enter" && onChangeTuning(e) && e.target.blur()}
            value={tuningText}
            placeholder="Tuning"
            className="rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 p-2.5 text-white text-sm font-medium w-full sm:w-auto"/>
          {/* Key select */}
          <select value={scale.key} onChange={e => setRootNote(e.target.value)}
            className="bg-gray-600 border border-gray-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-[8rem] p-2.5 text-center outline-none">
            {Scale.Chromatic.map(notes =>
              notes.map(note => 
                <option value={note} key={note}>{note}</option>
              )
            )}
          </select>

          {/* Scale select */}
          <select value={scaleName} onChange={e => setScaleName(e.target.value)}
            className="bg-gray-600 border border-gray-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-[8rem] p-2.5 text-center outline-none">
            {Scale.supportedScales.map(supportedScaleName =>
              <option key={supportedScaleName} value={supportedScaleName}>{supportedScaleName}</option>
            )}
          </select>

          <ToggleTwoText active={notesOrInterval} onChange={() => setNotesOrInterval(!notesOrInterval)} 
            leftText="Note" rightText="Interval" />
        </div>
      </div>

      <div className="w-full flex justify-center overflow-x-auto">
        <Fretboard width={fretboardWidth} board={board}
          colorFunc={colorFunc}
          noteFunc={(note) => scale.has(note)}
          displayFunc={notesOrInterval && displayFunc}
          onMouseEnter={(x, y, note) => null} onMouseOut={(x, y, note) => null} />
      </div>

      <div className="flex justify-center mt-8">
        <div className="flex flex-col items-center">
          <div className="text-white font-semibold text-center pb-2">Chromatic notes</div>
          <svg width="200" height="200" className="max-w-full h-auto">
            <ChromaticNoteCircle x={100} y={100} innerRadius={30} outerRadius={100}
              noteFunc={(note) => scale.has(note)} 
              colorFunc={colorFunc} 
              onClick={(note) => setRootNote(note)} />
          </svg>
        </div>
      </div>
    </div>
  )
}


const CircleOfFifthsPage = () => {
  const tuning = ["E", "A", "D", "G", "B", "E"]
  const board = useMemo(() => new FretboardCtrl(13, tuning), [])
  const [fretboardWidth, setFretboardWidth] = useState(800)

  // active note in circle of fifths
  const [cofNote, setCofNote] = useState(null)
  // color function. calculates the color according to the circle of fifths
  const colorFunc = (note) => Scale.Colormap[Scale.indexOfCircleOfFifths(note)]

  useEffect(() => {
    const updateFretboardWidth = () => {
      const maxWidth = window.innerWidth - 64 // Account for padding
      setFretboardWidth(Math.min(800, maxWidth))
    }

    updateFretboardWidth()
    window.addEventListener('resize', updateFretboardWidth)
    return () => window.removeEventListener('resize', updateFretboardWidth)
  }, [])

  return (
    <div className="flex flex-col items-center mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-8 sm:my-12 lg:my-20">
      <div className="w-full flex justify-center overflow-x-auto">
        <Fretboard width={fretboardWidth} board={board}
          noteFunc={(note) => Note.eq(cofNote, note)} colorFunc={colorFunc}
          onMouseEnter={(x, y, note) => setCofNote(note)} onMouseOut={(x, y, note) => setCofNote(null)} />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-8">
        <div className="flex flex-col items-center">
          <div className="text-white font-semibold text-center mb-2">Circle of Fifths</div>
          <svg width="200" height="200" className="max-w-full h-auto">
            <CircleOfFifths x={100} y={100} innerRadius={30} outerRadius={100}
              noteFunc={(note) => Note.eq(note, cofNote)} colorFunc={colorFunc}
              onNoteEnter={note => setCofNote(note)} onNoteOut={_ => setCofNote(null)} />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-white font-semibold text-center mb-2">Chromatic Circle</div>
          <svg width="200" height="200" className="max-w-full h-auto">
            <ChromaticNoteCircle x={100} y={100} innerRadius={30} outerRadius={100}
              noteFunc={(note) => Note.eq(note, cofNote)} colorFunc={colorFunc}
              onNoteEnter={note => setCofNote(note)} onNoteOut={_ => setCofNote(null)} />
          </svg>
        </div>
      </div>
    </div>
  )
}

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: <ScalesPage />
      },
      {
        path: "circle-of-fifths",
        element: <CircleOfFifthsPage />
      },
    ]
  },
])

const root = createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<div>placeholder</div>} />
  </React.StrictMode>
)