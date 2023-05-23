import { useState, useEffect } from "react"
import { KeyBoard } from "./components/KeyBoard"
import { Box, Button, Container, Typography } from "@mui/material"
import axios from "axios"
// import { MidiEvent } from 'midi-parser-js';
import parseMidiFile from "midi-file-parser"

function App() {
  const [note, setNote] = useState<number | null>(null) // 현재 눌린 건반 정보

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [deviceInfo, setDeviceInfo] = useState<MIDIInput | null>(null)
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)

  const connectDevice = () => {
    console.log("connectDevice")
    const audioCtx = new AudioContext()

    // 오디오 컨텍스트 시작
    audioCtx.resume().then(function () {
      console.log("Audio context is now started")
    })

    // 상태 업데이트
    setAudioCtx(audioCtx)
    setIsConnected(true)
  }

  const disconnectDevice = () => {
    console.log("disconnectDevice")
    setDeviceInfo(null)
    setAudioCtx(null)
    setIsConnected(false)
  }

  const toggleConnectButton = () => {
    if (isConnected) return disconnectDevice()
    connectDevice()
  }

  async function checkMidiAccess({ audioCtx, gainNode }: { audioCtx: AudioContext; gainNode: GainNode }) {
    try {
      const midiAccess = await navigator.requestMIDIAccess()
      const inputs = midiAccess.inputs.values()

      for (const input of inputs) {
        setDeviceInfo(input)

        input.onmidimessage = (event: any) => {
          console.log("event", event)
          const cmd = event.data[0] >> 4
          const note = event.data[1]
          const velocity = event.data[2]

          if (cmd === 9 && velocity > 0) {
            setNote(note)

            const noteFrequency = 440 * Math.pow(2, (note - 69) / 12)

            const oscillator = audioCtx.createOscillator()
            oscillator.type = "square"
            oscillator.frequency.value = noteFrequency
            oscillator.connect(gainNode)

            oscillator.start()
            oscillator.stop(audioCtx.currentTime + 0.1)
          }
        }

        input.onstatechange = () => {
          console.log("input.onstatechange")
          if (!input.connection) return disconnectDevice()
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log("audioCtx", audioCtx)
    if (!audioCtx) return
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.2
    gainNode.connect(audioCtx.destination)

    const audioConfig = {
      audioCtx,
      gainNode,
    }

    checkMidiAccess(audioConfig)
  }, [audioCtx])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}MSX-05-01-cosmic_couquest.mid`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        console.log("arrayBuffer", arrayBuffer)
        navigator.requestMIDIAccess().then((midiAccess) => {
          const options = { currentTime: 0 }
          midiAccess.inputs.forEach((input: any) => {
            console.log("midi", input)
            input.send(arrayBuffer, 0, options)
          })
        })
      })
  }, [])

  const playMidi = async () => {
    const { data: midiData } = await axios.get<ArrayBuffer>(
      `${import.meta.env.BASE_URL}MSX-05-01-cosmic_couquest.mid`,
      {
        responseType: "arraybuffer",
      }
    )

    const audioContext = new AudioContext()
    const audioBuffer = await audioContext.decodeAudioData(midiData)

    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start()
  }

  return (
    <Container>
      <Typography variant="h3">MIDI Keyboard Example</Typography>

      <Box>
        <Typography variant="body1">
          {deviceInfo ? `Detected Device: ${deviceInfo.manufacturer} - ${deviceInfo.name}` : "No detected device"}
        </Typography>
        <Button onClick={toggleConnectButton}>{isConnected ? "Disconnect" : "Connect"}</Button>
      </Box>

      <p>Pressed Note: {note !== null ? note : "-"}</p>

      <br />
      <KeyBoard note={note} />

      <button
        onClick={() => {
          playMidi()
        }}
      >
        play audio by midi file
      </button>
    </Container>
  )
}

export default App
