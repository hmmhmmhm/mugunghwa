const LZString = require('./lz-string.min.js')
var isDebug = false

// 필터링 되지 않은 98가지 글자 목록이 여기에 담깁니다.
var nonFilteredCharMap = []

// 인코딩 테이블이 여기에 담깁니다.
var encodeTable = []

// 오타 정정을 위한 문자보수 테이블이 여기에 담깁니다.
var charFixMap = {}

// 단어로 구성된 중간자가 여기에 담깁니다.
var seperatorWord = []


// 압축된 글자목록입니다.
let compressedCharMap = 'hkNhyGwtDYJ02BdNgvTYI82B92wGe2A1OwNZ2AquwLN2A-uwP92A1A4A0DggwOATA4LsDgOIOAEg4CSDgNIOCMg4DGDgKYOA5g4IWDgGEOA7Q4AOhwCdDgG6HAIqOAJUcAGo4ETRwDejgB9HAEGOASMcAUY4BSxwA1jgFbHABOOASccAU44AFxwC7jgH3HAIeOBUCcAUM4F4ZwCIzgHJnAFTOBamcAQs4FxZwDorgBqrgDqrgC6rgKWrgCBrgDxrgLJrgCprgBVrgBUNgBBNgDdNgJ9NgCC9gCJ9gDVDgC+jgIBjgAnjgDsLgDhrQA'

let parsedCharMap = LZString.decompressFromEncodedURIComponent(compressedCharMap)
nonFilteredCharMap = String(parsedCharMap).split('')


// 압축된 중간자목록입니다.
let compressedSeperatorWord = 'idNh2hwAzeg2Q2gDQ0A'

// 압축된 중간자목록을 불러옵니다.
let parsedSeperatorWord = LZString.decompressFromEncodedURIComponent(compressedSeperatorWord)
let pairSeperatorGroup = ''
for(let i=0;i<=parsedSeperatorWord.length;i++){
	pairSeperatorGroup += parsedSeperatorWord[i]
	if(pairSeperatorGroup.length == 2){
		seperatorWord.push(pairSeperatorGroup)
		pairSeperatorGroup = ''
	}
}


