---
layout: post
title: python기초 05 딕셔너리 자료형
category: python
tags: [python, 자료형]
---

## 딕셔너리 자료형

* "이름" = "홍길동", "주소" = "어디어디" 등과 같이 대응 되는 관계를 나타내는 자료형. 연관 배열(Associative array) 또는 해시(Hash)라고 한다. 파이썬에서는 딕셔너리(Dictionary)라는 이름을 붙임.

* 리스트나 튜플은 순차적으로(sequential) 해당 요소값을 구하지 않고 Key를 통해 Value를 얻는다. 위의 예에서 "이름"이 Key라면 "홍길동"은 Value.

## 어떻게 만드나?

```python
{Key1:Value1, Key2:Value2, Key3:Value3 ...}

>>> dic = {'name':'pey', 'phone':'01199933323', 'birth':'1118'}

# Value에 리스트도 넣을 수 있다.
>>> a = {'a': [1, 2, 3]}
```

## 딕셔너리 쌍 추가, 삭제하기

* 쌍 추가하기

```python
>>> a = {1: 'a'}
>>> a[2] = 'b'
>>> a
{1: 'a', 2: 'b'}

>>> a['name'] = 'pey'
>>> a
{1: 'a', 2: 'b', 'name': 'pey'}

>>> a[3] = [1, 2, 3]
>>> a
{1: 'a', 2: 'b', 'name': 'pey', 3: [1, 2, 3]}
```

* 삭제하기

```python
>>> del a[1] #여기서 1은 Key값
>>> a
{2: 'b', 'name': 'pey', 3: [1, 2, 3]}
```

## 딕셔너리 사용법

* 딕셔너리에서 Key 사용해 Value 얻기

```python
#딕셔너리 변수[Key]
>>> grade = {'pey': 10, 'julliet': 99}
>>> grade['pey']
10
>>> grade['julliet']
99
```

* 주의사항
    - 중복되는 Key 값은 하나를 제외한 나머지 것들이 모두 무시된다
    - Key에는 변하지 않는 값만 사용할 수 있다. 예를들어 튜플은 사용가능하지만 리스트는 사용할 수 없다.


## 딕셔너리 관련 함수들

* Key 리스트 만들기(keys)

```python
>>> a = ['name': 'pey', 'phone': '01199933323', 'birth': '1118']
>>> a.keys()
dict_keys(['name', 'phone', 'birth'])
#a.keys()는 딕셔너리 a의 Key만을 모아서 dict_keys라는 객체를 리턴한다.
```

* Value 리스트 만들기(values)

```python
>>> a.values()
dict_values(['pey', '01199933323', '1118'])
```

* Key, Value 쌍 얻기(items)

```python
>>> a.items()
dict_items([('name', 'pey'), ('phone', '01199933323'), ('birth', '1118')])
```

* Key: Value 쌍 모두 지우기(clear)

```python
>>> a.clear()
>>> a
{}
```

* Key로 Value얻기(get)

```python
>>> a = {'name':'pey', 'phone':'01199933323', 'birth': '1118'}
>>> a.get('name')
'pey'
>>> a.get('phone')
'01199933323'
#a['name'] 과 동일하다. 차이점은 없는 키로 값을 가져오려고 할 경우, a['nokey']는 Key 오류를 발생시키고 a.get('nokey')는 None을 리턴한다.
```

* 딕셔너리 안에 찾으려는 key 값이 없을 경우 미리 정해 둔 디폴트 값을 대신 가져오게 하고 싶을 때에는 get(x, '디폴트 값')을 사용하면 편리하다.

```python
>>> a.get('foo', 'novalue')
'novalue'
```

* 해당 Key가 딕셔너리 안에 있는지 조사하기(in)

```python
>>> a = {'name':'pey', 'phone':'0119993323', 'birth': '1118'}
>>> 'name' in a
True
>>> 'email' in a
False
```

### 연습문제

[문제1] 딕셔너리 만들기

다음 표를 딕셔너리로 만드시오.

항목 | 값
--- | ---
name | 홍길동
birth | 1128
age | 30

[풀이]
```python
>>> dic = {'name':'홍길동', 'birth':'1128', 'age':'30'}
>>> dic
```

