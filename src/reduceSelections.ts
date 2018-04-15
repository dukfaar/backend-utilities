export default function reduceSelections (selection) {
    return selection.selectionSet.selections.reduce((projections, selection) => {
        switch(selection.kind) {
            case 'Field': 
                return { ...projections, [selection.name.value]: 1}
            case 'InlineFragment':
                return { ...projections, ...reduceSelections(selection)}
            default:
                throw `Unsupported query kind type: ${selection.kind}`
          }
  }, {})
}