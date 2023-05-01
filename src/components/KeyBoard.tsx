import { Box, SxProps } from "@mui/material"

const MAX_KEYBOARD_KEY_COUNT = 108 + 1
type KeyColor = "white" | "black"

type KeyBoardProps = {
  note: number | null
}

export const KeyBoard = ({ note }: KeyBoardProps) => {
  const isBlackKey = (index: number): boolean => {
    const blackKeyIndex = [1, 3, 6, 8, 10]
    if (blackKeyIndex.includes(index)) return true
    return false
  }
  return (
    <>
      <Box sx={{ display: "flex", maxWidth: "1280px", overflow: "scroll" }}>
        {Array.from({ length: 10 }).map((_, index) => {
          return <Octave key={`${index + 1}_octave`} index={index} note={note} />
        })}
      </Box>
    </>
  )
}

type OctaveProps = {
  index: number
  note: number | null
}

const Octave = ({ index, note }: OctaveProps) => {
  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Box sx={KeySxProps("white", note === index * 12 + 0)} />
      <Box
        sx={{
          ...KeySxProps("black", note === index * 12 + 1),
          left: "25px",
        }}
      />
      <Box sx={KeySxProps("white", note === index * 12 + 2)} />
      <Box
        sx={{
          ...KeySxProps("black", note === index * 12 + 3),
          left: "65px",
        }}
      />
      <Box sx={KeySxProps("white", note === index * 12 + 4)} />
      <Box sx={KeySxProps("white", note === index * 12 + 5)} />
      <Box
        sx={{
          ...KeySxProps("black", note === index * 12 + 6),
          left: "145px",
        }}
      />
      <Box sx={KeySxProps("white", note === index * 12 + 7)} />
      <Box
        sx={{
          ...KeySxProps("black", note === index * 12 + 8),
          left: "185px",
        }}
      />
      <Box sx={KeySxProps("white", note === index * 12 + 9)} />
      <Box
        sx={{
          ...KeySxProps("black", note === index * 12 + 10),
          left: "225px",
        }}
      />
      <Box sx={KeySxProps("white", note === index * 12 + 11)} />
    </Box>
  )
}

const KeySxProps = (color: KeyColor, isPressed?: boolean): SxProps => ({
  backgroundColor: isPressed ? "red" : color,
  border: color === "white" ? "1px solid rgba(0,0,0,0.5)" : "1px solid rgba(255,255,255,0.5)",
  boxSizing: "border-box",
  width: color === "white" ? "40px" : "30px",
  height: color === "white" ? "100px" : "60px",
  position: color === "white" ? "unset" : "absolute",
})
