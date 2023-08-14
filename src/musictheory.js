
const tuning = ["E", "A", "D", "G", "B", "E"]
const basenotes = ["A", "B", "C", "D", "E", "F", "G"]
const basenoteidx = [0, 2, 3, 5, 7, 8, 10, 12]
const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
const intervals = ["R", "m2", "2", "m3", "3", "4", "d5", "5", "m6", "6", "m7", "7"]
const intervals_ = ["R", "m2", "M2", "m3", "M3", "P4", "d5", "P5", "m6", "M6", "m7", "M7"]

class Note {
	/**
	 * Returns distance between two notes in semitones
	 * @param {string} a note
	 * @param {string} b note
	 */
	static dist(a, b) {
		return (Note.indexOfNote(b) - Note.indexOfNote(a) + 12) % 12
	}
	/**
	 * Returns index of note, relative to A. Used for calculating distance between notes.
	 * e.g. A -> 0, Ab -> -1, B -> 2, C -> 3
	 * @param {string} note 
	 */
	static indexOfNote(note) {
		let offset
		if (note.length == 1) { offset = 0 }  // if not sharp or flat
		if (note.substring(1, 2) == "b") {offset = -1}  // if flat, decrement index
		else if (note.substring(1, 2) == "#") {offset = 1}  // if sharp, increment index
		const idx = basenotes.indexOf(Note.baseNote(note))  // get index of base note
		return basenoteidx[idx] + offset  // calculate note distance from A to note by getting base note idx (distance in half-steps to a)
	}
	/**
	 * Removes flat or sharp from note.
	 * e.g. C# -> C, Db -> D
	 * @param {string} note 
	 * @returns {string} note
	 */
	static baseNote(note) {
		return note.substring(0, 1)
	}
	static nextBaseNote(note) {
		const currentBaseNoteIdx = basenotes.indexOf(Note.baseNote(note))
		return basenotes[(currentBaseNoteIdx+1) % 7]
	}
	/**
	 * Add interval to note.
	 * e.g. "C" + "3"
	 * @param {String} note note
	 * @param {String} int interval
	 * @returns {String} note
	 */
	static addInt(note, int) {
		if (!intervals.includes(int)) {
			throw `Doesn't support interval ${int}. Possible values: ${intervals}`
		}
		let hs = intervals.indexOf(int)  // half steps of interval
		let newnoteidx = Note.indexOfNote(note) + hs  // add half steps to interval
		// TODO: make compatible with enharmonic equivalents
		return notes[(newnoteidx + 12) % 12]
	}
}

/**
 * Holds a musical scale.
 * The notes of the scale can be accessed by `new Scale("C", "major").notes`
 */
class Scale {
	/**
	 * Builds a hexatonic scale. Only supports scale with whole- and halfsteps
	 * @param {String} key note of key (e.g. "C" or "Ab")
	 * @param {String} scale scale name (e.g. "major")
	 * @returns {Array<string>}
	 */
	constructor(key, scale) {
		this.key = key
		this.scale = scale
		let constructed = [key]  // scale starts with key note
		let ints = undefined  // intervals
		if (scale == "major") { ints = [2, 2, 1, 2, 2, 2, 1] }
		else if (scale == "minor" || scale == "natural minor") { ints = [2, 1, 2, 2, 1, 2, 2] }
		else { console.error(`Scale ${scale} not yet implemented`); return }
		for (const interval of ints) {
			// we get next note and then sharp or flat the note. this ensures that every note only appears once in the scale
			const lastNote = constructed[constructed.length-1]  // get last constructed note
			let nextNote = Note.nextBaseNote(lastNote)  // calculate next base note (A -> B, B -> C)
			const noteDistance = Note.dist(lastNote, nextNote)  // calculate note distance between both. 
			if (noteDistance < interval) {  // now flat or sharp note, depending how many semi-tones are between both notes
				nextNote += "#"
			} else if (noteDistance > interval) {
				nextNote += "b"
			}
			constructed.push(nextNote)  // add to constructed scale
		}
		this.notes = constructed
	}
	/**
	 * Circle of fifths with enharmonic equivalents
	 */
	static CircleOfFifths = [["C"], ["G"], ["D"], ["A"], ["E"], ["B", "Cb"], ["F#", "Gb"], ["C#", "Db"], ["Ab"], ["Eb"], ["Bb"], ["F"]]
}

/**
 * Returns the absolute index of a note (A=0)
 * @param {String} note 
 * @returns 
 */
function indexOfNote(note) {
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