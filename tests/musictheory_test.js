import { suite, test, assert } from '@pmoo/testy'
import { Note, Scale } from "../src/musictheory.js"

suite('notes', () => {
  test('note distance', () => {
    assert.isTrue(Note.dist("C", "C") == 0)
    assert.isTrue(Note.dist("C", "C#") == 1)
    assert.isTrue(Note.dist("C", "D") == 2)
    assert.isTrue(Note.dist("C", "B") == 11)
  })

  test("enharmonic of note", () => {
    assert.that(Note.enharmonic("C")).isEqualTo("C")
    assert.that(Note.enharmonic("C#")).isEqualTo("Db")
    assert.that(Note.enharmonic("Db")).isEqualTo("C#")
    assert.that(Note.enharmonic("D#")).isEqualTo("Eb")
    assert.that(Note.enharmonic("Eb")).isEqualTo("D#")
  })

  test("add semitones to scale", () => {
    assert.that(Note.addSemitonesScale("C", 2)).isEqualTo("D")
    assert.that(Note.addSemitonesScale("C", 1)).isEqualTo("Db")
    assert.that(Note.addSemitonesScale("C#", 1)).isEqualTo("D")
    assert.that(Note.addSemitonesScale("D", 1)).isEqualTo("Eb")
    // assert.that(Note.addSemitonesScale("Db", 2)).isEqualTo("E")
  })
})

suite("scale", () => {
  test("scale construction", () => {
    let scale = new Scale("C", "major")
    assert.that(scale.notes).isEqualTo(["C", "D", "E", "F", "G", "A", "B", "C"])
    assert.that([scale.numFlats, scale.numSharps]).isEqualTo([0, 0])
    assert.that(scale.whichAccidental() == "")

    scale = new Scale("D", "major")
    assert.that(scale.notes).isEqualTo(["D", "E", "F#", "G", "A", "B", "C#", "D"])
    assert.that([scale.numFlats, scale.numSharps]).isEqualTo([0, 2])
    assert.that(scale.whichAccidental() == "#")

    scale = new Scale("Db", "major")
    assert.that(scale.notes).isEqualTo(["Db", "Eb", "F", "Gb", "Ab", "Bb", "C", "Db"])
    assert.that([scale.numFlats, scale.numSharps]).isEqualTo([5, 0])
    assert.that(scale.whichAccidental() == "b")

    scale = new Scale("E", "minor pentatonic")
    assert.that(scale.notes).isEqualTo(["E", "G", "A", "B", "D", "E"])
    assert.that([scale.numFlats, scale.numSharps]).isEqualTo([0, 0])
    assert.that(scale.whichAccidental() == "")
  })
})