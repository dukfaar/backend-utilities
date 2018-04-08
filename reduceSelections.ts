export default function reduceSelections (selection) {
    return selection.selectionSet.selections.reduce((projections, selection) => {
        projections[selection.name.value] = 1

        return projections
  }, {})
}