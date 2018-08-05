---
layout: post
title: python기초 13 클래스
category: python
tags: [python, 클래스]
comments: true
---



## 클래스를 사용하는 이유?

기능 묶기 : 한 프로그램 안에 여러개의 계산기가 사용되는 경우, 같은 기능을 하는 여러개의 함수를 만들어야 하는데, 같은 기능을 클래스로 빼면 중복 없이 사용할 수 있다.

### 계산기의 "더하기" 기능을 구현한 파이썬 코드

```python
result = 0

def add(num):
    global result
    result += num
    return result

print(add(3))
print(add(4))
```

### 만약 한 프로그램에서 2개의 계산기가 필요하다면?
함수를 따로 만들어야 한다.

```python
result1 = 0
result2 = 0

def add1(num):
    global result1
    result1 += num
    return result1

def add2(num):
    global result2
    result2 += num
    return result2

print(add1(3))
print(add1(4))
print(add2(3))
print(add2(7))
```

> add1, add2라는 함수가 생겼고 전역변수 result1, result2가 필요하다.

### 계산기가 10개 필요하다면?
함수 10개 전역변수 10개 필요 -> 비효율적!

```python
class Calculator:
    def __init__(self):
        self.result = 0

    def add(self, num):
        self.result += num
        return self.result

cal1 = Calculator()
cal2 = Calculator()

print(cal1.add(3))
print(cal1.add(4))
print(cal2.add(3))
print(cal2.add(7))
```

> 같은 기능을 Caculator라는 클래스에 넣고 사용할 때는 이 클래스를 다른 변수에(정확히는 인스턴스) 두어 사용하면 된다.
> 코드의 길이도 줄고 수정도 편하다.

## [객체와 인스턴스의 차이]

클래스에 의해서 만들어진 객체를 인스턴스라고도 한다.
인스턴스라는 말은 특정 객체가 **어떤 클래스의 객체**인지를 관계위주로 설명할 때 사용. 위의 코드에서는, "cal1은 인스턴스" 보다는 "cal1은 객체", "cal1은 Caculator의 객체" 보다는 "cal1은 Caculator의 인스턴스" 라는 표현이 어울린다

## 사칙연산 클래스 만들기

### 클래스를 어떻게 만들지 구상하기

1. a = FourCal()처럼 입력해서 a라는 객체를 만든다.
2. a.setdata(4, 2)처럼 입력해서 4와 2라는 숫자를 객체 a에 지정해 준다.
3. a.sum()을 수행하면 두 수를 합한 결과(4 + 2)를 돌려주고
4. a.mul()을 수행하면 두 수를 곱한 결과(4 * 2)를 돌려주고
5. a.sub()를 수행하면 두 수를 뺀 결과(4 - 2)를 돌려주고
6. a.div()를 수행하면 두 수를 나눈 결과(4 / 2)를 돌려준다.

### 클래스 구조 만들기

```python
class FourCal:
    pass
```

### 객체에 숫자 지정할 수 있게 만들기

```python
class FourCal:
    def setdata(self, first, second):
        self.first = first
        self.second = second
```
```python
>>> a = FourCal()
>>> a.setdata(4, 2)
```

이전에 만들었던 FourCal 클래스에서 pass라는 문장을 삭제하고 class 내부에 setdata라는 함수를 만들었다. 클래스 안에 구현된 함수는 다른말로 메서드(Method)라고 부른다.

* self

setdata라는 메서드는 self, first, second라는 총 3개의 매개변수를 필요로 하는데 실제로는 a.setdata(4, 2) 처럼 4와 2라는 2개의 값만 전달해야 한다.

왜 그럴까?

그 이유는 a.setdata(4, 2)처럼 호출하면 setdata 메서드의 첫 번째 매개변수 self에는 setdata메서드를 호출한 객체 a가 자동으로 전달되기 때문이다.

메서드의 첫번째 매개변수에 self를 명시적으로 구현해야 하는 것은 파이썬의 독특한 특징이다.

* setdata

setdata 메서드에는 수행할 문장이 2개 있다.
```python
self.first = first
self.second = second
```
위 문장은 다음과 같이 바뀐다
```python
self.first = 4
self.second = 2
```
위 문장을 풀어서 쓰면
```python
a.first = 4
a.second = 2
```
즉 a객체에는 first와 second라는 객체변수가 생성된다.

> 객체.객체변수 = 값

객체 변수는 다른 객체들에 의해 영향받지 않고 독립적으로 그 값을 유지한다는 점을 꼭 기억하자.

### 더하기 기능 만들기

```python
class FourCal:
    def setdata(self, first, second):
        self.first = first
        self.second = second
    def sum(self):
        result = self.first + self.second
        return result
```

### 곱하기, 빼기, 나누기 기능 만들기

```python
class FourCal:
    def setdata(self, first, second):
        self.first = first
        self.second = second
    def sum(self):
        result = self.first + self.second
        return result
    def mul(self):
        result = self.first * self.second
        return result
    def sub(self):
        result = self.first - self.second
        return result
    def div(self):
        result = self.first / self.second
        return result
```

### 테스트 하기
```python
>>> a = FourCal()
>>> b = FourCal()
>>> a.setdata(4, 2)
>>> b.setdata(3, 7)
>>> a.sum()
6
>>> a.mul()
8
>>> a.sub()
2
>>> a.div()
2
>>> b.sum()
10
>>> b.mul()
21
>>> b.sub()
-4
>>> b.div()
0
```

## 생성자 (Constructor) __init__

```python
>>> a = FourCal()
>>> a.sum()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 6, in sum
AttributeError: 'FourCal' object has no attribute 'first'
```

