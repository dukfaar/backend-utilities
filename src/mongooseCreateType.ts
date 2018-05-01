import * as _ from 'lodash'

export default function createType(type, findBy, params): Promise<any> {
    return type.findOne(findBy).lean().exec()
    .then(instance => {
        return instance 
        ?Promise.reject("Can not create new instance")
        :_.extend(new type(), params).save()  
    })
}
