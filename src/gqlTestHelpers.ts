export const makeGQLNode = (kind: string, name: string, selections: any[] = undefined) => {
    let result: any = { kind: kind, name: { value: name } }
    if (selections) result.selectionSet = { selections: selections }
    return result
}

export const makeField = (name: string, selections: any[] = undefined) => makeGQLNode('Field', name, selections)
export const makeFragmentSpread = (name: string, selections: any[] = undefined) => makeGQLNode('FragmentSpread', name, selections)
export const makeFragmentDefinition = (name: string, selections: any[] = undefined) => makeGQLNode('FragmentDefinition', name, selections)
