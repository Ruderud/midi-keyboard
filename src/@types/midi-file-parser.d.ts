declare module "midi-file-parser" {
  interface MidiHeader {
    formatType: 0 | 1 | 2
    trackCount: number
    ticksPerBeat: number
  }

  interface MidiTrackEvent {
    deltaTime: number
    type: number
    channel: number
    data: number[]
  }

  interface MidiTrack {
    events: MidiTrackEvent[]
  }

  interface MidiFile {
    header: MidiHeader
    tracks: MidiTrack[]
  }

  function parseMidiFile(arrayBuffer: ArrayBuffer): MidiFile

  export = parseMidiFile
}
