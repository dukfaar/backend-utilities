import { expect } from 'chai'

import getProjection from './getProjection'

import {
  makeField, makeFragmentDefinition, makeFragmentSpread
} from './gqlTestHelpers'

describe("getProjection helper function", () => {
  it('projects correctly', () => {
    let input = {
      fieldNodes: [{
        selectionSet: {
          selections: [{
            kind: 'Field',
            name: { value: 'testField'}
          }]
        }
      }]
    }

    let input2 = {
      fieldNodes: [
        makeField('unnamed', [
          makeFragmentSpread('testFragment')
        ])
      ],
      fragments: {
        testFragment: makeFragmentDefinition('testFragment', [
          makeField('testField')]
        )
      }
    }

    let result = getProjection(input2)

    expect(result.testField).to.be.equal(1)
    expect(result.nonExistendField).to.be.undefined
  })
})