// 압축된 인코딩 테이블입니다.
let compressedTable = 'hkNgum6F6bkH3bkDPbkBqdxA1ncQFV3ED-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-HYU+JBkkK2NTOmQyaY0tUuR-aoa8CUCvAfgrwDQK8G0CvBDArwEwK8HMCvArArwQMK8FsCvAwwrwBwK8GcCvAUQrwNwK8E8CvAfArwbEK8DxCvAggrwCIK8GiCvA4grwRIK8BSCvB0grwLIK8FyCvACgrwYoK8DKCvBKgrwGoK8HqCvAmgrwVoK8F7CvBugKgT4EoCFBKAQADMbuEoCgBKBsECAJQBQnUQygTkSmfXCfgcLfEQyKFbKrjWzoUMWmdLEtjhyUDCAlAYgJQHcBP61DyRSgH4EoA0BKBtASgPQEoEMBKBEISgEwEoHMBKArASgQMEoFsBKAHASgZwEoERBKAUQSgNwEoE8BKAfASgbEEoDxBKB-ASgCIEoGiBKA4gSgRIEoBSBKB0gSgLIEoFyBKACgSgYoEoEqBKB6gSgJoEoFaBKAOgSgXsEoG6DqBvgqgIUNlCZi9xVACAVQMgFUBoAzkVqLdCpl2yG4z8qgZYL8TDJoVcq+NXOlQzaZls8O6XNHmf3qGqAlAqgH4KoA0CqBtAqgPQKoEMCqBEIqgEwKoHMCqArAqgWwKoDDCqAHAqgZwKoERCqAUQqgNwKoE8CqAfAqgbEKoDxCqB-AqgIIKoFCCqBogqgOIKoESCqB0gqgLIKoFyCqACgqgYoKoDKCqBKgqgGoKoHqCqAmgqgVoKoF7CqBugPwYALlBZg-BhgPwNAD8BlAXIbUPwHAPtmNwX4nC-xCMhhXyo-BGA+dGhh0wrYX9GhlI3MT8G0A-BDAPwEwD8HMA-ArAPwMMD8ERA-AUQPwNwD8E8A-AfAPwbED8DxA-B-APwIID8GiA-A4gPwRID8HSA-AsgPwXID8AKA-BigPwSoD8BqA-B6gPwVoD8A6A-BewPwboACHyhsx+4GgKABoFgAaAEAGgZABoDQAaAZQVyDQJgA0A4ANMh2U3FfhcKAkoyWFQqhoEYCF06GXTDQLwCrZEdsuGgMQGHyv4aAZAzQ6kfmMQkaBtAGgPQBoEMAaBEIGgEwBoHMAaArAGgQMBoFsAaAHAGgZwBoERAaAUQGgNwBoE8AaAfAGgbEBoDxAaB-AGgIIBoFCAaAIgGgaIBoDiAaBEgGgFIBoHSAaAsgGgXIBoAKAaBigGgSoBoBqAaB6gGgJoBoFaAaAOgGgXsBoG6C6BtAvQbQEKEKgcxtAUAbQAgG0A4AtMN+bQMsGBI4ViqxdBhj0xZYkcseEfG-toBkC0jCx2gPQNoEMDaBEI2gEwNoHMDaArA2gQMNoFsDaAww2gZwNoERDaAUQ2gNwNoE8DaAfA2gbENoDxDaB-A2gIINoAiDaBog2gOINoESDaB0g2gXINoAKDaBig2gMoNoEqDaAag2geoNoCaDaBWg2gboECGKhcxh4egWAHoAQB6A0AegGUHcj0A4AdMegUgHfjcKgk4yeFPQHQEJql0mGfTPQLwHy5392hegV4KhNumay9AJgPQOYD0BWA9AgYPQLYD0Bhg9ADgPQM4D0CIg9AKIPQG4D0CeA9APgPQNiD0B4g9AQQPQKED0ARA9A0QPQHED0CJA9AWQPQLkD0AFA9AxQPQGUD0CVA9ANQPQPUD0BNA9ArQPQB0D0C9g9A3QYwCCC9AIRSoPMUeIYFgCGAEAhgZAJomKQPIHUO6PTKdktwP4PC4JBMgRVKrE1y6LDAZoYF4ANsKOhXPHlHwf4KDOh9I0sehP8n3TtZhgPQIYEQiGATAhgcwIYCsCGBAwhgWwIYDDCGAHAhgZwIYERCGAUQhgNwIYE8CGAfAhgbEIYDxCGB-AhgIIIYFCCGAIghgaIIYDiCGBEghgFIIYHSCGAsghgAoIYGKCGAyghgSoIYBqCGB6ghgJoIYFaCGAOghgXsIYG6CIRgAiEIUOVD5jjxEIUARCLAEQjIAnkiETAOdmtxP5ISSZIiuVUQiMBK6bDIZohF4BNsCeiESQN0MQivBEIPwR6brM4WIQTAiEcwIhCsCIRAwiEWwIhDDCIQHAiEZwIhBRCIQ3AiETwIhB8CIRsQiEPEIhH8CIQggiEUIIhGiCIQ4giERIIhHSCIQsgiEXIIhAKCIRigiEMoIhEqCIR6giEJoIhFaCIQOgiEXsIhG6BmAwQPoVCJVAFiTxYEJgWACYAQAmBkA2iUpC8idQHojMl2W3C-i8LQkUyJFSqqTWrocMRmbLFtjR1K5E8Y+T-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-zedrcBhhTdk+oQ40bcCeA3APgNwNiDcB4g3A-gNwNEDcBxA3AiQNwCkDcDpA3AWQNwLkDcAFA3AxQNwGUDcCVA3ANQNwPUDcBNA3ArQNwB0DcC9g3A3QbwFiCTCUQVY+8TwFAE8CwBPACATwMgGsSeAZQIKCNG5l+zB4ICCRfEhWTYr9Vuag9GRlsylYDshO7XNnnnxAEGDlhoo3sfRPingznZW8xRYMtZVlrsNl2zwGGHN3T6RDzRgk54B8CeBsQngPEJ4H8CeAggngUIJ4AiCeBogngOIJ4ESCeAUgngdIJ4CyCeBcgngAoJ4GKCeAygngGoJ4HqCeAmgngVoJ4A6CeBewngboH4B8C9AUw1EfqGrB8DDAfAUAHwLAB8AIAfAyAWxLUjBRRoH0Hmf7KHigJJFCSVZDioNWHpyMdmPgXgEOxE6dcOePgO4GAKMGrDxR-YxiYlMhmuyd5yi4ZeyorW4bgt12wnZbtn1iHWjRJ6Mz4GxA+A8QPgfwD4CCA+BQgPgCID4GiA+A4gPgRID4BSA+B0gPgLID4FyA+ACgPgYoD4DKA+BKgPgGoD4HqA+AmgPgVoD4A6A+BewPgboNiGAC4g0wtEQaBrEPjYgEA2IZAPYmxAygIUMaJ9F5nDwwEUixJGslxWGr81R6CjPZjKxHZiduuXPAvhAOxAyB1hkowccxOSnQz3Ze81RaMs5VVr8NoW27diDDDW759Eh9oySdjO-nsQeIbEP4GxBBBsQoQbEBEGxDRBsQcQbEIkGxApBsQ6QbEFkGxC5BsQBQbEMUGxBlBsQlQbEDUGxD1BsQTQbEK0GxAdBsQvYbEN0DxDAACQGYYaFrGPh4goAeIWAHiAQB4hkAjiPEDKChRxoX0PmSPHATSKkk6yPFPEIwHHpKMDmcrMdhJ16488i+UAkwZsOlHDjWJqU2GZ7IPnqLxl3KmtYRvC33a8QYYW3YvqkOdGyT8Z-8zZbxD+A8QQQPEKEDxARA8Q0QPEHEDxCJA8QKQPEOkDxBZA8QuQPEAUDxDFA8QZQPEDUDxD1A8QTQPEK0DxAdA8QvYPEN0ECBEgswjEUaDrH8DDB-AUAfwLAH8DIBnE-gGUDCgTT+AcAfmaPAgQyLkkGyfFcaoLUnoqMjm-gXgFJ36588S+MAswdsP8CvBRx7E9KfDO9n+A9AmiyZbyrrXEbItj2-wGGGX3dGKTiZwC3ZZ2v+Agg-gUIP4AiD+Bog-gRIP4BSD+B0g-gXIP4AKD+Big-gMoP4EqD+Aag-geoP4CaD+BWg-gDoP4F7D+BugIQEkOND1inxXEcKJNAFlByx4kCWRSkk2QEqTVha09NRicynZwCLBQQJQJxMRm+ztF0y-lQ2tI1BAwwjuuQ0EDcDJmHLe1yW0EFCBBAIgQQOIEEESBBAUgQQdIEECyBBBcgQQAoEEGKBBAygQQSoEEBqBBB6gQQJoEEFaBBBewQQboOEDJChAhQk0A2OfFCBQBQgsAUIMgHcShAZQCKFNB+iCyhAiA8eFAjkWpItkhKoQOgKLVnoaMzmCrGdjJ2G5l8rB+w0IEoG4nIzQg2gXRbMsFVNryNr20IGGHX39HQgbgVM6BacsHXpb2d0IBEFCDRBQgcQUIIkFCDpBQgWQUIAUFCDFBQglQUIDUFCD1BQgTQUIK0FCAdBQgvYUIN0CiARBegEQQcNNCNgRBYAEQBABEGQARA0AEQGUEijTQRAiAaBEStNXnpaMLmEQXgBEGiijcIgYgCIJIEOHjjUZZ8-RcKpbWUaIgtgV3ZvqUMRA3A6Z8Cy5aOuy2AHEQaIBEDiARBEgEQFIBEHSARAsgEQXIBEAKARBigEQMoBEHqARAmgEQDoLEApCsRZoJsa+NECgDRBYA0QBANEGQCeJ6kKKDNF+jCzg5k8GBAovSQ7JiVogdASWovR0ZXMlWc7BTuNyF4V8kBNg44YqMnG8Tsp6MwORfMMXzLRVba6jfFve3RAww7u7fSoeGNUnMzkFtyydflvRAggQDzR9EDiDRBEg0QFINEHSDRAsg0QXINEAKDRBig0QMoNEEqDRAag0QeoNECaDRBWg0QRx72GiDdAEg7EeaGbFvhxAUEsAOIAgDiDIBvEcQGUGiizQ-oIsRRRkl2QkqzVpay9PRjcxVYLslOk3EXlXxQF2DThyo6cfxNymYzg5V84xYsvFUdraNiWz7XEDDCe7d9ah0YzSezPQWPLZ1uIP4HzsgPtH3TuIIkDiDpA4gWQOILkDiAFA4gxQOIJUDiA1A4g9QOIE0DiCtA4gHQOIL2DiDdBOIi0e+IkCgCJBYAiQBAIkGQC+JEgMoHNH+iizQ508OBEosyR7JSVZaq9AxnczVZLtpuNfNAQ4POGzjBJ+U7GaHJvmmLllkqrtfRu+2JAww3u-fRofGN0nczsFryxdcVuF2wHuj3pwS8SApBEg6QRIFkESAFBEgxQRIGUESCVBEgNQRIPUESBNBEgrQRIL2ESDdA6QZYbiMtCtiPwUgUAFILABSAIAUgyAfxCkBlAYo80AGGLLDkzx4EyirJPsjJUWry116RjB5iuzU6zcJeGAlIDIEuHqj5xKQVQLjJSDaBzFKQRCNKp7WMbftpO33Yfq0OTGGT+Z+Cz5auvK3i7KQUIPo-6cpA4gPrlIOkBSBZAUguQFIAUBSDFAUglQFIDUBSD1AUgTQFIK0BSAdAUgvYFIN0FWg2xn46QWAOkGQCBJ0gDSGYOkEwBAZs8BBCouyQHJyVlqm9Exk8y1Zrt5uWApwdcM1GLjhJhU-GeHPSB6BLFqy2VX2uY3Jb-t5O-3cfp0PTGmThZxC35Zuuq3DHgzol364PfpAsg6QAoOkGKDpAyg6QSoOkBqDpB6g6QJoOkFaDpAOg6QXsOtDthZAoAWQWAFkAQBZBkAWQGUFigLQgYEsiOXPEQSqKckhyClVasrW3pmMXmOrDdhp0W5ZA7gOAlwbcO1HLjRJhM6xesvlUDrWNgOrIBToD0n7dDMx5k0WaQv+Xbr-gcu1A+MfDOSXAbo9+x6yC5AsgBQLIMUCyCVAsgNQLIPUCyBNAsgrQLIB0CyDSfugm0B2O-FyCwBcgCAXIMgFyBoBcgMoXIDMFyCYAwMSWZHPnhII1FuSI5XINsFVq70LGbzPVst1yCSA3B9w1ceJMjm5BDAiqodbkAcDn75jbJ1Cw9fVu5BQgpj0Z2S9yCJAT3uQdIAl9yBlBcglQXIDUFyD1BcgTQXIK0FyC9hcg3QJ2J-AKBQACgsAAoAgAKDIBQkBQGUDiggwpZUcheMgnUV5JjklKm1AoIwH3pWMPmBrHdjp1W4y88BHgx4fqPXGSTyp0cp+bYu2XKqR1mW0HUHsv2LGOT5Z9CyFc1vV2YH5j8ZxS6DdnvOPSXgoMUAKCVACgNQAoPUAKBNACgrQAoL2AKDdA0s6OYvBQQaL8kJyKlbaurUPo2MW+zwzcS-PsW7LVVY67jdlvB0h7r9yxrk5WcwthWXr2t2u5M6pcXvuPKX4oLkDZ-FBKgxQGoMUCaDFBWgxQDoMUF7DFBugZQXoG7DKBQAygsAMoAgDKDIAygaAPFGWhgxlB8AmOUvFQSaJlBqAU5NSrtU1rH07GPzTbgrzKB3AygkgMoDIFeHGjZJZQH4GUA0Dxy35ji9VROt425bIdZQMMGHrMOrGeT2FiK29d1vTOygcQMN2UBSC8eygWQMoAUDKDFAyglQMoDUDKBNAygrQaoByBbCSR9oHsf+JUCgCVBYAlQBAJUGQCVAZQBKCtJUBwAZZsc5eGgi0UFIzkNK+1bWqfQcZ-MzWlQaKEZ225K82+BAyoDIHeGmjtx8kymUTkP5ZxUOVNVKdX418taHUqAwwCPXv0LDdYz5NcLKK0qA8QfW0bsEHSoAiBZnGlwjcr3fjzS8zvDn3t9KgGoEqB6gSoCaBKgBfw6BKgXsEqBugOoEOgvYGoDQAagagDnJDqGoEYBz6Jxk+EagJQFcVtVQTXmc6XQTy59SA3VTnVFnBl2E8sveoBqAmCUUiXJTqa+jcY49YiwSsfrZZz59nfSgNOgA4cBFaBYAVoAQBYkMlAQwCsHonFIVyQ2lvoPGMFis5juNXgoFWgGQD+FDxdSUalM5ABW8VzlQ1SXVxNVoEDBkdVoDDB9jMU2bNSLJKz+tzbTuwwdWgCIBZcn3PLwX9WgGoFaBugUnElJ76Y8V8VLlY1RXVJNUrVR0OgBwDZcX3DoFaBpSDclPFTVNdWk0k9Dl17B0ga6BDhugBAG6BkAboASQZQboGpRm0RDFKwKcFvE4JBiGUk3JTKG6jNon6XxmhZ7WS9ns4LuTXkH5gRM8VAUAlM1XXUZNWwG6AwwboGT0v9Vw2lMOzKi3StgbG21wdNnTl2TcWgx72F8vfeoG6AmgIAA'

