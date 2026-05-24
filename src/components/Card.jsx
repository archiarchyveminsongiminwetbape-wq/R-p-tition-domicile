export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      ...style,
    }}>
      {children}
    </div>
  )
}
