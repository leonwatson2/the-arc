const C9Notes = [
  "C2", "Eb2", "G2", "Bb2", "C3", 
  "D3", "Eb3", "G3", "Bb3", "C4", 
  "D4", "Eb4", "G4", "Bb4", "C5", 
  "D5", "Eb5", "G5", "Bb5", "C6", 
  "Eb6", "G6", "Bb6", "C7", "Eb7",
  "G7", "Bb7", "C8", "Eb8", "G8"
]
const DMajorNotes = [
  "D3", "E3", "F#3", "G3", "A3", 
  "B3", "C#4", "D4", "E4", "F#4", 
  "G4", "A4", "B4", "C#5", "D5",
  "E5", "F#5", "G5", "A5", "B5", "C#6"
  ]
  const DMinorNotes = [
    "D3","E3","F3","G3","A3",
    "Bb3","C4","D4","E4","F4",
    "G4","A4","Bb4","C5","D5",
    "E5","F5","G5","A5","Bb5","C6"
  ]
  const jazzNotes = [
    "C2", "Eb2", "F2", "Gb2", "G2", "Bb2",
    "C3", "Eb3", "F3", "Gb3", "G3", "Bb3",
    "C4", "Eb4", "F4", "Gb4", "G4", "Bb4",
    "C5", "Eb5", "D5", ].reverse();
  const notesList = [
    C9Notes,
    DMajorNotes,
    DMinorNotes,
    jazzNotes
  ]
  let notesIndex = 0;
let notes = notesList[notesIndex];