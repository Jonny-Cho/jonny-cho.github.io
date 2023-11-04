---
layout: post
title: python기초 12 함수
category: python
tags: [python, 함수]
---

## 함수를 사용하는 이유?

1. 똑같은 내용을 반복해서 작성하는 것을 피하기 위해 '어떤 입력값을 주었을 때 어떤 결과값을 돌려준다'라는 식의 함수로 작성
2. 프로그램의 흐름을 일목요연하게 확인 가능. 에러 확인도 편리.

## 사용법

```python
# 함수 정의
def sum(a, b): # a, b는 매개변수(parameter)
    return a + b

# 함수 출력
print(sum(3, 4)) # 3, 4는 인수(arguments)
```

> "이 함수의 이름(함수명)은 sum이고 입력으로 2개의 값을 받으며 결과값은 2개의 입력값을 더한 값이다."

매개변수(parameter)와 인수(arguments)는 혼용해서 사용되는 헷갈리는 용어이므로 잘 기억해 두기로 하자. 매개변수는 함수에 입력으로 전달된 값을 받는 변수를 의미하고 인수는 함수를 호출할 때 전달하는 입력값을 의미한다.

## 입력값(parameter)과 결과값(return)에 따른 함수의 형태

### 입력값 o 결과값 o

```python
def sum(a, b): 
    result = a + b 
    return result
```

결과값을 변수에 담아 사용할 수 있다.

```python
a = sum(3, 4)
print(a)
7
```

### 입력값 o 결과값 x

```python
def sum(a, b): 
    print("%d, %d의 합은 %d입니다." % (a, b, a+b))

sum(3, 4)
```
`3, 4의 합은 7입니다.`

결과값이 없는 함수는 변수에 넣을 수 없다.

```python
a = sum(3, 4)
print(a)
#None
```

### 입력값 x 결과값 o


```python
def say(): 
    return 'Hi'

print(say())
```
`Hi`

### 입력값 x 결과값 x

```python
def say(): 
    print('Hi')
say()
```

`Hi`

## 입력값이 몇 개가 될지 모를 때는?

```python
def sum_many(*args): # args는 arguments의 약자로 관례적으로 자주 사용.
    sum = 0 
    for i in args: 
        sum = sum + i 
    return sum 
```

> 매개변수명 앞에 *을 붙이면 입력값들을 전부 모아서 **튜플**로 만들어 준다.

```python
>>> result = sum_many(1,2,3)
>>> print(result)
6
>>> result = sum_many(1,2,3,4,5,6,7,8,9,10)
>>> print(result)
55
```

## 함수의 결과값은 언제나 하나이다

```python
def sum_and_mul(a,b): 
    return a+b, a*b

result = sum_and_mul(3,4)
print(result)
```
오류발생할까 안할까?
안한다. 튜플값 하나인 (a+b, a*b)로 돌려주기 때문.

`(7, 12)`

## return의 또 다른 쓰임새

어떤 특별한 상황이 되면 함수를 빠져나가고자 할 때는 return을 단독으로 써서 함수를 즉시 빠져나갈 수 있다. 다음 예를 보자.

```python
def say_nick(nick): 
    if nick == "바보": 
        return 
    print("나의 별명은 %s 입니다." % nick)
```

위의 함수는 "별명"을 입력으로 전달받아 출력하는 함수이다. 이 함수 역시 리턴값은 없다(문자열을 출력한다는 것과 리턴값이 있다는 것은 전혀 다른 말이다. 혼동하지 말자. 함수의 리턴값은 오로지 return문에 의해서만 생성된다).

만약에 입력값으로 '바보'라는 값이 들어오면 문자열을 출력하지 않고 함수를 즉시 빠져나간다.

```python
>>> say_nick('야호')
나의 별명은 야호입니다.
>>> say_nick('바보')
>>>
```
이처럼 return으로 함수를 빠져나가는 방법은 실제 프로그래밍에서 자주 사용된다.

## 함수 안에서 선언된 변수의 효력 범위

```python
a = 1
def vartest(a):
    a = a +1

vartest(a)
print(a)
```

결과는 1
함수 안에서 새로 만들어진 매개변수는 함수 안에서만 사용되는 "함수만의 변수"이기 때문이다.

## 함수 안에서 함수 밖의 변수를 변경하는 방법

* return 이용하기

```python
a = 1 
def vartest(a): 
    a = a +1 
    return a

a = vartest(a) 
print(a)
```

* global 명령어 이용하기

```python
a = 1 
def vartest(): 
    global a 
    a = a+1

vartest() 
print(a)
```

## lambda
lambda는 함수를 생성할 때 사용하는 예약어로, def와 동일한 역할을 한다. 보통 함수를 한줄로 간결하게 만들 때 사용한다. 우리말로는 "람다"라고 읽고 def를 사용해야 할 정도로 복잡하지 않거나 def를 사용할 수 없는 곳에 주로 쓰인다. 사용법은 다음과 같다.

