import { Box, SxProps } from "@mui/material"
import { useContext, useEffect } from "react"
import { AppContext } from "../store/context"

type KeyBoardProps = {
  note: number | null
}

export const KeyBoard = ({ note }: KeyBoardProps) => {
  const OCTAVE_COUNT = 5
  const { appState } = useContext(AppContext)

  useEffect(() => {
    console.log("appState.key", appState.pressedKey)
  }, [appState.pressedKey])
  return (
    <>
      <Box sx={{ display: "flex", maxWidth: "1280px", overflowX: "scroll", scrollSnapType: "x mandatory" }}>
        {Array.from({ length: OCTAVE_COUNT }).map((_, index) => {
          return <Octave key={`${index + 1}_octave`} note={note} />
        })}
      </Box>
    </>
  )
}

type KeyColor = "white" | "black"

type OctaveProps = {
  note: number | null
}

enum Scales {
  C = 0,
  C_SHARP = 1,
  D = 2,
  D_SHARP = 3,
  E = 4,
  F = 5,
  F_SHARP = 6,
  G = 7,
  G_SHARP = 8,
  A = 9,
  A_SHARP = 10,
  B = 11,
}

const Octave = ({ note }: OctaveProps) => {
  const scales = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

  return (
    <Box sx={{ display: "flex", position: "relative", scrollSnapAlign: "start" }}>
      {scales.map((scale, index) => {
        const color: KeyColor = scale.includes("#") ? "black" : "white"
        const left = color === "black" ? calcDistanceFromLeft(index) : "unset"
        return (
          <Box key={index} sx={{ ...KeySxProps(color, note === index * 12), left }}>
            {scale}
          </Box>
        )
      })}
    </Box>
  )
}

const calcDistanceFromLeft = (scaleIndex: number) => {
  if (scaleIndex < Scales.E) return String(scaleIndex * 20 + 5) + "px"
  return String(scaleIndex * 20 + 25) + "px"
}

const KeySxProps = (keyColor: KeyColor, isPressed?: boolean): SxProps => ({
  backgroundColor: isPressed ? "red" : keyColor,
  border: keyColor === "white" ? "1px solid rgba(0,0,0,0.5)" : "1px solid rgba(255,255,255,0.5)",
  boxSizing: "border-box",
  width: keyColor === "white" ? "40px" : "30px",
  height: keyColor === "white" ? "100px" : "60px",
  position: keyColor === "white" ? "unset" : "absolute",
  color: keyColor === "black" ? "white" : "black",

  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  userSelect: "none",
  "&:active": {
    backgroundColor: "red",
  },
})
