import { expect } from 'chai'
import { stub, assert } from 'sinon'
import * as _ from 'lodash'

import MongooseHelper from './MongooseHelper'

class TestModel {
    static testData

    static collection = {
        name: 'testModel'
    }

    static findOne(p) {
        return {
            lean: () => ({ 
                exec: () => Promise.resolve(_.find(TestModel.testData, p))
            })
        }
    }

    save() {
        return Promise.resolve(this)
    }
}

describe('MongooseHelper', () => {
    let testPubsub
    let helper

    beforeEach(() => {
        testPubsub = {
            publish: stub()
        }

        helper = new MongooseHelper(TestModel as any, 'name', testPubsub)
    })

    it('creates a new instance', (done) => {
        helper.create({name: 'test', p2: 'p2'})
        .then(i => {
            expect(i.name).to.be.equal('test')
            expect(i.p2).to.be.equal('p2')
            done()
        })
    })

    it('sends notification on creation', (done) => {
        helper.create({name: 'test', p2: 'p2'})
        .then(i => {
            assert.calledWith(testPubsub.publish, 'testmodel created', {name: "test", p2: "p2"})
            done()
        })
    })
})