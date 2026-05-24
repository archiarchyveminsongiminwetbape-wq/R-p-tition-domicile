export default function Stars({ n, size = 14 }) {
  const full  = Math.round(n)
  const empty = 5 - full
  return (
    <span style={{ color: "#F59E0B", fontSize: size, letterSpacing: 1 }}>
      {"★".repeat(full)}{"☆".repeat(empty)}
    </span>
  )
}
