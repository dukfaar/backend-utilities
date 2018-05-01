export default function reduceSelections (selection, fieldASTs:any={}) {
    return selection.selectionSet.selections.reduce((projections, selection) => {
        switch(selection.kind) {
            case 'Field': 
                return { ...projections, [selection.name.value]: 1}
            case 'InlineFragment':
                return { ...projections, ...reduceSelections(selection, fieldASTs)}
            case 'FragmentSpread':
                return { ...projections, ...reduceSelections(fieldASTs.fragments[selection.name.value], fieldASTs)}
            default:
                throw `Unsupported query kind type: ${selection.kind}`
          }
  }, {})
}