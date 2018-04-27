import hasPermission from './hasPermission'
import PermissionError from './PermissionError'

export default function requirePermission(permissions: string[], permission: string) {
    if(!hasPermission(permissions, permission)) 
        throw new PermissionError(permission)
}