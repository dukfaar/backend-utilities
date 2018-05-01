import { Model, Document, DocumentQuery } from 'mongoose'

import RelayHelper from './RelayHelper'

export default class RelayHelperFactory {
    constructor(
        private type: Model<Document>,
        private typePermissionName: string
    ) {}

    public getType() { return this.type }
    public getTypePermissionName() { return this.typePermissionName }

    public createHelper({
        findFactory = () => this.type.find(),
        params, 
        source,
        options
    }: {
        findFactory?: () => DocumentQuery<Document[], Document>,
        params: any,
        source: any,
        options: any
    }) {
        return new RelayHelper(this, findFactory, params, source, options)
    }
}