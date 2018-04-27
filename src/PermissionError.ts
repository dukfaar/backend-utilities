export default class PermissionError {
    permission: string
    
    constructor(permission: string) {
        this.permission = permission
    }

    toString(): string {
        return `Permission '${this.permission}' is missing`
    }
} 