// 압축된 인코딩테이블을 불러옵니다.
let parsedTable = LZString.decompressFromEncodedURIComponent(compressedTable)
let pairGroup = ''
for(let i=0;i<=parsedTable.length;i++){
	pairGroup += parsedTable[i]
	if(pairGroup.length == 2){
		encodeTable.push(pairGroup)
		pairGroup = ''
	}
}

// 압축된 문자보수 테이블입니다.
let compressedFixMap = 'N4IkGQ0gXA2igLDSANCQmQ1JIaob2EqG9gUxvUFOGkAXWUByGqWQWob1AKhvUAKG9QDMb1BKxtOUBaGqkQEkb0gGcb0gHiauIQCdNfQKdN6QO9N6QDjN6QAyt6QBat6QK9N6QIKtEwBdNfQCyt6QCfN6QATNEwC9NfQDTN6QAsL6QAKtEwCPNfQAWL6QJvN6IDrzRKAPu18gB4d6IAt7RKAGe18gBAd6IANHRKAGp18gJqdEoA1nXyAg53ogAmdEoAVXXyAGN3ogArdEoAs3XyAJd3ogAPdEoAf3XyAO93ogBHd6IA-XRKAP918gLA96IAH3eiAMd3ogLnd6ICP3RKANQN8ACzogB9D6IAMw+iAL8PogBWDEoANA3yAP0PogBcD6IA1g+iAH8MSgIMDfICww+iAnwPogFFh9CAXsH0IBIEfQgB6B9AAZgkgAmBviADkH0IAUYfQgBDh9AAAkAOSPoQAIIxJALsDfEAsoPoQCUw+hAKiD6EApkMSQA4g3xABbD6EABcPoQAqg+hACxDEkABIN8QA2w+hACXD6EAGoPoQAcQxJACSDfEADsPoQA8Q+hABEjEkANIN8QAew+hACJD6EACSMSQCMg3xAL7D6EAkkPoQCpIxJADGDfEAG8P89CAAJGJIAUwb4gBAh9CAA+H0IAFEYkgBzBviAGCH0IAL4fQgA0RiSAQsG+IBEIfQgFvh9CAXRGJIAMIb4gAih9CAExH0IAVkYkgB2hviAAaH0IAbIfQgApR9CAGFH0IAOkYkgAOhviAEaH0IBHofQgBpR9CABFH0IBeUYkgBOhviACaH0IAXIfQgAZR9CAFFH0IABkYkgBuhviABaH0IAfIfQgA5R9CAHFH0IAJkYkgBFRviAPVH0IBVUfQgHVR9BAAEx9BAAnO9BABGu9BAAAuiRAAlRvhABEx9BAFUx9BAE1R9BAAD29BAB8O9BABnO9BAAmu9BABAuiRAANRvhAAXR9BAB0x9BAA8x9BAAux9BAENR9BAGdR9BAGPRiRAETRvhAEn29BAFQuiRABvRvhABbR9BABIO9BABmx9BABv29BABBO9BAAFGiRAAfRvhAAoOiRAAgxvhAAzR9BAAEO9BAAX2iRABIxvgAFYJEACjG+EATjH0EAFjGJEAFLG+EAGY6JEABrG+EAUbGJEAFbG+EAGE6JEAAnG+EAQnH0AANnQQAXJokQAScb4QAdTvQQBWcYkQAKcb4QADTokQABcb4QBFcfQQAZcYkQAXcb4QAJpvQAAmdBAFdx9BAA1x9BABBx9BAHDxiRAB9xvgAEZ0EABab0EAGHH0EAA3H0EAAB70EAE+6JEAEPG+EASPGJEAVAm+EAWQn0EAWkmJEAChm+EAHcmJEAXhm+EAR8mJEAERm+EAFpmJEAHJm+EABSmJEACpm+EAHSmJEAWpm+EAQymJEACFm+EAHqmJEAXFm+EARamJEAHRW+EAG+WJEADVW+EABNX0EAa1X0EAYtWJEAHVW+EAW1X0EAC1X0EAA1WJEAF1W+EAE9X0EASNX0EAT9WJEAUtW+EAAtX0EAFNWJEAEDW+EAVDX0EABDWJEAHjW+EAGrWJEAWTW+EAXrWJEAFTW+EAVTX0EAczX0EAUzX0EASzWJEACrW+EASrX0EAbrWJAYGAQEAEsb0EAA4aJEACCa+EATCb0EAFCb0EAECaJEAG6a+EAC+b0EACYX0EADlaJEAT6a+EAUVb0EAVYX0EAV+aJEAEF6+EAD570EASF70EAF56JEAET6+EAHlX0EABIGJEAGqG+EAD5H0EAAiGJEAF9G+EAGg6JEAQDG+AABnQQBODvQQBADokQAE8b4QBE8fQQBi8fQQBC8YkQAdhb4QAZRfQQATJfQQAXxYkQAcNb4QAa1dIABfIA'