FourCal 클래스의 인스턴스 a에 setdata메서드를 수행하지 않고 sum 메서드를 수행하면 "AttributeError: 'FourCal' object has no attribute 'first'" 라는 오류가 발생하게 된다. setdata 메서드를 수행해야 객체 a의 객체변수 first와 second이 생성되기 때문이다.

**생성자**란 객체가 생성될 때 자동으로 호출되는 메서드를 의미한다.

```python
class FourCal:
    def __init__(self, first, second): #요부분 바뀜
        self.first = first
        self.second = second
    def sum(self):
        result = self.first + self.second
        return result
    def mul(self):
        result = self.first * self.second
        return result
    def sub(self):
        result = self.first - self.second
        return result
    def div(self):
        result = self.first / self.second
        return result
```

메서드 이름을 `__init__` 으로 했기 때문에 생성자로 인식되어 객체가 생성되는 시점에 자동으로 호출된다.

다음처럼 예제를 수행 해 보자.

```python
>>> a = FourCal()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: __init__() missing 2 required positional arguments: 'first' and 'second'
```

오류 발생 이유는 생성자의 매개변수 first와 second에 해당되는 값이 전달되지 않았기 때문.

오류를 해결하려면 해당되는 값을 전달하여 객체를 생성해야 한다.
```python
>>> a = FourCal(4, 2)
>>> 
```

## 클래스의 상속(Inheritance)

기존 클래스를 변경하지 않고 기능을 추가하거나 기존 기능을 변경할 때 사용

```python
    class MoreFourCal(FourCal): #괄호안에 상속받을 클래스명 입력
        pass
```

### 매서드 오버라이딩

0으로 나눌 때 오류가 아닌 0을 리턴하도록 만들고 싶다면 어떻게 해야 할까?

다음과 같이 FourCal클래스를 상속하는 SafeFourCal클래스를 만들어 보자.

```python
class SafeFourCal(FourCal):
    def div(self):
        if self.second == 0:  # 나누는 값이 0인 경우 0을 리턴하도록 수정
            return 0
        else:
            return self.first / self.second
```

이렇게 부모 클래스(상속한 클래스)에 있는 메서드를 동일한 이름으로 다시 만드는 것을 메서드 오버라이딩(Overriding, 덮어쓰기)이라고 한다.

## 클래스 변수

클래스 변수는 클래스에 의해 생성된 모든 객체에 공유된다는 특징을 갖고 있다.

클래스에서 클래스 변수보다는 객체 변수가 훨씬 중요하다. 실제 실무적인 프로그래밍을 할 때도 클래스 변수보다는 객체 변수를 사용하는 비율이 훨씬 높다.

## 클래스의 활용

다음과 같은 규칙을 지닌 문자열이 있다고 가정하자
`홍길동|42|A`
이름, 나이, 성적을 `|`(파이프문자)로 구분하여 표기한 문자열이다.

이 문자열에서 나이를 추출해 내려면

```python
>>> data = "홍길동|42|A"
>>> tmp = data.split("|")
>>> age = tmp[1]
```

만약 이런 형식의 문자열을 전달하여 나이를 출력해야 하는 함수가 필요하다면 다음과 같이 작성해야 한다.

```python
>>> def print_age(data):
...     tmp = data.split("|")
...     age = tmp[1]
...     print(age)
...
>>> data = "홍길동|42|A"
>>> print_age(data)
42
```

이런 형태의 문자열을 함수 단위로 항상 주고 받아야 한다면 매번 문자열을 split해서 사용해야 하므로 뭔가 개선이 필요하다.
클래스를 이용하면 개선된 코드를 작성할 수 있다.

```python
>>> class Data:
...     def __init__(self, data):
...         tmp = data.split("|")
...         self.name = tmp[0]
...         self.age = tmp[1]
...         self.grade = tmp[2]
...
```

홍길동|42|A 와 같은 문자열을 생성자의 입력으로 받아서 name, age, grade라는 객체변수를 생성하는 Data클래스를 생성하였다.

위처럼 Data 클래스를 만들면 다음처럼 사용할 수 있게 된다.
```python
>>> data = Data("홍길동|42|A")
>>> print(data.age)
42
>>> print(data.name)
홍길동
>>> print(data.grade)
A
```
클래스를 이용했더니 복잡한 문자열을 정형화된 객체로 사용할 수 있게 되었다. 편리하다.

print_age와 print_grade 함수 만들기

```python
>>> def print_age(data):
...     print(data.age)
...
>>> def print_grade(data):
...     print("%s님 당신의 점수는 %s입니다." % (data.name, data.grade))
...
>>> data = Data("홍길동|42|A")
>>> print_age(data)
42
>>> print_grade(data)
홍길동님 당신의 점수는 A입니다.
```

생각해보면 print_age, print_grade 함수를 Data클래스로 이동시켜도 좋을 것 같다. 왜냐하면 print_age나 print_grade라는 함수는 data객체에 의존적인 함수이므로 해당 클래스의 메서드로 만들어 주는것이 유리해 보이기 때문이다.

```python
>>> class Data:
...     def __init__(self, data):
...         tmp = data.split("|")
...         self.name = tmp[0]
...         self.age = tmp[1]
...         self.grade = tmp[2]
...     def print_age(self):
...         print(self.age)
...     def print_grade(self):
...         print("%s님 당신의 점수는 %s입니다." % (self.name, self.grade))
...
```

이제 다음처럼 사용가능
```python
>>> data = Data("홍길동|42|A")
>>> data.print_age()
42
>>> data.print_grade()
홍길동님 당신의 점수는 A입니다.
```

## 연습문제



### 참고자료
* [점프 투 파이썬](https://wikidocs.net/28)