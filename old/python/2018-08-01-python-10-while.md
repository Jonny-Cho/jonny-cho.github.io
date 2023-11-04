---
layout: post
title: python기초 10 while문
category: python
tags: [python, 제어문, while]
---

## while문 기본 구조

```python
treeHit = 0
while treeHit < 10:
    treeHit = treeHit +1
    print("나무를 %d번 찍었습니다." % treeHit)
    if treeHit == 10:
        print("나무 넘어갑니다.")
```

```python
나무를 1번 찍었습니다.
나무를 2번 찍었습니다.
나무를 3번 찍었습니다.
나무를 4번 찍었습니다.
나무를 5번 찍었습니다.
나무를 6번 찍었습니다.
나무를 7번 찍었습니다.
나무를 8번 찍었습니다.
나무를 9번 찍었습니다.
나무를 10번 찍었습니다.
나무 넘어갑니다.
```

## break while문 강제로 빠져나가기

```python
coffee = 10
while True:
    money = int(input("돈을 넣어 주세요: "))
    if money == 300:
        print("커피를 줍니다.")
        coffee = coffee -1
    elif money > 300:
        print("거스름돈 %d를 주고 커피를 줍니다." % (money -300))
        coffee = coffee -1
    else:
        print("돈을 다시 돌려주고 커피를 주지 않습니다.")
        print("남은 커피의 양은 %d개 입니다." % coffee)
    if not coffee:
        print("커피가 다 떨어졌습니다. 판매를 중지 합니다.")
        break
```

## continue 조건에 맞으면 맨 처음으로 돌아가기

```python
a = 0
while a < 10:
    a = a+1
    if a % 2 == 0: continue
    print(a)
```
```
1
3
5
7
9
```

## 연습문제

[문제1] 1부터 100까지 더하기

1부터 100까지의 자연수를 모두 더하고 그 결과를 출력하시오.

[풀이]
```python
num = 0
sum = 0
while num < 100:
    num += 1
    sum = sum + num
print(sum)
```
`5050`

[문제2] 3의 배수의 합

1부터 1000까지의 자연수 중 3의 배수의 합을 구하시오.

[풀이]
```python
num = 0
sum = 0
while num < 1000:
    num += 1
    if (num % 3) != 0: continue
    sum = sum + num
print(sum)
```
`166833`

[문제3] 50점 이상의 총합

다음은 A학급 학생의 점수를 나타내는 리스트이다. 다음 리스트에서 50점 이상의 점수들의 총합을 구하시오.

`A = [20, 55, 67, 82, 45, 33, 90, 87, 100, 25]`

[풀이]
```python
A = [20, 55, 67, 82, 45, 33, 90, 87, 100, 25]
num = -1
sum = 0
while num < 9:
	num += 1
	if A[num] < 50: continue
	sum = sum + A[num]
print(sum)
```
`481`

[문제4] 별 표시하기1

while문을 이용하여 아래와 같이 별(*)을 표시하는 프로그램을 작성해 보자.
```
*
**
***
****
```

[풀이]
```python
num = 0
while num < 4:
	num += 1
	print("*"*num)
```

[문제5] 별 표시하기2

while문을 이용하여 아래와 같이 별(*)을 표시하는 프로그램을 작성해 보자.
```
*******
 *****
  ***
   *
```

[풀이]
```python
num = 8
while num > 0:
	num -= 1
	if num % 2 == 0: continue
	print(" " * ((7 - num) // 2) + "*" * num + " " * ((7 - num) // 2))
```
> 어려웠다. 1) 별을 7개에서 1개까지 출력하기 2) 짝수 걸러내기 3) 빈칸 삽입하기 순으로 진행했다.
3)번에서 TypeError: can't multiply sequence by non-int of type 'float' 타입에러가 나서 생각해보니 그냥 / 으로 나눠져 있어서 // 으로 고쳤다. /으로 나누면 자동으로 float으로 형변환을 해준다.

```python
num = 8
while num > 0:
	num -= 1
	if num % 2 == 0: continue
	print("{0:^7}".format("*"*num))
```
> 가운데 정렬 `"{0:^7}".format("hi")` 이 형식으로 쓰려면 이렇게

### 참고자료
* [점프 투 파이썬](https://wikidocs.net/21)
