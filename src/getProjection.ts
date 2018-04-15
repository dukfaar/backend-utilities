import reduceSelections from './reduceSelections'

export default function getProjection (fieldASTs) {
  return reduceSelections(fieldASTs.fieldNodes[0])
}