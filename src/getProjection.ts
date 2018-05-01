import getProjectionForPath from './getProjectionForPath'

export default function getProjection (fieldASTs) {
  return getProjectionForPath(fieldASTs, [])
}