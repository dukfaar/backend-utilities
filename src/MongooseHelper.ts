import { Model, Document, DocumentQuery } from 'mongoose'

import mongooseCreateType from './mongooseCreateType'
import mongooseUpdateType from './mongooseUpdateType'

import requireTypePermissions from './requireTypePermissions'
import getProjection from './getProjection'
import { Operation } from './Operation'

export default class MongooseHelper {
    private modelName: string
    private pubsubTypeName: string
    private createdSubscriptionName: string
    private updatedSubscriptionName: string
    private deletedSubscriptionName: string

    constructor(
        private model: Model<Document>, 
        private uniqueProperty: string,
        private pubsub
    ) {
        this.modelName = this.model.collection.name.toLowerCase()
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
        return mongooseUpdateType(this.model, { _id: params.id }, params.input)
        .then(result => {
            this.pubsub.publish(this.updatedSubscriptionName, result)
            return result
        })
    }

    delete(params) {
        return this.model.remove({ _id: params.id }).exec()
        .then(result => {
            this.pubsub.publish(this.deletedSubscriptionName, result)
            return result
        })
    }

    subscribeCreated(root, params, source, options) {
        let projection = getProjection(options)

        requireTypePermissions(
            source.userPermissions, 
            this.modelName, 
            projection, 
            Operation.READ
        )

        return this.pubsub.asyncIterator(this.createdSubscriptionName) 
    }

    subscribeUpdated(root, params, source, options) {
        let projection = getProjection(options)

        requireTypePermissions(
            source.userPermissions, 
            this.modelName, 
            projection, 
            Operation.READ
        )

        return this.pubsub.asyncIterator(this.updatedSubscriptionName) 
    }

    subscribeDeleted(root, params, source, options) {
        let projection = getProjection(options)

        requireTypePermissions(
            source.userPermissions, 
            this.modelName, 
            projection, 
            Operation.READ
        )
        
        return this.pubsub.asyncIterator(this.deletedSubscriptionName) 
    }
}