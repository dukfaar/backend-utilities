import requirePermission from './requirePermission'
import { Operation } from './Operation'

export default function checkTypePermissions(permissions: string[], typename: string, subfields: string[], operation: Operation) {
    requirePermission(permissions, typename)

    for(const field in subfields) {
        requirePermission(permissions, `${typename}.${field}.${operation}`)
    }
}