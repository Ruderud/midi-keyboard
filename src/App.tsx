import { useState, useEffect } from "react"
import { KeyBoard } from "./components/KeyBoard"
import { Box, Button, Container, Typography } from "@mui/material"

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

  useEffect(() => {
    console.log("audioCtx", audioCtx)
    if (!audioCtx) return
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.2
    gainNode.connect(audioCtx.destination)

    // MIDI 연결 확인
    navigator.requestMIDIAccess().then((midiAccess) => {
      // MIDI 입력장치 찾기
      const inputs = midiAccess.inputs.values()
      for (const input of inputs) {
        // MIDI 입력장치로부터 데이터 수신
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
          setDeviceInfo(input.value)
        }
        input.onmidimessage = (event: any) => {
          console.log("event", event)
          // 건반 정보 추출
          const cmd = event.data[0] >> 4
          // const channel = event.data[0] & 0xf
          const note = event.data[1]
          const velocity = event.data[2]

          // 건반이 눌렸을 때
          if (cmd === 9 && velocity > 0) {
            setNote(note)

            const noteFrequency = 440 * Math.pow(2, (note - 69) / 12)

            // 사각파 오실레이터 생성
            const oscillator = audioCtx.createOscillator()
            oscillator.type = "square"
            oscillator.frequency.value = noteFrequency
            oscillator.connect(gainNode)

            // 사각파 오실레이터 시작 및 정지
            oscillator.start()
            oscillator.stop(audioCtx.currentTime + 0.1)
          }
        }
        input.onstatechange = () => {
          console.log("input.onstatechange")
          if (!input.connection) return disconnectDevice()
        }
      }
    })
  }, [audioCtx])

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
    </Container>
  )
}

export default App