// 압축된 문자보수 테이블을 불러옵니다.
let parsedFixMap = LZString.decompressFromEncodedURIComponent(compressedFixMap)
charFixMap = JSON.parse(parsedFixMap)

export default class mugunghwa {
	/**
	 * 복합 다진수를 10진수로 변환합니다.
	 */
	static decimalBase(maxMatrix, indexMatrix) {
		let indexDecimal = 0
		for (let i = indexMatrix.length - 1; i >= 0; i--) {
			let tempIndex = Number(indexMatrix[i])
			for (let m = i + 1; m < indexMatrix.length; m++)
				tempIndex *= Number(maxMatrix[m])
			indexDecimal += tempIndex
		}
		return indexDecimal
	}

	/**
	 * 10진수를 복합 다진수로 변환합니다.
	 */
	static multipleBase(maxMatrix, indexDecimal) {
		let temp = Number(indexDecimal)
		let result = []
		for (let i = maxMatrix.length - 1; i >= 0; i--) {
			let up = Math.floor(temp / maxMatrix[i])
			let down = temp - maxMatrix[i] * up
			temp = up
			result.push(down)
		}
		if (temp !== 0) result.push(temp)
		result.reverse()
		return result
	}
	
	static expectLength (index) {
		let maxLength = 1
		for (;;) {
			let fullCase = Math.pow(72, maxLength)
			if ((index + 1) <= fullCase) break
			maxLength++
		}
		return maxLength
	}

