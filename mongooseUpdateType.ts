import * as _ from 'lodash'

function updateType(type, findBy, params): Promise {
    return type.findOne(findBy).exec()
    .then(instance => {
        return instance
        ?_.extend(instance, params).save()   
        :Promise.reject("Can not find instance")                 
    })
}
