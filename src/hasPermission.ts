import * as _ from 'lodash'

export default function hasPermission(permissions: string[], permission: string) {
    return _.find(permissions, p => p === permission)
}