	/**
	 * 순서 값을 글자로 인코딩합니다.
	 */
	static encode (index, separator="-") {

		// 숫자가 아닌지 여부를 확인합니다.
		// (음수와 소수점 숫자 또한 거부합니다.)
		if(index === null || index === undefined || isNaN(index) || index < 0 || index%1 != 0)return null

		// 인코딩 되는 글자길이 확인
		let maxLength = this.expectLength(index)

		// 고정범위 배열 생성
		let max = []
		for (let i = 0; i < maxLength; i++) max.push(72)

		// 10진수를 다진수 배열로 변환
		let matrix = this.multipleBase(max, index)

		let pairEncodedWord = ""
		/*
		if(isDebug){
			console.log(`최대 값 배열: ${max}`)
			console.log(`순서 값 배열: ${matrix}`)
			console.log("")
		}
		*/

		// 인코딩 시작
		if (max.length == 1) {
			// 인코딩 되는 자릿수가 1개일땐 72진법 그대로 적용
			pairEncodedWord += nonFilteredCharMap[matrix[0]]
			//if(isDebug) console.log(`한자릿수 72진법 적용: ${matrix[0]} -> ${nonFilteredCharMap[matrix[0]]}`)
		}else{
			// 2개씩 모아서 10진화 한 후 인코딩 적용
			let pairGroupLength = maxLength - maxLength % 2
			let pairGroup = []
			for (let i = 0; i < pairGroupLength; i++) {
				pairGroup.push(matrix[i])
				if(pairGroup.length == 2){
					let pairIndex = this.decimalBase([72, 72], pairGroup)

					// 오버플로우가 발생하면 null 처리
					if(typeof encodeTable[pairIndex] == 'undefined'){
						//console.log(`! pairIndex:${pairIndex} pairGroup:${pairGroup}`)
						return null
					}
					pairEncodedWord += encodeTable[pairIndex]
					//if(isDebug) console.log(`짝수단위 84진법 적용: [${pairGroup}] -> ${pairIndex} -> ${encodeTable[pairIndex]}`)
					pairGroup = []
				}
			}

			// 마지막 하나가 남으면 남은 수는 72진법 그대로 적용
			if(maxLength % 2 == 1){
				let lastOne = matrix[matrix.length-1]
				if(typeof nonFilteredCharMap[lastOne] == 'undefined'){
					return null
				}
				pairEncodedWord += nonFilteredCharMap[lastOne]
				//if(isDebug) console.log(`짝수단위 72진법 적용: ${lastOne} -> ${nonFilteredCharMap[lastOne]}`)
			}
		}

		/*
		if(isDebug){
			console.log(`짝수단위 검열된 글자조합: ${pairEncodedWord}`)
			console.log("")
		}
		*/

		/*
		// 인코딩 글자길이가 다섯글자 이상 일 때
		// 홀수단위 부정조합 인코딩을 적용합니다.
		if(maxLength >= 5){
			let oddEncodedWord = ``

			// 앞 두글자 바로반영
			oddEncodedWord += pairEncodedWord[0]
			oddEncodedWord += pairEncodedWord[1]
			oddEncodedWord += pairEncodedWord[2]

			// 홀수단위 계산시작 (84진법->98진법)
			let oddGroupMaxLength = maxLength - (((maxLength-3)%2==1)? 1 : 0)
			let oddGroup = []
			for(let i=3;i<=oddGroupMaxLength;i++){
				oddGroup.push(pairEncodedWord[i])
				if(oddGroup.length == 2){
					let oddIndexGroup = [nonFilteredCharMap.indexOf(oddGroup[0]), nonFilteredCharMap.indexOf(oddGroup[1])]
					let oddIndex = this.decimalBase([84,84], oddIndexGroup)
					let oddEncode = encodeTable98[oddIndex]
					oddEncodedWord += oddEncode
					if(isDebug) console.log(`홀수단위 98진법 적용: ${oddGroup.join(``)} -> [${oddIndexGroup}] -> ${oddIndex} -> ${oddEncode}`)
					oddGroup = []
				}
			}

			if((maxLength-3)%2==1)
				oddEncodedWord += pairEncodedWord[pairEncodedWord.length-1]
			if(isDebug) console.log(`홀수단위 검열된 글자조합: ${oddEncodedWord}`)
			pairEncodedWord = oddEncodedWord
		}
		*/

		// 코드를 쪼갠 후 구분자를 붙입니다.
		let code = []
		for(let i=0;i<=pairEncodedWord.length-1;i++){
			code.push(pairEncodedWord[i])
			if((pairEncodedWord.length-1)!=i && (i+1)%2==0)code.push(separator)
		}
		return code.join("")
	}

