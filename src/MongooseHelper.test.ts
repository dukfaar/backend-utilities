import { expect } from 'chai'
import { stub, assert } from 'sinon'
import * as _ from 'lodash'

import MongooseHelper from './MongooseHelper'

class TestModel {
    static testData = {}
    static idCounter: number = 0

    static reInitTestData() {
        TestModel.idCounter = 9000
        TestModel.testData = {}

        new TestModel({ name: 'existingEntry' }).save()

        TestModel.idCounter = 0
    }

    static collection = {
        name: 'testModels'
    }

    static modelName = 'testModel' 

    static findOne(p) {
        let execFunction = () => {
            return Promise.resolve(_.find(TestModel.testData, i => {
                if(p._id) return i._id == p._id
                else return i.name == p.name
            }))
        }

        return {
            lean: () => ({
                exec: execFunction
            }),
            exec: execFunction
        }
    }

    static remove(p) {
        let execFunction = () => {
            let i = _.find(TestModel.testData, i => {
                return i._id == p._id
            })

            if (i) {
                delete TestModel.testData[i._id]
            }
            return Promise.resolve(i)
        }

        return {
            lean: () => ({
                exec: execFunction
            }),
            exec: execFunction
        }
    }

    _id

    constructor(input) {
        _.extend(this, input)
        this._id = TestModel.idCounter++
    }

    save() {
        TestModel.testData[this._id] = this
        return Promise.resolve(this)
    }
}

import {
    makeField, makeFragmentDefinition, makeFragmentSpread
} from './gqlTestHelpers'

describe('MongooseHelper', () => {
    let testPubsub
    let helper

    beforeEach(() => {
        TestModel.reInitTestData()

        testPubsub = {
            publish: stub(),
            asyncIterator: stub()
        }

        helper = new MongooseHelper(TestModel as any, 'name', testPubsub)
    })

    it('creates a new instance', (done) => {
        helper.create({ name: 'test', p2: 'p2' })
            .then(i => {
                expect(i.name).to.be.equal('test')
                expect(i.p2).to.be.equal('p2')
                done()
            })
    })

    it('doesnt create a new instance if one with the same data already exists', (done) => {
        helper.create({ name: 'test', p2: 'p2' })
            .then(i => {
                expect(i.name).to.be.equal('test')
                expect(i.p2).to.be.equal('p2')
            })
            .then(() => helper.create({ name: 'test', p2: 'p2' }))
            .catch(() => {
                done()
            })
    })

    it('updates an instance', (done) => {
        helper.update({ id: 9000, input: { name: 'existingEntry', p2: 'p9' }})
            .then(i => {
                expect(i.name).to.be.equal('existingEntry')
                expect(i.p2).to.be.equal('p9')
                done()
            })
    })

    it('deletes an instance', (done) => {
        helper.delete({ id: 9000 })
            .then(i => {
                expect(i.name).to.be.equal('existingEntry')
                done()
            })
    })

    it('sends notification on creation', (done) => {
        helper.create({ name: 'test', p2: 'p2' })
            .then(i => {
                assert.calledWith(testPubsub.publish, 'testmodel created', { _id: 0, name: "test", p2: "p2" })
                done()
            })
    })

    it('sends notification on update', (done) => {
        helper.update({ id: 9000, input: { name: 'existingEntry', p2: 'p2' }})
            .then(i => {
                assert.calledWith(testPubsub.publish, 'testmodel updated', { _id: 9000, name: "existingEntry", p2: "p2" })
                done()
            })
    })

    it('sends notification on delete', (done) => {
        helper.delete({ id: 9000 })
            .then(i => {
                assert.calledWith(testPubsub.publish, 'testmodel deleted', { _id: 9000, name: "existingEntry" })
                done()
            })
    })

    it('throws an exception on missing permissions to subscribecreate', () => {
        expect(() => helper.subscribeCreated()).to.throw()
    })

    it('throws an exception on missing permissions to subscribeupdate', () => {
        expect(() => helper.subscribeUpdated()).to.throw()
    })

    it('throws an exception on missing permissions to subscribedelete', () => {
        expect(() => helper.subscribeDeleted()).to.throw()
    })

    it('doesnt throw an exception with permissions to subscribecreate', () => {
        let input = {
            fieldNodes: [
                makeField('input', [
                    makeField('test'),
                    makeField('test2')
                ])
            ]
        }

        let source = {
            userPermissions: ['testmodel', 'testmodel.test.read', 'testmodel.test2.read']
        }

        expect(() => helper.subscribeCreated(null, null, source, input)).to.not.throw()
    })

    it('doesnt throw an exception with permissions to subscribeUpdated', () => {
        let input = {
            fieldNodes: [
                makeField('input', [
                    makeField('test'),
                    makeField('test2')
                ])
            ]
        }

        let source = {
            userPermissions: ['testmodel', 'testmodel.test.read', 'testmodel.test2.read']
        }

        expect(() => helper.subscribeUpdated(null, null, source, input)).to.not.throw()
    })

    it('doesnt throw an exception with permissions to subscribedeleted', () => {
        let input = {
            fieldNodes: [
                makeField('input', [
                    makeField('test'),
                    makeField('test2')
                ])
            ]
        }

        let source = {
            userPermissions: ['testmodel', 'testmodel.test.read', 'testmodel.test2.read']
        }

        expect(() => helper.subscribeDeleted(null, null, source, input)).to.not.throw()
    })
})