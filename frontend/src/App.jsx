import React, { useEffect } from "react"
import { io } from "socket.io-client"

const socket = io("/", {
  transports: ["websocket"], // force WebSocket, avoid polling fallback
})


const notes = ["c6", "d6", "e6", "f6", "g6", "a6", "b6"]

const effects = {
  ascend: ["c6", "d6", "e6", "g6", "a6"],
  descend: ["a6", "g6", "f6", "d6", "c6"],
  pingpong: ["c6", "g6", "e6", "a6", "f6", "d6"],
  chime: ["c6", "e6", "g6", "c6", "g6", "e6", "c6"],
  tension: ["e6", "f6", "g6", "a6", "g6", "c6"],
}

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id)
    })

    socket.on("playSound", (data) => {
      console.log("PlaySound event:", data)
      // payload is like "A6", convert to lowercase for filename
      const note = data.message.toLowerCase()
      playNote(note)
    })

    return () => {
      socket.off("connect")
      socket.off("playSound")
    }
  }, [])

  const playNote = (note) => {
    const audio = new Audio(`/${note}.mp3`) // files are in public/
    audio.currentTime = 0
    audio.play()
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const playEffect = async (name) => {
    const sequence = effects[name]
    for (let i = 0; i < sequence.length; i++) {
      playNote(sequence[i])
      await wait(600)
    }
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "40px",
        background: "#0f1724",
        color: "#e6eef8",
        minHeight: "100vh",
      }}
    >
      <h1>Play Notes & Sound Effects</h1>

      {/* Note Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginBottom: "20px" }}>
        {notes.map((note) => (
          <button
            key={note}
            onClick={() => playNote(note)}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#ff7a59",
              color: "#fff",
            }}
          >
            {note.toUpperCase()}
          </button>
        ))}
      </div>

      <h2>Sound Effects</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
        <button onClick={() => playEffect("ascend")}>▶ Ascending Scale</button>
        <button onClick={() => playEffect("descend")}>▶ Descending Scale</button>
        <button onClick={() => playEffect("pingpong")}>▶ Ping-Pong</button>
        <button onClick={() => playEffect("chime")}>▶ Triad Chime</button>
        <button onClick={() => playEffect("tension")}>▶ Tension → Resolution</button>
      </div>
    </div>
  )
}

export default App
