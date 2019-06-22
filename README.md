# mugunghwa
>  🌺 무궁화 코드 mugunghwa code ( kr base 72 )
>

무궁화 코드는 10진법 숫자를 한글 번호로 변환해주는 모듈입니다. JSConf Korea 발표를 통해서 6월 22일 최초 공개되었습니다.

## Install

```bash
npm install mugunghwa --save
```

## Usage

> 무궁화 코드는 다음과 같이 사용할 수 있습니다.

### Encode

```js
import mugunghwa from 'mugunghwa'
const encoded = mugunghwa.encode(`31252352334`)
console.log(`encoded: ${encoded}`)
```

### Decode

```js
import mugunghwa from 'mugunghwa'
const encoded = mugunghwa.encode(`31252352334`)
const decoded = mugunghwa.decode(encoded)

console.log(`encoded: ${encoded}`)
console.log(`decoded: ${decoded}`)
```



## Is browser support?

브라우저에서 사용할 수 있는 바로 첨부가능한  코드는 build 폴더 안에 **mugunghwa.js** 입니다.



## What exactly mugung.js

**mugung.js** 는 Big-Integer 연산 모듈이 포함되어서 연산범위가 늘어난 버전입니다. 만약 1000억을 넘는 범위를 계산해야하는 경우 **mugung.js** 모듈을 사용해주세요.



## License

MIT Licensed.