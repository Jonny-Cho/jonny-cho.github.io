---
layout: post
title: python기초 02 문자열 자료형
category: python
tags: [python, 자료형]
---

## 문자열(String)은
* 따옴표로 싸여있으면 전부 문자열이다

```python

"파이썬" # 큰따옴표
'Python' # 작은따옴표
"123" # 숫자처럼 보이지만 문자열

# 따옴표 3개 연속으로 쓰면 긴 문자열도 사용가능
"""
Life is too short,
You need python
"""

'''
Life is too short,
You need python
'''

# 따옴표를 문자열 내에 사용하고 싶을때 따옴표 3개를 쓰면 유용
"""
"This is Jonny's blog"
"""
# \'(백슬래시+따옴표)를 써도 된다.
'This is Jonny\'s blog'
"This is Jonny\"s blog"

```

## 문자열 연산하기
* 문자열 더하고 곱하기

```python

#문자열 더하기
>>> head = "Cafe"
>>> tail = " latte" #띄어쓰기를 위해 문자앞 공백을 넣었다
>>> head + tail
'Cafe latte'

#문자열 곱하기
>>> a = "macbook"
>>> a * 2
'macbookmacbook'

```

## 문자열 인덱싱(Indexing)과 슬라이싱(Slicing)

* 인덱싱은 가리키다, 슬라이싱은 잘라낸다는 의미이다

```python
#인덱싱
>>>a = "Life is too short, You need Python"
>>>a[3]
'e' #0부터 셈 주의
>>>a[-1]
'n' #뒤에서 첫 번째 문자
>>>a[-0]
'L' #0과 -0은 똑같다

#슬라이싱
>>> b = "Life is too short, You need Python"
>>> b[0:4]
'Life' #맨 마지막 숫자 포함 안함 주의 0 <= a < 4
>>> b[0:5]
'Life ' #공백도 문자

>>> b[19:]
'You need Python'
>>> b[:17]
'Life is too short'
>>> b[:]
'Life is too short, You need Python'
>>> b[19:-7]
'You need' #-8(-7왼쪽) 까지

#슬라이싱으로 문자열 나누기
>>> c = "20180731Rainy"
>>> date = a[:8]
>>> weather = a[8:]
>>> date
'20180731'
>>> weather
'Rainy'
```

## 문자열 포매팅
* 문자열 내의 특정한 값을 바꿔야 할 경우 사용한다

```python
# 간단하게 넣기
>>> "I eat %s apples." % 3
'I eat 3 apples.'

#공백 넣기
>>> "%10s" % "hi"
'          hi'
```

* format 함수를 이용한 포매팅

```python
>>> "I eat {} apples".format(3)
'I eat 3 apples'
>>> "I eat {} apples".format("five")
'I eat five apples'
>>> number = 3
>>> "I eat {} apples".format(number)
'I eat 3 apples'
>>> number = 10
>>> day = "three"
>>> "I ate {} apples. so I was sick for {} days.".format(number, day)
'I ate 10 apples. so I was sick for three days.'
#이름으로 넣기
>>> "I ate {number} apples. so I was sick for {day} days.".format(number=10, day=3)
'I ate 10 apples. so I was sick for 3 days.'
```

* f 문자열 포매팅 (파이썬 3.6 이상)

```python
>>> name = '홍길동'
>>> age = 30
>>> f'나의 이름은 {name}, 나이는 {age}입니다.'
'나의 이름은 홍길동, 나이는 30입니다.'
# 표현식 지원
>>> f'나의 이름은 {name}, 나이는 {age+1}입니다.'
'나의 이름은 홍길동, 나이는 31입니다.'
```

## 문자열 관련 함수들

```python
#b의 개수 세기
>>> a = "hobby"
>>> a.count('b')
2

#위치 알려주기1(find)
>>> a = "Python is the best choice"
>>> a.find('b')
14
>>> a.find('k')
-1 #k가 없으면 -1 반환

#위치 알려주기2(index)
>>> a = "Life is too short"
>>> a.index('t')
8
>>> a.index('k')
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
ValueError: substring not found #k가 없으면 오류 발생

#문자열 삽입(join)
>>> a= ","
>>> a.join('abcd')
'a,b,c,d'

#대문자로 바꾸기(upper)
>>> a = "hi"
>>> a.upper()
'HI'

#소문자로 바꾸기(lower)
>>> a = "HI"
>>> a.lower()
'hi'

#문자열 바꾸기(replace)
>>> a = "Samsung is the best"
>>> a.replace("Samsung", "Apple")
'Apple is the best'

#문자열 나누기(split)
>>> a = "Life is too short"
>>> a.split()
['Life', 'is', 'too', 'short'] #공백을 기준으로 리스트를 만든다
>>> a = "a:b:c:d"
>>> a.split(':') #:를 기준으로 리스트를 만든다
['a', 'b', 'c', 'd']
```

### 연습문제

[문제1] 다음과 같은 문자열을 출력하시오
`"점프 투 파이썬" 문제를 풀어보자`

[풀이]
```python
print('"점프 투 파이썬" 문제를 풀어보자')
```
`"점프 투 파이썬" 문제를 풀어보자`

[문제2] 다음과 같은 문자열을 출력하시오
```
Life is too short
You need Python
```

[풀이]
```python
print("""Life is too short
You need Python""")
```
```
Life is too short
You need Python
```

[문제3] 공백 추가
6개의 문자로 이루어진 "PYTHON"이라는 문자열이 있다.
이 "PYTHON"이라는 문자열 앞에 공백 24개를 추가하여 30자리의 문자열로 만드시오.

[풀이]
```python
print("%30s" % "PYTHON") # 총 30개의 자리를 만들고 그 자리 끝에 PYTHON 출력
print(" " * 24 + "PYTHON") # 공백 24개를 만들고 그 뒤에 PYTHON 출력
print("{}PYTHON".format(" "*24))
```

```
'                        PYTHON'
'                        PYTHON'
'                        PYTHON'
```                        

[문제4] 문자열 나누기
홍길동 씨의 주민등록번호는 881120-1068234이다. 홍길동씨의 주민등록번호를 연월일(YYYYMMDD) 부분과 그 뒤의 숫자 부분으로 나누어 출력해 보자.

[풀이]

```python
id = "881120-1168234"
ymd = id[:6]
num = id[7:]
print(ymd)
print(num)
```

```
881120
1168234
```

[문제5] 문자열 찾기
다음의 문자열에서 "short"라는 문자열이 시작되는 인덱스를 구하시오.

`Life is too short, you need python`

[풀이]

```python
a = "Life is too short, you need python"
b = a.find("short")
print(b)
```

`12`

[문제6] 문자열 바꾸기1
`a:b:c:d` 문자열의 replace 함수를 이용하여 `a#b#c#d` 와 같이 고치시오

[풀이]

```python
a = "a:b:c:d"
b = a.replace(":","#")
print(b)
```

```
'a#b#c#d'
```

[문제6] 문자열 바꾸기2
`a:b:c:d` 문자열의 splite와 join 함수를 이용하여 `a#b#c#d` 와 같이 고치시오

[풀이]

```python
a = "a:b:c:d"
b = a.split(":")
c = "#"
d = c.join(b)
print(d)
```

```
'a#b#c#d'
```

<!-- 주석 [^1] -->
<!-- 인용 > -->


### 참고자료
* [점프 투 파이썬](https://wikidocs.net/13)
