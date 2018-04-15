import { expect } from 'chai'

import reduceSelections from './reduceSelections'

describe("reduceSelections helper function", () => {
  it('reduces correctly', () => {
    let input = {
      selectionSet: {
        selections: [{kind: 'Field', name: { value: 'testField' }}]
      }
    }

    let result = reduceSelections(input)

    expect(result.testField).to.be.equal(1)
    expect(result.nonExistendField).to.be.undefined
  })
})
