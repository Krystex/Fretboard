
const tuning = ["E", "A", "D", "G", "B", "E"]
const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
const intervals = ["R", "m2", "2", "m3", "3", "4", "d5", "5", "m6", "6", "m7", "7"]
const intervals_ = ["R", "m2", "M2", "m3", "M3", "P4", "d5", "P5", "m6", "M6", "m7", "M7"]

function indexOfNote(note) {
	for (let [i, n] of notes.entries()) {
		if (n == note) return i
	}
}
function indexOfNoteInScale(note, scale) {
	for (let i=0; i<scale.length; i++) {
		if (note == scale[i]) return i
	}
	return null
}
function noteInScale(note, scale) {
	for (let [i, n] of scale.entries()) {
		if (n == note) return true
	}
	return false
}
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

function buildFretboard(numFrets=12) {
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