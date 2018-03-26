import * as _ from 'lodash'

export default function updateType(type, findBy, params): Promise {
    return type.findOne(findBy).exec()
    .then(instance => {
        return instance
        ?_.extend(instance, params).save()   
        :Promise.reject("Can not find instance")                 
    })
}
