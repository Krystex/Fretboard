
const tuning = ["E", "A", "D", "G", "B", "E"]
const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
const intervals = ["R", "m2", "2", "m3", "3", "4", "d5", "5", "m6", "6", "m7", "7"]
const intervals_ = ["R", "m2", "M2", "m3", "M3", "P4", "d5", "P5", "m6", "M6", "m7", "M7"]

/**
 * Returns the absolute index of a note (A=0)
 * @param {String} note 
 * @returns 
 */
function indexOfNote(note) {
	if (note)
	return notes.indexOf(note)
}

/**
 * Returns the index of a note in a scale
 * @example
 * e.g. `indexOfNoteInScale("D", constructScale("C", "major"))` --> `2`
 * @param {String} note 
 * @param {Array<String>} scale 
 * @returns Number
 */
function indexOfNoteInScale(note, scale) {
	for (let i=0; i<scale.length; i++) {
		if (note == scale[i]) return i
	}
	return null
}

/**
 * Returns if or if not a note is in a scale
 * @param {String} note 
 * @param {Array<String>} scale 
 * @returns 
 */
function noteInScale(note, scale) {
	for (let [i, n] of scale.entries()) {
		if (n == note) return true
	}
	return false
}
/**
 * Constructs a scale
 * @example `constructScale("C", "major")`
 * @param {String} note 
 * @param {String} scale 
 * @returns {Array<String>} scale notes
 */
function constructScale(note, scale) {
	let ints = []
	let constructed = [note]
	if (scale == "major") ints = [2, 2, 1, 2, 2, 2, 1]
	else if (scale == "major pentatonic") ints = [2,2,3,2,3]
	else if (scale == "circle of fifths") ints = [7,7,7,7,7,7,7,7,7,7,7]
	else if (scale == "major chord") ints = [4, 3]
	else alert("dont know this scale yet")
	for (const i of ints) {
		const lastNote = constructed[constructed.length-1]
		const noteIdx = (indexOfNote(lastNote) + i) % 12
		constructed.push(notes[noteIdx])
	}
	return constructed
}

/**
 * Build the fretboard.
 * @param {Number} numFrets 
 * @returns {Array<Array<String>>} 2d array with note name
 */
function buildFretboard(numFrets=12) {
    // TODO: add more docs
	let fretboard = []
	for (let i=0; i<numFrets; i++) {
		let column = []
		for (let j=0; j<6; j++) {
			const note = notes[(indexOfNote(tuning[5-j]) + i) % 12]
			column.push(note)
		}
		fretboard.push(column)
	}
	return fretboard
}