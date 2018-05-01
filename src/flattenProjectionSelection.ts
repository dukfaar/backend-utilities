import * as _ from 'lodash'

const selectionFlattener = (fieldASTs) => (selection) => {
    switch(selection.kind) {
        case 'FragmentSpread':
            return fieldASTs.fragments[selection.name.value].selectionSet.selections
        case 'Field':
            return [selection]
        default:
            throw "Unsupported Kind: " + selection.kind
    }
}
  
export default (fieldASTs, selections) => _.flatMap(selections, selectionFlattener(fieldASTs))
  