```lambda 매개변수1, 매개변수2, ... : 매개변수를 이용한 표현식```

한번 직접 만들어 보자.
```python
>>> sum = lambda a, b : a+b
>>> sum(3,4)
7
```
sum은 두개의 인수를 받아 서로 더한 값을 리턴하는 lambda 함수이다. 위의 예제는 def를 사용한 아래 함수와 하는 일이 완전히 동일하다.
```python
>>> def sum(a, b):
...     return a+b
...
>>>
```

그렇다면 def가 있는데 왜 lambda라는 것이 나오게 되었을까? 이유는 간단하다. lambda는 def 보다 간결하게 사용할 수 있기 때문이다. 또한 lambda는 def를 사용할 수 없는 곳에도 사용할 수 있다. 다음 예제에서 리스트 내에 lambda가 들어간 경우를 살펴보자.

```python
>>> myList = [lambda a,b:a+b, lambda a,b:a*b]
>>> myList
[at 0x811eb2c>, at 0x811eb64>]
```
즉, 리스트 각각의 요소에 lambda 함수를 만들어 바로 사용할 수 있다. 첫 번째 요소 myList[0]은 2개의 입력값을 받아 두 값의 합을 돌려주는 lambda 함수이다.

```python
>>> myList[0]
at 0x811eb2c>
>>> myList[0](3,4)
7
```
두 번째 요소 myList[1]은 2개의 입력값을 받아 두 값의 곱을 돌려주는 lambda 함수이다.

```python
>>> myList[1](3,4)
12
```
파이썬에 익숙해질수록 lambda 함수가 굉장히 편리하다는 사실을 알게 될 것이다.

## 연습문제

[문제1] 홀수 짝수 판별

주어진 자연수가 홀수인지 짝수인지 판별해 주는 함수(is_odd)를 작성하시오.

[풀이]
```python
def is_odd(num):
    if num % 2 ==0:
        return "짝수입니다"
    else:
        return "홀수입니다"

print(is_odd(2))
print(is_odd(3))
```
```
짝수입니다
홀수입니다
```


[문제2] 평균값 계산

입력으로 들어오는 모든 수의 평균값을 계산해 주는 함수를 작성해 보자. (단, 입력으로 들어오는 수의 갯수는 정해져 있지 않다.)

[풀이]
```python
def average(*arg):
    avg = sum(arg) / len(arg)
    return avg

print(average(1, 2, 3, 4, 5, 6))
```
`3.5`

[문제3] 구구단 출력

입력을 자연수 n(2부터 9까지의 자연수)으로 받았을 때, n에 해당되는 구구단을 출력하는 함수를 작성해 보자.

[풀이]
```python
def mul(n):
	for i in range(1, 10):
		print(n * i)

mul(2)
```
```
2
4
6
8
10
12
14
16
18
```

틀린 답
```python
def mul(n):
	for i in range(1, 10):
		return(n * i)

print(mul(2))
```
`18`

단순 print를 하면 for문을 따라서 계속 출력하는 데 비해, return을 쓰면 for의 맨 마지막 부분만 저장되어 출력된다. 꼭 return이 있는 함수를 만들어야 하는 것은 아니구나 라는 것을 배움

[문제4] 피보나치

입력을 정수 n으로 받았을 때, n 이하까지의 피보나치 수열을 출력하는 함수를 작성해 보자.

피보나치 수열은 다음과 같은 순서로 결과값을 리턴한다.

fib(0) → 0 리턴
fib(1) → 1 리턴
fib(2) → fib(0) + fib(1) → 0 + 1 → 1 리턴
fib(3) → fib(1) + fib(2) → 1 + 1 → 2 리턴
fib(4) → fib(2) + fib(3) → 1 + 2 → 3 리턴

[풀이]
```python
#못품
def fib(n):
	if n == 0 :return 0
	if n == 1 :return 1
	return fib(n-2) + fib(n-1) #재귀호출 사용!!!!!

for i in range(10):
	print(fib(i))
```

[문제5] 5보다 큰 수만

다음은 숫자들로 이루어진 리스트를 입력으로 받아 5보다 큰 수만 필터링하여 리턴해 주는 함수이다.

```python
>>> def myfunc(numbers):
...     result = []
...     for number in numbers:
...         if number > 5:
...             result.append(number)
...     return result
... 
>>> myfunc([2,3,4,5,6,7,8])
[6, 7, 8]
````
위 함수를 lambda 함수로 변경해 보시오.

[풀이]
```python
myfunc = lambda numbers:[number for number in numbers if number > 5]
print(myfunc([2, 5, 7, 4, 3, 8, 9]))
```
`[7, 8, 9]'

### 참고자료
* [점프 투 파이썬](https://wikidocs.net/24)
