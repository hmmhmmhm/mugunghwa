const fs = require('fs')

/**
 * 단어 목록을 파일에서 불러옵니다.
 */
var loadDataFile = (fileName) => {
	var filterData = fs.readFileSync(fileName, 'utf8').split(' ')

	let loadedWords = []
	for (let filterWord of filterData){
		if(filterWord.length != 2)continue
		loadedWords.push(filterWord)
	}
	return loadedWords
}
let decodeTable84 = loadDataFile(`sources/84_filtered.txt`)

// 정상단어 사전 데이터를 출력합니다.
console.log('[')
let tableIndex = 0
let tableString = ``
for(let decodeTable84Word of decodeTable84){
    tableString += `"${decodeTable84Word}",`
    if(tableIndex++ == 10){
        tableString += `\n`
        tableIndex = 0
    }
}
console.log(tableString)
console.log(']')