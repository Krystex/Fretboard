import React from "react"

/**
 * Row HTML element
 * @param {object} props
 * @param {object} props.children Children to align in row
 * @param {String} props.className ClassNames to prepend to Row HTML element
 * @returns {React.ReactElement}
 */
const Row = ({ children, className = "" }) => (
  <div className={className + ` flex flex-row justify-normal`}>
    {children}
  </div>
)


/**
 * Toggle switch with text left and text right
 * @param {object} props
 * @param {boolean} props.active Toggle on or off
 * @param {() => ()} props.onChange On change handler, triggers on click
 * @param {string} props.leftText
 * @param {string} props.rightText
 * @returns {React.ReactElement}
 */
const ToggleTwoText = ({active, onChange, leftText, rightText}) => {
  const activeColor = "text-gray-300"
  const inactiveColor = "text-gray-600"
  return (
    <>
      <label className="inline-flex items-center cursor-pointer">
        <span className={`ms-3 mr-2 text-sm transition-all font-medium ${active ? inactiveColor : activeColor}`}>{leftText}</span>
        <input type="checkbox" className="hidden peer" checked={active} onChange={onChange} />
        <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
                        after:content-[''] after:absolute top-0.5 after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600"></div>
        <span className={`ml-2 text-sm transition-all font-medium ${active ? activeColor : inactiveColor}`}>{rightText}</span>
      </label>
    </>
  )
}

/**
 * Box component. A rounded, gray box with padding, which can be used for text.
 * @param {object} props
 * @param {object} props.children Childen to display in the box
 * @param {string} props.className Classnames to preprent to the style
 * @returns 
 */
const Box = ({ children, className = "" }) => {
  return (
    <div className={className + ` block p-6 mb-12 bg-zinc-800 rounded-lg`}>
      {children}
    </div>
  )
}

export { Row, Box, ToggleTwoText }