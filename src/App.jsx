import React, { useState, useMemo } from "react"
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider, Outlet, Link } from "react-router-dom"
import { FretboardCtrl, Note, Scale } from "./musictheory.js"
import { Fretboard, CircleOfFifths, ChromaticNoteCircle } from "./Fretboard.jsx"
import { Row } from "./Utils.jsx"

if (!window.IS_PRODUCTION) {
  // if in development mode, wait for change message from live server
  console.log("Development mode")
  new EventSource('/esbuild').addEventListener('change', _ => location.reload())
}

/**
 * Home Page, global page which links to all other pages (not yet used)
 */
const HomePage = () => {
  return (
    <div className="m-auto w-[1000px]">
      <Navbar />
      <Outlet />
    </div>
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
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div className="pl-14">
        <ul className="font-medium flex justify-center p-4 md:p-0 border-gray-100 rounded-lg space-x-8 border-0 md">
          <Link to={`scales`} className="block py-2 px-3 rounded text-blue-500">Scales</Link>
          <Link to={``} className="block py-2 px-3 rounded text-blue-500">Circle of Fifths</Link>
        </ul>
      </div>
    </div>
  </nav>
)


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
              highlightNote={cofNote} colorFunc={colorFunc}
              onNoteEnter={note => setCofNote(note)} onNoteOut={_ => setCofNote(null)} />
          </svg>
        </div>
        <div className="w-[200px]">
          <div className="text-white font-semibold text-center">Chromatic Circle</div>
          <svg width="200" height="200">
            <ChromaticNoteCircle x={100} y={100} innerRadius={30} outerRadius={100}
              highlightNote={cofNote} colorFunc={colorFunc}
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
        element: <CircleOfFifthsPage />
      },
      {
        path: "scales",
        element: <div>Scales</div>
      }
    ]
  },
])

const root = createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<div>placeholder</div>} />
  </React.StrictMode>
)