`{'name' = '홍길동', 'birth' = '1128', 'age' = '30'}`

[문제2] 딕셔너리 오류

다음과 같은 딕셔너리 a가 있다.

```python
>>> a = dict()
>>> a
{}
```

다음 중 오류가 발생하는 경우는 어떤 경우인가? 그리고 그 이유를 설명하시오.

1. a['name'] = 'python'
2. a[('a',)] = 'python'
3. a[[1]] = 'python'
4. a[250] = 'python'

[풀이]
```python
>>> a = dict()
>>> a
{}
>>> a['name'] = 'python'
>>> a
{'name': 'python'}
>>> a[('a',)] = 'python'
>>> a
{('a',): 'python', 'name': 'python'}
>>> a[[1]] = 'python'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unhashable type: 'list'
>>> a[250] = 'python'
>>> a
{250: 'python', ('a',): 'python', 'name': 'python'}
```
`딕셔너리의 키 값에는 변하지 않는 자료형만 사용가능하다. 리스트 자료형은 변할 수 있기 때문에 사용불가. 숫자형, 문자열, 튜플은 변하지 않기 때문에 사용가능. 답은 3번`

[문제3] 딕셔너리 값 추출1

딕셔너리 a에서 'B'에 해당되는 값을 추출하고 삭제해 보자.

`>>> a = {'A':90, 'B':80, 'C':70}`

[풀이]
```python
>>> a = {'A':90, 'B':80, 'C':70}
# 값 추출
>>> a['B']
80
>>> a.get('B')
80

# 삭제
>>> del a['B']
>>> a
{'A':90, 'C':70}

# 추출과 삭제 동시에 하려면 pop()
>>> a = {'A':90, 'B':80, 'C':70}
>>> a.pop('B')
80
>>> a
{'A':90, 'C':70}
```
           
[문제4] 딕셔너리 값 추출2

다음은 딕셔너리의 a에서 'C'라는 key에 해당되는 value를 출력하는 프로그램이다.

```python
>>> a = {'A':90, 'B':80}
>>> a['C']
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
KeyError: 'C'
````

a 딕셔너리에는 'C'라는 key가 없으므로 위와 같은 오류가 발생하게 된다. 'C'에 해당되는 키값이 없을 경우 오류 대신 70을 얻을수 있도록 수정해 보자.

[풀이]
```python
#a.get(x, 오류일 때 디폴트 값) 함수 사용
>>> a = {'A':90, 'B':80}
>>> a.get('C', 70)
70
```

[문제5] 딕셔너리 최소값

다음과 같은 딕셔너리 a가 있다.

```python
>>> a = {'A':90, 'B':80, 'C':70}
```
딕셔너리 a의 value중에서 최소 값을 출력하시오.

[풀이]
```python
#모르겠는데? 최소값함수 (min) 같은걸 써야할 것 같은 느낌...

#정답
#딕셔너리의 value를 꺼내려면 values() 함수 사용
>>> a = {'A':90, 'B':80, 'C':70}
>>> a.values()
dict_values([80, 90, 70])

#min()내장함수 사용
>>> min(a.values())
70

```

[문제6] 딕셔너리 리스트 변환

다음과 같은 딕셔너리 a가 있다.
```python
>>> a = {'A':90, 'B':80, 'C':70}
```
위 딕셔너리 a를 다음과 같은 리스트로 만들어보자.

`[('A', 90), ('B', 80), ('C', 70)]`

[풀이]
```python
>>> a = {'A':90, 'B':80, 'C':70}
>>> a.items()
dict_items([('B', 80), ('A', 90), ('C', 70)]) #요건 튜플
# 참고로 순서는 중요하지 않다. 'Key'에 해당하는 'Value'값만 맞으면 됨.

# list 내장함수 이용해서 리스트로 변경
>>> b = list(a.items())
>>> b
[('B', 80), ('A', 90), ('C', 70)] #요게 리스트

# 답과 순서가 다르다 sort()해주자
>>> b.sort()
>>> b
[('A', 90), ('B', 80), ('C', 70)]
```

### 참고자료
* [점프 투 파이썬](https://wikidocs.net/16)
