export default function Badge({ text, bg = "#EFF6FF", color = "#1A56DB" }) {
  return (
    <span style={{
      background: bg, color,
      padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      display: "inline-block",
    }}>
      {text}
    </span>
  )
}
