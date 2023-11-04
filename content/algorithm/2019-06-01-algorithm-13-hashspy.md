---
title: LV2. 위장
date: '2019-06-01 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명

스파이들은 매일 다른 옷을 조합하여 입어 자신을 위장합니다.

예를 들어 스파이가 가진 옷이 아래와 같고 오늘 스파이가 동그란 안경, 긴 코트, 파란색 티셔츠를 입었다면 다음날은 청바지를 추가로 입거나 동그란 안경 대신 검정 선글라스를 착용하거나 해야 합니다

종류 | 이름
--- | ---
얼굴 | 동그란 안경, 검정 선글라스
상의 | 파란색 티셔츠
하의 | 청바지
겉옷 | 긴 코트

스파이가 가진 의상들이 담긴 2차원 배열 clothes가 주어질 때 서로 다른 옷의 조합의 수를 return 하도록 solution 함수를 작성해주세요.



### 제한 조건

* clothes의 각 행은 [의상의 이름, 의상의 종류]로 이루어져 있습니다.
* 스파이가 가진 의상의 수는 1개 이상 30개 이하입니다.
* 같은 이름을 가진 의상은 존재하지 않습니다.
* clothes의 모든 원소는 문자열로 이루어져 있습니다.
* 모든 문자열의 길이는 1 이상 20 이하인 자연수이고 알파벳 소문자 또는 '_' * 로만 이루어져 있습니다.
* 스파이는 하루에 최소 한 개의 의상은 입습니다.

### 입출력 예

clothes | return
--- | ---
[["yello_hat", "headgear"],["green_turban", "headgear"],["red_turban", "headgear"],["blue_sunglasses", "eyewear"],["green_sunglasses", "eyewear"],["short", "pants"],["long", "pants"]] | 35
[["yello_hat", "headgear"],["blue_sunglasses", "eyewear"],["green_turban", "headgear"]] | 5

## 풀이

```java
class Solution {
    public int solution(String[][] clothes) {
		int answer = 1;
		int val;
		HashMap<String, Integer> hm = new HashMap<>();
		
		for (String[] a : clothes) {
			val = 1;
			if(hm.containsKey(a[1])) val = hm.get(a[1]) + 1;
			hm.put(a[1], val);
		}
		
		for(String s : hm.keySet()) {
			System.out.println(hm.get(s)+1);
			answer *= hm.get(s)+1;
		}
		
		answer--;
		
		return answer;
    }
}
```

### 틀림의 역사

1. 경우의 수로 나눠서 풀려다가 실패. 1개씩 선택 + 2개씩 선택 + 3개씩 선택 ... 답없음
2. 1시간동안 공책에 끄적이다가 도저히 안되겠어서 공식이 있는지 검색
3. 선택안하는 경우를 미리 더해서 곱하는게 포인트였음... 마지막엔 모두 선택안하는 1가지의 경우를 빼주기
4. a, b, c개 있을 경우 (a+1)(b+1)(c+1)-1
5. 이 공식을 찾는게 앞으로의 할 일이구나 라는 걸 깨달음
6. 구현하는건 금방함

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42578){:target="_blank"}