	static decode(code, separator="-"){

		if(code === undefined || code === null || String(code).length == 0)
			return null

		// 구분자와 공백을 제거한 후 배열화 합니다.
		let decodedCode = String(code).split(separator).join("").split(" ").join("").split("")
		//if(isDebug)console.log(`구분자 제거된 코드: [${decodedCode}]`)

		let isWrongTypeExist = null

		// 두글자 단위로 단위/대시라는 구분자 표현이
		// 포함되어 있는지 확인 후 있다면 삭제합니다.
		let seperatorDecodedCode = ""
		let pairGroup = ""
		let pairLength = decodedCode.length - ((decodedCode.length % 2 == 1)? 1 : 0)
		for(let i=0;i<=(pairLength-1);i++){
			pairGroup += decodedCode[i]
			if(pairGroup.length == 2){
				let pairGroupStr = String(pairGroup)
				if(seperatorWord.indexOf(pairGroupStr) != -1){
					pairGroup = ""
					continue
				}
				seperatorDecodedCode += pairGroup
				pairGroup = ""
			}
		}
		// 마지막 남은 수의 72진법을 추가합니다.
		if(decodedCode.length % 2 == 1){
			let lastOne = decodedCode[decodedCode.length-1]
			seperatorDecodedCode += lastOne
		}

		// 구분자를 삭제한 코드를 반영합니다.
		decodedCode = seperatorDecodedCode.split("")
		//if(isDebug)console.log(`구분단어 제거된 코드: [${decodedCode}]`)

		// 잘못 입력된 오탈자가 있는지 검사합니다.
		for(let n=0;n<=(decodedCode.length-1);n++){

			// 잘못된 오탈자가 존재하면 해당 글자의 수정을 시도합니다.
			if(nonFilteredCharMap.indexOf(decodedCode[n]) == -1){
				isWrongTypeExist = decodedCode[n]

				// 오탈자 수정 목록을 선회합니다.
				for(let charFixMapIndex of Object.keys(charFixMap)){

					// 수정가능한 글자가 있는지 확인합니다.
					let fixableType = null
					for(let charFixMapValue of charFixMap[charFixMapIndex]){
						if(charFixMapValue == decodedCode[n]){
							fixableType = charFixMapIndex
							break
						}
					}

					// 수정가능한 글자가 있다면
					// 수정한 후 다음 글자를 검사합니다.
					if(fixableType !== null){
						isWrongTypeExist = null
						decodedCode[n] = fixableType
						//if(isDebug)console.log(`오탈자 수정됨: ${decodedCode[n]} -> ${fixableType}`)
						break
					}
				}
			}
		}

		if(isWrongTypeExist !== null){
			// 디버깅 모드가 아니라면 그냥 null을 반환시킵니다.
			if(!isDebug) return null

			// 수정 불가능한 오탈자가 존재하면 오류를 발생시킵니다.
			throw new Error(`Unrecognized code: ${code}\nWrong Typo: ${isWrongTypeExist}`)
		}

		// 해석된 72진법 배열이 여기에 담깁니다.
		let decodedMatrix = []

		// 짝수단위 인코딩을 해석합니다.
		pairGroup = ""
		pairLength = decodedCode.length - ((decodedCode.length % 2 == 1)? 1 : 0)
		for(let i=0;i<=(pairLength-1);i++){
			pairGroup += decodedCode[i]
			if(pairGroup.length == 2){
				let pairIndex = encodeTable.indexOf(pairGroup)

				// 84진법 사전에서 확인되지 않는 단어가 발견될 시
				// 인식할 수 없는 코드로 간주해서 오류를 발생시킵니다.
				if(pairIndex == -1){
					// 디버깅 모드가 아니라면 그냥 null을 반환시킵니다.
					if(!isDebug) return null

					throw new Error(`Unrecognized code: ${code}\nWrong Format: ${pairGroup}`)
				}

				let pairMatrix = this.multipleBase([72,72], pairIndex)

				decodedMatrix = decodedMatrix.concat(pairMatrix)
				//if(isDebug)console.log(`짝수단위 84진법 복원: ${pairGroup} -> ${pairIndex} -> [${pairMatrix}]`)
				pairGroup = ""
			}
		}

		// 마지막 남은 수의 72진법을 해석합니다.
		if(decodedCode.length % 2 == 1){
			let lastOne = [nonFilteredCharMap.indexOf(decodedCode[decodedCode.length-1])]
			decodedMatrix = decodedMatrix.concat(lastOne)
		}

		// 최대 값 범위 배열을 생성합니다.
		let max = []
		for(let i=0;i<=(decodedMatrix.length-1);i++) max.push(72)

		/*
		if(isDebug){
			console.log("")
			console.log(`최대 값 배열: ${max}`)
			console.log(`순서 값 배열: ${decodedMatrix}`)
			console.log("")
		}
		*/

		// 10진수 색인번호로 변환합니다.
		let decodedIndex = this.decimalBase(max, decodedMatrix)
		//if(isDebug) console.log(`코드번호: ${decodedIndex}`)

		return decodedIndex
	}
}