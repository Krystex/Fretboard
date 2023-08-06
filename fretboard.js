const width=700; const height=0.30*width
const svg = d3.select("div")
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", 0.8*width)

// settings
let displayInterval = false
const scale = []
const circleRadius = 0.5
const fretboardLineWidth = 1.5
const colormap = ["#DF315E","#EB5D34","#E28535","#CB9C1B","#FDC528","#B4D34A","#58BF63","#0AB59F","#00A5DD","#4B7ABA","#9059A1","#B43498"]
const theme = {
	"light": {
		fretboardColor: "black",
		referenceDotColor: "#aaa",
		noteCircleColor: "#555",
		circleOfFifthsArcNotSelected: "#red"
	},
	"dark": {
		fretboardColor: "#aaa",
		referenceDotColor: "#444",
		noteCircleColor: "#000",
		circleOfFifthsArcNotSelected: "#ddd"
	}
}["dark"]

// scales
const scx = d3.scaleLinear().domain([0,100]).range([0,width]) // scalex
const scy = d3.scaleLinear().domain([0,100]).range([0,height]) // scaley
const fscx = d3.scaleLinear().domain([0,12]).range([0.1*width,0.9*width]) // fretboard scale
const fscy = d3.scaleLinear().domain([0,5]).range([0.1*height,0.9*height])

/// 1. fretboard
// build notes in standard tuning
fb = buildFretboard(13)
// 2d grid for notes on fretboard
let arr = []
for (let x=0; x<13; x++) {
	for (let y=0; y<6; y++) {
		arr.push({x, y})
	}
}
const lines = d3.line()
	.x(d => fscx(d[0]))
	.y(d => fscy(d[1]))
// 1a. horizontal lines
svg.selectAll().data(d3.range(6)).enter().append("path")
	.attr("d", d => lines([[0.5, d], [11.5, d]]))
	.attr("stroke", theme.fretboardColor)
	.attr("stroke-width", fretboardLineWidth)
// 1b. vertical lines
svg.selectAll().data(d3.range(12)).enter().append("path")
	.attr("d", d => lines([[d+0.5, 0], [d+0.5, 5]]))
	.attr("stroke", theme.fretboardColor)
	.attr("stroke-width", d => d==0 ? 2.*fretboardLineWidth : fretboardLineWidth)
	.attr("stroke-linecap", "round")
// 1c. reference dots on fretboard
svg.selectAll().data([2, 4, 6, 8]).enter().append("circle")
	.attr("cx", d => fscx(d+1))
	.attr("cy", fscy(2.5))
	.attr("r", 8)
	.attr("fill", theme.referenceDotColor)
// 1d. note circles + text
let noteCircles = svg.selectAll()
	.data(arr)
	.enter()
	.append("circle")
	.attr("cx", d => fscx(d.x))
	.attr("cy", d => fscy(d.y))
	.attr("r", fscy(0.1)*circleRadius)
	.attr("fill", "#fff")
	.attr("stroke", theme.noteCircleColor)
	.attr("opacity", "0")
	.on("mouseenter", (e, d) => {
		const note = fb[d.x][d.y]
		showNotes([note])
	})
	.on("mouseout", (e, d) => {
		showNotes([])  // when mouse goes away from note, don't display anything
	})
// 1e. text for note circles
let noteCirclesTexts = svg.selectAll().data(arr).enter()
	.append("text")
	.attr("x", d => fscx(d.x))
	.attr("y", d => fscy(d.y))
	.attr("font-family", "-apple-system, BlinkMacSystemFont, Roboto, sans-serif")
	.attr("font-size", 14)
	.attr("font-weight", "bold")
	.attr("fill", "#000")
	.attr("alignment-baseline", "central")
	.attr("text-anchor", "middle")
	.attr("pointer-events", "none")

let fretboardAnimationActive = false
let fretboardNotes = ["E", "A", "D", "G", "B", "E"]
let fretboardNoteIdx = 0

const circleX = 50
const circleY = 160
const innerRadius = 5
const outerRadius = 15
const notePos = outerRadius-innerRadius
const circleOfFifths = constructScale("C", "circle of fifths")  // not really a scale, but easy to construct this way
const deg2rad = deg => (2*Math.PI/360)*deg
const arc = (x) => d3.arc()
	.innerRadius(scx(innerRadius))
	.outerRadius(scx(outerRadius))
	.startAngle(2*Math.PI/12*(x-0.5))
	.endAngle(2*Math.PI/12*(x+1-0.5))
	.padAngle(deg2rad(1))
/// 3. Circle of fifths
// 3a. Arcs
let cofArc = svg.selectAll()
	.data(circleOfFifths)
	.enter()
	.append("path")
	.attr("d", (d,i) => arc(i)())
	.attr("transform", `translate(${scx(circleX)},${scy(circleY)})`)
	.attr("fill", theme.circleOfFifthsArcNotSelected)
	.on("mouseenter", (e, d) => {
		const i = indexOfNoteInScale(d, circleOfFifths)
		d3.select(e.target).attr("fill", colormap[i])
		showNotes([circleOfFifths[i]])
	})
	.on("mouseout", (e) => {
		d3.select(e.target).attr("fill", "#ddd")
		showNotes([])
	})
// 3b. Text
svg.selectAll()
	.data(circleOfFifths)
	.enter()
	.append("text")
	.attr("x", (d,i) => d3.pointRadial(2*Math.PI/12*(i-0.5)+deg2rad(15), scx(circleX)/4.7)[0])
	.attr("y", (d,i) => d3.pointRadial(2*Math.PI/12*(i-0.5)+deg2rad(15), scy(circleY)/4.7)[1])
	.attr("pointer-events", "none")
	.attr("font-size", scx(3)*0.7)
	.attr("font-weight", "bold")
	.attr("fill", "#000")
	.attr("font-family", "-apple-system, BlinkMacSystemFont, Roboto, sans-serif")
	.attr("transform", `translate(${scx(circleX)},${scy(circleY)})`)
	.attr("alignment-baseline", "central")
	.attr("text-anchor", "middle")
	.text(d => d)

/**
 * Show notes on fretboard and circle of fifths
 * @param {Array<String>} notes 
 */
function showNotes(notes) {
	// display notes on circle of fifths
	cofArc.attr("fill", (d,i) => notes.includes(d) ? colormap[i] : theme.circleOfFifthsArcNotSelected)

    // set note circles to display/not display
	noteCircles
        .attr("opacity", d => {
            note = fb[d.x][d.y]
            return noteInScale(note, notes) ? 1 : 0
        })
        .attr("fill", d => {
            const note = fb[d.x][d.y]
            return noteInScale(note, notes) ? colormap[indexOfNoteInScale(note, notes)] : "#f0f0f5"
        })
    // set note circle text
    noteCirclesTexts
        .text(d => {
            const note = fb[d.x][d.y]
            noteName = displayInterval ? intervals[indexOfNoteInScale(note, notes)] : note
            if (noteInScale(note, notes)) return noteName
            else return ""
        })
}
