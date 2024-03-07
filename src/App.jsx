import React, { useState, useMemo } from "react"
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider, Outlet, NavLink } from "react-router-dom"
import { FretboardCtrl, Note, Scale } from "./musictheory.js"
import { Fretboard, CircleOfFifths, ChromaticNoteCircle } from "./Fretboard.jsx"
import { Row, ToggleTwoText } from "./UI.jsx"

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
    <div className="m-auto w-[1000px]">
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
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Fretboard</span>
      </a>
      <button type="button" className="hidden items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div className="pl-14">
        <ul className="font-medium flex justify-center p-4 md:p-0 border-gray-100 rounded-lg space-x-8 border-0 md">
          <NavbarLink to="">Scales</NavbarLink>
          <NavbarLink to="circle-of-fifths">Circle of Fifths</NavbarLink>
        </ul>
      </div>
    </div>
  </nav>
)


const ScalesPage = () => {
  const tuning = ["E", "A", "D", "G", "B", "E"]
  const [rootNote, setRootNote] = useState("C")
  const [scaleName, setScaleName] = useState("major")
  const [showNotes, setShowNotes] = useState(true)

  const scale = useMemo(() => new Scale(rootNote, scaleName), [rootNote, scaleName])
  const board = useMemo(() => new FretboardCtrl(13, tuning, scale.whichAccidental()), [scale])
  const colorFunc = (note) => Scale.Colormap[Note.dist(rootNote, note)]

  return (
    <div className="flex justify-center flex-col m-20">
      <div className="mb-8">
        {/* Key select */}
        <select value={scale.key} onChange={e => setRootNote(e.target.value)}
          className="bg-gray-600 border border-gray-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[8rem] p-2.5 mr-4 text-center outline-none">
          {Scale.Chromatic.map(notes =>
            notes.map(note => 
              <option value={note} key={note}>{note}</option>
            )
          )}
        </select>

        {/* Scale select */}
        <select value={scaleName} onChange={e => setScaleName(e.target.value)}
          className="bg-gray-600 border border-gray-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[8rem] p-2.5 mr-4 text-center outline-none">
          {Scale.supportedScales.map(supportedScaleName =>
            <option key={supportedScaleName} value={supportedScaleName}>{supportedScaleName}</option>
          )}
        </select>

        <ToggleTwoText active={showNotes} onChange={() => setShowNotes(!showNotes)} 
          leftText="Note" rightText="Interval" />
      </div>

      <svg width="800" height="200">
        <Fretboard width={800} board={board}
          colorFunc={colorFunc}
          noteFunc={(note) => scale.has(note)}
          onMouseEnter={(x, y, note) => null} onMouseOut={(x, y, note) => null} />
      </svg>

      <Row className="w-[500px] ml-[8rem] justify-between">
        <div className="w-[200px] ml-[150px]">
          <div className="text-white font-semibold text-center pb-2">Chromatic notes</div>
          <svg width="200" height="200">
            <ChromaticNoteCircle x={100} y={100} innerRadius={30} outerRadius={100}
              noteFunc={(note) => scale.has(note)} 
              colorFunc={colorFunc} 
              onClick={(note) => setRootNote(note)} />
          </svg>
        </div>
      </Row>
    </div>
  )
}


const CircleOfFifthsPage = () => {
  const tuning = ["E", "A", "D", "G", "B", "E"]
  const board = useMemo(() => new FretboardCtrl(13, tuning), [])

  // active note in circle of fifths
  const [cofNote, setCofNote] = useState(null)
  // color function. calculates the color according to the circle of fifths
  const colorFunc = (note) => Scale.Colormap[Scale.indexOfCircleOfFifths(note)]

  return (
    <div className="flex justify-center flex-col m-20">
      <svg width="800" height="200">
        <Fretboard width={800} board={board}
          noteFunc={(note) => Note.eq(cofNote, note)} colorFunc={colorFunc}
          onMouseEnter={(x, y, note) => setCofNote(note)} onMouseOut={(x, y, note) => setCofNote(null)} />
      </svg>
      <Row className="w-[500px] ml-[8rem] justify-between">
        <div className="w-[200px]">
          <div className="text-white font-semibold text-center">Circle of Fifths</div>
          <svg width="200" height="200">
            <CircleOfFifths x={100} y={100} innerRadius={30} outerRadius={100}
              noteFunc={(note) => Note.eq(note, cofNote)} colorFunc={colorFunc}
              onNoteEnter={note => setCofNote(note)} onNoteOut={_ => setCofNote(null)} />
          </svg>
        </div>
        <div className="w-[200px]">
          <div className="text-white font-semibold text-center">Chromatic Circle</div>
          <svg width="200" height="200">
            <ChromaticNoteCircle x={100} y={100} innerRadius={30} outerRadius={100}
              noteFunc={(note) => Note.eq(note, cofNote)} colorFunc={colorFunc}
              onNoteEnter={note => setCofNote(note)} onNoteOut={_ => setCofNote(null)} />
          </svg>
        </div>
      </Row>
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