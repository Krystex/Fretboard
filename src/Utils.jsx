import React from "react"

/**
 * Row HTML element
 * @param {object} props
 * @param {object} props.children Children to align in row
 * @param {String} props.className ClassNames to prepend to Row HTML element
 * @returns {React.ReactElement}
 */
const Row = ({children, className=""}) => (
    <div className={className + ` flex flex-row justify-normal`}>
        {children}
    </div>
)

export {Row}