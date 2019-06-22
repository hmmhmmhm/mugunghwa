/**
 *  구성 중인 무궁화72용 공용 함수 라이브러리
 */
const mugunghwa = require('../mugunghwa.js')
console.log(mugunghwa.decode(process.argv[2], '-', true))

// 정상적인 문자열 변환 테스트
//console.log(mugunghwa.decode(`난선나단나`))
//console.log(mugunghwa.decode(`난선나단나`))
//console.log(mugunghwa.decode(`난선다시나단나`))

// 수정가능한 오탈자 수정 테스트
//console.log(`반환받은 값: ${mugunghwa.decode(`놘션-놔댠-냥`, `-`, true)}`)

// 잘못된 양식 테스트
//console.log(mugunghwa.decode(`나나나단나`))

// 잘못된 오탈자 테스트
//console.log(mugunghwa.decode(`8나나단나`))