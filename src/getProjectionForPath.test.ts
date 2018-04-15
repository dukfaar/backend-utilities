import { expect } from 'chai'

import getProjectionForPath from './getProjectionForPath'

describe("getProjectionForPath helper function", () => {
  it('projects correctly', () => {
    let pathNode = {
      selections: [
        {
          kind: 'Field',
          name: { value: 'testField' },
        },
        {
          kind: 'Field',
          name: { value: 'testField2' }
        }
      ]
    }

    let testNode = {
        selections: [
        {
          name: { value: 'path' },
          selectionSet: pathNode
        }
      ]
    }

    let input = {
      fieldNodes: [{
        selectionSet: {
          selections: [
            {
              name: { value: 'test' },
              selectionSet: testNode
            }
          ]
        }
      }]
    }

    let result = getProjectionForPath(input, ['test', 'path'])

    expect(result.testField).to.be.equal(1)
    expect(result.testField2).to.be.equal(1)
    expect(result.nonExistendField).to.be.undefined
  })
})
