
const basenotes = ["A", "B", "C", "D", "E", "F", "G"]
const basenoteidx = [0, 2, 3, 5, 7, 8, 10, 12]
const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
const intervals = ["R", "m2", "2", "m3", "3", "4", "d5", "5", "m6", "6", "m7", "7"]
const intervals_ = ["R", "m2", "M2", "m3", "M3", "P4", "d5", "P5", "m6", "M6", "m7", "M7"]

/**
 * Calculations with a note of the 12-tone-system
 */
class Note {
  /**
   * Returns distance between two notes in semitones
   * @param {string} a note
   * @param {string} b note
   * @returns {Number} distance
   * @example Note.dist("C", "C#") == 1
   */
  static dist(a, b) {
    return (Note.indexOfNote(b) - Note.indexOfNote(a) + 12) % 12
  }
  /**
   * Returns index of note, relative to A. Used for calculating distance between notes.
   * e.g. A -> 0, Ab -> -1, B -> 2, C -> 3
   * @param {string} note note
   * @returns {boolean} is sharp or flat
   */
  static indexOfNote(note) {
    let offset
    if (Note.isSharpOrFlat(note)) { offset = 0 }  // if not sharp or flat
    else if (Note.isFlat(note)) { offset = -1 }  // if flat, decrement index
    else if (Note.isSharp(note)) { offset = 1 }  // if sharp, increment index
    const idx = basenotes.indexOf(Note.baseNote(note))  // get index of base note
    return (basenoteidx[idx] + offset + 12) % 12  // calculate note distance from A to note by getting base note idx (distance in half-steps to a)
  }
  /**
   * Returns if note is sharp or flat
   * @param {string} note note
   */
  static isSharpOrFlat(note) {
    if (note.length > 2) {
      throw "Right now, only notes with one # or b are supported."
    }
    return note.length === 1
  }
  /**
   * Returns if note is flat
   * @param {string} note note
   * @returns {boolean} is flat
   */
  static isFlat(note) {
    if (note.length > 2) {
      throw "Right now, only notes with one # or b are supported."
    }
    return note.substring(1, 2) === "b"
  }
  /**
   * Returns if note is sharp
   * @param {string} note note
   * @returns {boolean} is sharp
   */
  static isSharp(note) {
    if (note.length > 2) {
      throw "Right now, only notes with one # or b are supported."
    }
    return note.substring(1, 2) === "#"
  }
  /**
   * Checks if Note `a` and `b` are equal
   * @param {String} a Note a
   * @param {String} b Note b
   * @returns {boolean}
   * @example Note.eq("Ab", "G#") == true
   */
  static eq(a, b) {
    if (a === null || b === null) return false
    return Note.indexOfNote(a) === Note.indexOfNote(b)
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
    return basenotes[(currentBaseNoteIdx + 1) % 7]
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

    if (!Scale.supportedScales.includes(scale)) {
      throw `Scale ${scale} not yet implemented`
    }
    const ints = {
      "major":          [2, 2, 1, 2, 2, 2, 1],
      "minor":          [2, 1, 2, 2, 1, 2, 2],
      "natural minor":  [2, 1, 2, 2, 1, 2, 2],
    }[scale]
    for (const interval of ints) {
      // we get next note and then sharp or flat the note. this ensures that every note only appears once in the scale
      const lastNote = constructed[constructed.length - 1]  // get last constructed note
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
  /** Returns if given note is in scale or not
   * @param {string} note Note to compare to scale
   * @returns {boolean} is in scale
   * @example new Scale("C", "major").has("D") == true
   */
  has(note) {
    return this.notes.some(scaleNote => Note.eq(scaleNote, note))
  }

  static supportedScales = ["major", "minor", "natural minor"]

  /**
   * Notes of circle of fifths with enharmonic equivalents
   */
  static CircleOfFifths = [["C"], ["G"], ["D"], ["A"], ["E"], ["Cb", "B"], ["Gb", "F#"], ["Db", "C#"], ["Ab"], ["Eb"], ["Bb"], ["F"]]

  /**
   * Notes of chromatic scale with enharmonic equivalents
   */
  static Chromatic = [["C"], ["Db", "C#"], ["D"], ["Eb", "D#"], ["E"], ["F"], ["Gb", "F#"], ["G"], ["Ab", "G#"], ["A"], ["Bb", "A#"], ["B"]]

  /**
   * Returns index of note in circle of fifths
   * @param {String} note Note of which to calculate the index
   * @returns {Number | null} index
   */
  static indexOfCircleOfFifths(note) {
    for (const [i, [a, _]] of Scale.CircleOfFifths.entries()) {
      if (Note.eq(note, a)) return i
    }
    return null
  }

  /**
   * Colormap of 12 different colors. End color warps into start color.
   */
  static Colormap = ["#DF315E", "#EB5D34", "#E28535", "#CB9C1B", "#FDC528", "#B4D34A", "#58BF63", "#0AB59F", "#00A5DD", "#4B7ABA", "#9059A1", "#B43498"]
}

/**
 * Fretboard control class. Makes handling of notes on fretboard easier.
 */
class FretboardCtrl {
  /**
   * 
   * @param {Number} numFrets number of frets (e.g. 12 for guitar)
   * @param {Array<String>} tuning tuning (e.g. `["E", "A", "D", "G", "B", "E"]` for guitar)
   */
  constructor(numFrets, tuning) {
    this.board = []
    this.numFrets = numFrets
    this.numStrings = tuning.length
    this.tuning = tuning

    for (let i = 0; i < this.numFrets; i++) {
      let column = []
      for (let j = this.numStrings; j > 0; j--) {
        const note = notes[(Note.indexOfNote(tuning[j - 1]) + i) % 12]
        column.push(note)
      }
      this.board.push(column)
    }
  }
  /**
   * Map fretboard notes. 
   * @param {(x: Number, y: Number, note: String) => ()} callback callback with fretboard position `fret`, `string` and note name `note`
   * @returns {Array}
   * @example const notes = board.map((x, y, note) => note)  // returns all notes
   */
  map(callback) {
    let results = []
    for (let x = 0; x < this.numFrets; x++) {
      for (let y = 0; y < this.numStrings; y++) {
        results.push(callback(x, y, this.board[x][y]))
      }
    }
    return results
  }
}

export { Note, Scale, FretboardCtrl }