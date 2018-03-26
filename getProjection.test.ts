import { expect } from 'chai'

import getProjection from './getProjection'

describe("getProjection helper function", () => {
  it('projects correctly', () => {
    let input = {
      fieldNodes: [{
        selectionSet: {
          selections: [{name: { value: 'testField' }}]
        }
      }]
    }

    let result = getProjection(input)

    expect(result.testField).to.be.equal(1)
    expect(result.nonExistendField).to.be.undefined
  })
})
