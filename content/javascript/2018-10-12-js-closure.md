---
title: JS 호이스팅, 변수의 범위(scope), 클로저
date: '2018-10-12 00:00:00'
categories: javascript
tags: [javascript, js]
---

## 호이스팅

* 변수나 함수의 선언이 해당 범위(scope)에서 최상단으로 옮겨지는 것

```js
num = 6;
console.log(num); // 6
console.log(num2); // undefined

var num; // OK
var num2 = 10;
console.log(num2); // 10

catName("chloe"); // OK

function catName(name){
	console.log("cat's name=" + name);
}
```

변수선언 부분이 아래와 같이 옮겨진다

```js
var num; // OK
var num2;

function catName(name){
	console.log("cat's name=" + name);
}

num = 6;
console.log(num); // 6
console.log(num2); // undefined

num2 = 10;
console.log(num2); // 10

catName("Chloe");
```

## 변수의 범위

* 전역 변수의 선언은 window에 속한다(window는 브라우저를 의미)

```html
<script>
var x = 10;

console.log(x); // 10
console.log(window.x); // 10
</script>
```

* 지역 변수의 선언은 (블럭범위 없음)
	* 지역변수 함수 전체에서 유효
	* 함수호출을 해야 전역변수가 만들어짐

```js
function sum(a, b){
	var result = 0; // 지역변수
	gResult = 0; // 전역변수

	// i 는 지역변수 함수 전체에서 유효(호이스팅)
	for(var i=0; i<arguments.length; i++){
		gResult += arguments[i];
	}
	console.log(i); // OK
}

sum(3,5); // 함수호출 해야 전역변수 gResult가 만들어짐
//console.log(result); // 에러
console.log(gResult); // 8
console.log(window.gResult);
```

> 변수앞에 var를 꼭 쓰자

## 함수-유효성검사

* 호출시 인자가 생략될 수 있으므로 if문으로 확인 후 기본값을 넣어주자.

```js
function myFunction(x, y){
	// 호출시 y값을 넣지 않은경우, y는 undefined된다.
	if(y === undefined)
		y = 0;
	// y = y || 0; 과 동일	
}
```

* 널 체크할 때는 undefined인지 먼저 확인하자.(undefined는 null이 아님)

```js
if (myObj !== null && typeof myObj !== "undefined") // 에러

if (typeof myObj !== "undefined" && myObj !== null) // OK
```

## 함수-클로저

* (1) 전역변수로 선언하면 변수이름이 충돌될 수 있고, 외부에서 접근 못하게 값을 보호할 필요가 있음.

```js
var cnt = 0; // 전역변수라 변수이름 충돌가능성. 외부에서 접근가능. 값 보호 필요

function increaseCnt(){
	cnt++;
}

increaseCnt();
increaseCnt();
increaseCnt();
console.log(cnt); // 3
```

* (2) 지역변수로 선언하면 변수가 보호되긴 하지만 매번 0으로 초기화 됨

```js
function increaseCnt(){
	var cnt2 = 0;

	cnt2++;
	console.log(cnt2);
}

increaseCnt();
increaseCnt();
increaseCnt();

// console.log(cnt2); // 에러
```

* (3) 변수를 지역변수로 하고, 내부함수로 변경. 내부함수라서 외부에서 호출 불가

```js
function closure(){
	var cnt = 0;

	function increaseCnt(){
		cnt++;
		console.log(cnt);
	}

	increaseCnt();
	increaseCnt();
	increaseCnt();
}

closure();
// increaseCnt(); // 에러. 외부에서 호출불가
```

* (4) 내부함수를 반환하여, 외부에서 호출할 수 있도록 변경.

```js
function closure(){
	var cnt = 0;

	return function(){
		cnt++;
		console.log(cnt);
	};
}

var increaseCnt = closure(); // 내부함수 반환

increaseCnt();
increaseCnt();
increaseCnt(); // 외부에서 호출가능
```

*  (5) 
	1. 콜백함수가 외부변수를 사용하면 의도와 다른 결과를 얻는다.
	2. 이럴 때, 콜백함수를 클로저로 변경하면 올바른 결과를 얻는다.
	3. 다른 방법은 배열과 forEach()를 사용하는 것이 있다.

```js
// 0,1,2가 아니라 3,3,3 이 출력된다.
for(var i=0; i<3; i++){
	setTimeout(function(){alert(i);}), 0);
} 
// setTimeout이 비동기 함수이기 때문에 for문이 끝난후 값이 반환된다.

// 콜백함수를 클로저로 변경 -> i와 x를 분리하는 것이 핵심
// 0,1,2가 잘 출력된다
for(var i=0; i<3; i++){
	(function(x){
		setTimeout(function(){alert(x);}, 0);
	})(i);
}

// 다른방법. 배열 + forEach

[0,1,2].forEach(function(i){
	setTimeout(function() { alert(i); }, 0);
})
```

### 참고자료

* 남궁성강사님 강의자료
* [생활코딩-클로저](https://opentutorials.org/course/743/6544)
* [zerocho블로그-함수의 범위(scope)](https://www.zerocho.com/category/JavaScript/post/5740531574288ebc5f2ba97e)
