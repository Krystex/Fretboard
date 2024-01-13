import React, { useState } from "react"
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom"
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
    <div>
      <Outlet />
    </div>
  )
}


const CircleOfFifthsPage = () => {
  const tuning = ["E", "A", "D", "G", "B", "E"]
  const board = new FretboardCtrl(13, tuning)

  // active note in circle of fifths
  const [cofNote, setCofNote] = useState(null)
  // color function. calculates the color according to the circle of fifths
  const colorFunc = (note) => Scale.Colormap[Scale.indexOfCircleOfFifths(note)]

  return (
    <div className="flex justify-center flex-col m-20">
      {/* <nav className="border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Fretboard</span>
          </a>
          <button className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2">
            <span className="sr-only">Open main menu</span>
          </button>
          <div className="hidden w-full md:block md:w-auto">
            <ul className="font-medium flex flex-col p-4 md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-8 md:border-0 md:bg-white dark:bg-gray-800 md">
              <li>
                <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">Test</a>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}

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
    element: <CircleOfFifthsPage />,
    children: [
      {
        path: "circle-of-fifths",
        element: <CircleOfFifthsPage />
      },
      {
        path: "empty",
        element: <div>empty</div>
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