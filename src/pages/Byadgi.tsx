import { VarietyPage } from '../components/VarietyPage'
import { getVariety } from '../data/varieties'

// Thin wrapper: the layout lives in VarietyPage, the differences are all data.
const variety = getVariety('byadgi')!

export default function ByadgiPage() {
  return <VarietyPage variety={variety} />
}
