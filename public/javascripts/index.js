const filterObjFalse = (obj) => {
    Object.getOwnPropertyNames(obj).forEach(key => {
        if(obj[key]){
            // console.log(key,obj[key])
        }else{
            delete obj[key]
        }
    })
    return obj
}

export {filterObjFalse}