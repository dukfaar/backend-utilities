import { expect } from 'chai'

import getProjectionForPath from './getProjectionForPath'

import {
  makeField, makeFragmentDefinition, makeFragmentSpread
} from './gqlTestHelpers'

describe("getProjectionForPath helper function", () => {
  it('projects correctly', () => {
    let pathNode = [
      makeField('testField'),
      makeField('testField2')
    ]

    let testNode = [
      makeField('path', pathNode)
    ]

    let input = {
      fieldNodes: [
        makeField('input', [makeField('test', testNode)])
      ]
    }

    let result = getProjectionForPath(input, ['test', 'path'])

    expect(result.testField).to.be.equal(1)
    expect(result.testField2).to.be.equal(1)
    expect(result.nonExistendField).to.be.undefined
  })

  it('works with fragments', () => {
    let input = {
      fieldNodes: [
        makeField('unnamed',[makeFragmentSpread('edgesFragment')])
      ],
      fragments: {
        nodeFragment: makeFragmentDefinition('nodeFragment', [
          makeField('name')
        ]),
        nodeFragment2: makeFragmentDefinition('nodeFragment2', [
          makeField('date')
        ]),
        edgesFragment: makeFragmentDefinition('edgesFragment', [
          makeField('edges',[
            makeField('node', [
              makeField('_id'),
              makeFragmentSpread('nodeFragment'),
              makeFragmentSpread('nodeFragment2')
            ])
          ])
        ])
      }
    }

    let result = getProjectionForPath(input, ['edges', 'node'])

    expect(result._id).to.be.equal(1)
    expect(result.name).to.be.equal(1)
    expect(result.date).to.be.equal(1)
    expect(result.nonExistendField).to.be.undefined
  })
})
