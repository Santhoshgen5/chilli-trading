import { VarietyPage } from '../components/VarietyPage'
import { getVariety } from '../data/varieties'

// Thin wrapper: the layout lives in VarietyPage, the differences are all data.
const variety = getVariety('teja')!

export default function TejaPage() {
  return <VarietyPage variety={variety} />
}
