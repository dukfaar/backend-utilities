import { Model, Document, DocumentQuery } from 'mongoose'
import * as _ from 'lodash'

import requireTypePermissions from './requireTypePermissions'
import { Operation } from './Operation'
import getProjectionForPath from './getProjectionForPath'

import RelayHelperFactory from './RelayHelperFactory'

export default class RelayHelper {
    constructor(
        private factory: RelayHelperFactory,
        private findFactory: () => DocumentQuery<Document[], Document>,
        private params,
        private source,
        private options
    ) {}

    public async getCount(): Promise<number> {
        let find = this.findFactory()
        this.applyBeforeAfter(find)
        return await find.count()
    }

    public async applyFirstLast(
        find: DocumentQuery<Document[], Document>
    ) {
        let {first, last} = this.params
     
        if(first || last) {
            let count: number = await this.getCount()
            let limit: number
            if(first) {
                limit = Math.min(first, count)
            }
        
            let skip: number
            if(last) {
                last = Math.min(last, count)
                skip = count - last
                limit = last
            }
        
            if(limit) find.limit(limit)
            if(skip) find.skip(skip)
        }
    }

    public checkRelayParameters() {
        let { before, after, first, last } = this.params
        if(after && before) throw "only one of before or after may be set"
        if(first && last) throw "only one of first or last may be set"
    }
    
    public applyBeforeAfter(find: DocumentQuery<Document[], Document>) {
        let { before, after } = this.params
        if(after) find.where('_id').gt(after)
        if(before) find.where('_id').lt(before)
    }

    public async toQueryResult(
        find: DocumentQuery<Document[], Document>, 
        projection
    ) {
        let result = await find.select(projection).lean().exec()
        let edges = _.map(result, p => ({
            node: p,
            cursor: p._id
        }))
    
        let pageInfo = {
            startCursor: _.head(edges).cursor,
            endCursor: _.last(edges).cursor,
            hasNextPage: undefined,
            hasPreviousPage: undefined
        }
    
        return {
            edges: edges,
            pageInfo: pageInfo
        }
    }

    public async addPageInfo(pageInfo) {
        let hasPreviousPagePromise = this.findFactory().where('_id').lt(pageInfo.startCursor).count()
        let hasNextPagePromise = this.findFactory().where('_id').gt(pageInfo.endCursor).count()
    
        let [hasNextPage, hasPreviousPage] = await Promise.all([
            hasNextPagePromise,
            hasPreviousPagePromise
        ])
    
        return _.merge({}, pageInfo, {hasNextPage, hasPreviousPage})
    }
    
    public async performRelayQuery() {
        this.checkRelayParameters()
    
        let projection = getProjectionForPath(this.options, ['edges', 'node'])
        requireTypePermissions(this.source.userPermissions, this.factory.getTypePermissionName(), projection, Operation.READ)
    
        let find = this.findFactory()
    
        this.applyBeforeAfter(find)
        await this.applyFirstLast(find)
    
        find.sort('_id')
    
        let result = await this.toQueryResult(find, projection)
    
        result.pageInfo = await this.addPageInfo(result.pageInfo)
    
        return result
    }
}
