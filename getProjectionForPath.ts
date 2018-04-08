import * as _ from 'lodash'

import reduceSelections from './reduceSelections'

export default function getProjectionForPath (fieldASTs, path) {
  let selection = fieldASTs.fieldNodes[0]
  _.forEach(path, p => {
    selection = _.find(selection.selectionSet.selections, e => e.name.value === p)
  }) 
  
  return reduceSelections(selection)
}