import { Model, Document, DocumentQuery } from 'mongoose'

import mongooseCreateType from './mongooseCreateType'
import mongooseUpdateType from './mongooseUpdateType'

export default class MongooseHelper {
    private pubsubTypeName: string
    private createdSubscriptionName: string
    private updatedSubscriptionName: string
    private deletedSubscriptionName: string

    constructor(
        private model: Model<Document>, 
        private uniqueProperty: string,
        private pubsub
    ) {
        this.pubsubTypeName = this.model.collection.name.toLowerCase()
        this.createdSubscriptionName = `${this.pubsubTypeName} created`
        this.updatedSubscriptionName = `${this.pubsubTypeName} updated`
        this.deletedSubscriptionName = `${this.pubsubTypeName} deleted`
    }

    create(params) {
        return mongooseCreateType(
            this.model, 
            {
                [this.uniqueProperty]: params[this.uniqueProperty]
            }, 
            params)
        .then(result => {
            this.pubsub.publish(this.createdSubscriptionName, result)
            return result
        })
    }

    update(params) {
        return mongooseUpdateType(
            this.model, 
            {
                [this.uniqueProperty]: params[this.uniqueProperty]
            }, 
            params)
        .then(result => {
            this.pubsub.publish(this.updatedSubscriptionName, result)
            return result
        })
    }

    delete(params) {
        return this.model.remove({
            [this.uniqueProperty]: params[this.uniqueProperty]
        }).exec()
        .then(result => {
            this.pubsub.publish(this.deletedSubscriptionName, result)
            return result
        })
    }

    subscribeCreated() {
        return this.pubsub.asyncIterator(this.createdSubscriptionName) 
    }

    subscribeUpdated() {
        return this.pubsub.asyncIterator(this.updatedSubscriptionName) 
    }

    subscribeDeleted() {
        return this.pubsub.asyncIterator(this.deletedSubscriptionName) 
    }
}