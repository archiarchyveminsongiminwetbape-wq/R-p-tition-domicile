export default function Avatar({ initials, size = 44, color = "#1A56DB" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.36,
      fontFamily: "'Playfair Display', serif", letterSpacing: 1,
      userSelect: "none",
    }}>
      {initials}
    </div>
  )
}
