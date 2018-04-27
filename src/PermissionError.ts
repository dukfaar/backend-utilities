export default class PermissionError {
    message: string
    
    constructor(permission: string) {
        this.message = `Permission '${permission}' is missing`
    }
} 