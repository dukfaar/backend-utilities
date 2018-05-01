import * as _ from 'lodash'

import reduceSelections from './reduceSelections'

import flattenSelections from './flattenProjectionSelection'

export default function getProjectionForPath (fieldASTs, path) {
  let selection = fieldASTs.fieldNodes[0]
  _.forEach(path, p => {

    let selections:any[] = flattenSelections(fieldASTs, selection.selectionSet.selections)
    selection = _.find(selections, e => e.name.value === p)
  }) 
  
  return reduceSelections(selection, fieldASTs)
}