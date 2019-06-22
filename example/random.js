/**
 *  구성 중인 무궁화72용 공용 함수 라이브러리
 */
const mugunghwa = require('../mugunghwa.js')

let countAdd = (index, addableCount, code, isReversed = false)=>{
    let effectedCode = code
    effectedCode = effectedCode.split(``)
    if(isReversed) effectedCode = effectedCode.reverse()
    effectedCode.splice(index, 0, addableCount)
    if(isReversed) effectedCode = effectedCode.reverse()
    effectedCode = effectedCode.join(``)
    return String(effectedCode)
}

let numberCount = (code)=>{
    let effectedCode = String(code)
    if(effectedCode.length > 4+1) effectedCode = countAdd(4, '만', effectedCode, true)

    if(effectedCode.length > 8+1) effectedCode = countAdd(8+1, '억', effectedCode, true)
    if(effectedCode.length > 12+2) effectedCode = countAdd(12+2, '조', effectedCode, true)
    return effectedCode
}

let randomEncode = (min = 1, max = 100000000) => {
    let index = Math.floor(Math.random() * (max-min)) + min
    let code = mugunghwa.encode(index)

    console.log(`${code}(${numberCount(index)})`)
}

for(let i=1;i<=10;i++) randomEncode(26873855, 1934917631)