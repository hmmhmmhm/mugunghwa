import mugunghwa from './mugunghwa.js'
import infinite from 'infinite.js'

export default class mugung extends mugunghwa {
    /**
	 * 복합 다진수를 10진수로 변환합니다.
	 */
	static decimalBase(maxMatrix, indexMatrix) {
		let indexDecimal = infinite('0')
		for (let i = indexMatrix.length - 1; i >= 0; i--) {
			let tempIndex = infinite(indexMatrix[i])
			for (let m = i + 1; m < indexMatrix.length; m++)
				tempIndex = tempIndex * infinite(maxMatrix[m])
			indexDecimal = indexDecimal + tempIndex
		}
		return indexDecimal.toFixed(0)
	}

	/**
	 * 10진수를 복합 다진수로 변환합니다.
	 */
	static multipleBase(maxMatrix, indexDecimal) {
		let temp = infinite(indexDecimal)
		let result = []

		for (let i = maxMatrix.length - 1; i >= 0; i--) {
			let up = infinite(infinite(temp / infinite(maxMatrix[i])).floor())
			let down = temp - infinite(maxMatrix[i]) * up
			temp = up
			result.push(down.toFixed(0))
		}
		if (temp !== 0) result.push(temp.toFixed(0))
		result.reverse()
		return result
	}

	static expectLength (index) {
		let maxLength = Number(1)
		for (;;) {
			let fullCase = infinite('72').pow(maxLength)
			if (infinite((infinite(index) + infinite('1'))) <= fullCase) break
			maxLength++
		}
		return maxLength
	}

	static infinite(indexString){
		return infinite(indexString)
	}
}
