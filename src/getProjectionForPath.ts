import * as _ from 'lodash'

import reduceSelections from './reduceSelections'

const selectionFlattener = (fieldASTs) => (selection) => {
  switch(selection.kind) {
    case 'FragmentSpread':
      return fieldASTs.fragments[selection.name.value].selectionSet.selections
    case 'Field':
      return [selection]
    default:
      throw "Unsupported Kind"
  }
}

const flattenSelections = (fieldASTs, selections) => _.flatMap(selections, selectionFlattener(fieldASTs))

export default function getProjectionForPath (fieldASTs, path) {
  let selection = fieldASTs.fieldNodes[0]
  _.forEach(path, p => {

    let selections:any[] = flattenSelections(fieldASTs, selection.selectionSet.selections)
    selection = _.find(selections, e => e.name.value === p)
  }) 
  
  return reduceSelections(selection, fieldASTs)
}