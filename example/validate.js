
switch(true){
    case (process.argv.length < 4):
        console.log(`node example/range 0 100 과 같이 숫자범위를 입력해주세요.`)
        return
    case (isNaN(process.argv[2])):
        console.log(`첫번째 인자는 숫자여야 합니다.`)
        return
    case (isNaN(process.argv[3])):
        console.log(`두번째 인자는 숫자여야 합니다.`)
        return
    case (process.argv[2] > process.argv[3]):
        console.log(`첫번째 인자는 두번째 인자보다 값이 클 수 없습니다.`)
        return
}


let stoppedPoint = null

let startPoint = process.argv[2]
let endPoint = process.argv[3]

/**
 *  무궁화코드 라이브러리
 */
const mugunghwa = require('../mugunghwa.js')

// 함수코드 로딩
mugunghwa.encode(1)
mugunghwa.decode(1)

console.time('변환소모 시간')
for(let i=startPoint;i<=endPoint;i++){
    let encoded = mugunghwa.encode(i)
    let decoded = mugunghwa.decode(encoded)
    if(i%1000 == 0)console.log(`현재 ${i}/${endPoint} 까지 무결성 검사가 성공했습니다`)

    if(i != decoded){
        stoppedPoint = i
        break
    }
}

if(stoppedPoint === null)
    console.log(`${startPoint}~${endPoint} 까지의 무결성 검사가 성공적으로 끝났습니다.`)
else
    console.log(`${startPoint}~${endPoint} 까지의 무결성 검사가 실패했습니다. ${stoppedPoint} 번째 불일치`)

console.timeEnd('변환소모 시간')