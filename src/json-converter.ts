export function getValueGivenString(jsonObj: any, propertyString: string){
    const properties = propertyString.split('.')
    let curObj = jsonObj
    for(let field of properties){
        curObj = curObj[field]
    }
    return curObj
}

export function setValueGivenString(jsonObj: any, propertyString: string, value: any){
    const properties = propertyString.split('.')
    let curObj = jsonObj
    let i = 0
    for(i; i < properties.length - 1; i++){
        if(curObj[properties[i]]){
            curObj = curObj[properties[i]]
        }
    }
    curObj[properties[i]] = value
}

export function transformJSON(inputObj: any, outputObj: any, propertyStrings: [string, string][]){
    for(let [inputString, outputString] of propertyStrings){
        let val = getValueGivenString(inputObj, inputString)
        setValueGivenString(outputObj, outputString, val)
    }
    return outputObj
}
