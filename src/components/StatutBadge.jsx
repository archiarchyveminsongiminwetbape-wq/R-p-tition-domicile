import Badge from './Badge'
import { STATUT_INFO } from '../data/constants'

export default function StatutBadge({ statut }) {
  const info = STATUT_INFO[statut] ?? { label: statut, bg: "#F3F4F6", color: "#374151" }
  return <Badge text={info.label} bg={info.bg} color={info.color} />
}
