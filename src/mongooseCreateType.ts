import * as _ from 'lodash'
import * as Promise from 'bluebird'

export default function createType(type, findBy, params): Promise {
    return type.findOne(findBy).lean().exec()
    .then(instance => {
        return instance 
        ?Promise.reject("Can not create new instance")
        :_.extend(new type(), params).save()  
    })
}
