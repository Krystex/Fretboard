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
 * Toggle switch
 * @param {object} props
 * @param {boolean} props.active Toggle on or off 
 * @returns {React.ReactElement}
 */
const Toggle = ({active}) => {
  return (
    <>
      <label className="inline-flex items-center cursor-pointer ml-[14rem]">
        <span class="ms-3 mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Note</span>
        <input type="checkbox" className="hidden peer" checked={active} />
        <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
                        after:content-[''] after:absolute top-0.5 after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600"></div>
        <span class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Interval</span>
      </label>
    </>
  )
}

export { Row, Toggle }