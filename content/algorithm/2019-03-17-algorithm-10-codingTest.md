---
title: 코딩테스트 기록
date: '2019-03-17 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 거스름돈

* 노가다로 품. 자바의 정석에 있는 문제인데 생각이 안나고 시간도 없어서 ㅠㅠ

```java
public static int[] coin(int money){
	int[] answer = new int[9];

	int cnt50000 = 0;
	int cnt10000 = 0;
	int cnt5000 = 0;
	int cnt1000 = 0;
	int cnt500 = 0;
	int cnt100 = 0;
	int cnt50 = 0;
	int cnt10 = 0;
	int cnt1 = 0;

	cnt50000 = money / 50000;
	money -= 50000*cnt50000;
	cnt10000 = money / 10000;
	money -= 10000*cnt10000;
	cnt5000 = money / 5000;
	money -= 5000*cnt5000;
	cnt1000 = money / 1000;
	money -= 1000*cnt1000;
	cnt500 = money / 500;
	money -= 500*cnt500;
	cnt100 = money / 100;
	money -= 100*cnt100;
	cnt50 = money / 50;
	money -= 50*cnt50;
	cnt10 = money / 10;
	money -= 10*cnt10;
	cnt1 = money / 1;
	money -= 1*cnt1;

	answer[0] = cnt50000;
	answer[1] = cnt10000;
	answer[2] = cnt5000;
	answer[3] = cnt1000;
	answer[4] = cnt500;
	answer[5] = cnt100;
	answer[6] = cnt50;
	answer[7] = cnt10;
	answer[8] = cnt1;

	return answer;
}
```

* 개선해보자

1. int형 배열을 선언하고 거스름돈의 단위를 넣은 다음
1. 배열의 값을 하나씩 꺼내면서 money 를 값으로 나눈 값을 차례대로 출력하고
1. money에 그 동전 단위로 나눈 나머지값으로 재설정해준다.

```java
public static int[] coin2(int money){
	int[] coinUnit = {50000, 10000, 5000, 1000, 500, 100, 50, 10, 1};
	int[] answer = new int[coinUnit.length];

	for(int i=0; i<coinUnit.length; i++){
		answer[i] = money / coinUnit[i];
		money %= coinUnit[i];
	}

	return answer;
}
```

## 369 박수 친 횟수 세기

* 13을 입력받으면 1부터 13까지 연속되는 숫자를 스트링으로 다 몰아넣고 그 중에서 3, 6, 9가 몇개인지 셈
* string -> char로 바꾸는 과정 없이도 풀 수 있을 것 같음

```java
public static int numGame(int number){
	int answer = 0;
	String numberStr = "";

	// String += 변환후 3, 6, 9 숫자 카운팅
	for(int i=1; i<=number; i++){
		numberStr += String.valueOf(i);
	}

	char[] numberChar = numberStr.toCharArray();

	for(int i=0; i<numberChar.length; i++){
		if(numberChar[i] == '3' || numberChar[i] == '6' || numberChar[i] == '9'){
			answer++;
		}
	}

	return answer;
}
```

## 암호풀기

* abccbd 라는 암호가 있으면
* (cc가 인접해 있으니) abbd로 바뀌고
* (다시 bb가 인접해 있으니) 결국 ad가 최종 결과가 되는 암호풀기

* ArrayList를 스택처럼 사용하고 String으로 옮김

```java
public static String stringCryptogram(String cryptogram){
	String answer = "";

	char[] strChar = cryptogram.toCharArray();
	ArrayList<Character> st = new ArrayList<>();

	for(int i=0; i<strChar.length; i++){
		if(i==0){
			st.add(strChar[0]);
		} else {
			if(st.get(st.size()-1) != strChar[i]){
				st.add(strChar[i]);
			} else {
				st.remove(st.size()-1);
			}
		}
	}

	for(char s : st){
		answer += s;
	}

	return answer;
}
```

## 청개구리 알파벳

* A는 Z로, Z는 A로 바뀜
* a는 z로, z는 a로 바뀜

* 대문자, 소문자별 유니코드 찾아보고
* z,Z 보다 1큰 숫자에서 자기자신의 유니코드를 뺌
* 대문자, 소문자를 한번에 풀 수도 있을 것 같은데..

```java
public static String prog(String word){
	String answer = "";

	char[] strChar = word.toCharArray();

	for(int i=0; i<strChar.length; i++){
		// 대문자
		if(65 <= (int)strChar[i] && (int)strChar[i] <= 90){
			strChar[i] = (char)(155 - (int)strChar[i]);
		}
		// 소문자
		if(97 <= (int)strChar[i] && (int)strChar[i] <= 122){
			strChar[i] = (char)(219 - (int)strChar[i]);
		}

		answer += Character.toString(strChar[i]);
	}

	return answer;
}
```

## 책으로 내기하기

* 책을 무작위로 딱 펴서
* 왼쪽 페이지 각 자리 숫자의 합, 곱
* 오른쪽 페이지 각 자리 숫자의 합, 곱
* 중에서 가장 큰 숫자가 자신의 숫자
* 두명이서 대결했을 때 A가 이기면 1, B가 이기면 2, 무승부는 0, 예외사항은 -1출력

* 요거 풀다가 시간이 끝났는데 오늘 풀어봐야겠다.

* 풀었음. 합, 곱을 다른 메서드로 빼야하는구만.

```java
public class Main {
	public static void main(String[] args) {
		System.out.println(bookGame(new int[]{97, 98}, new int[]{197,198})); // 0
		System.out.println(bookGame(new int[]{131, 132}, new int[]{211,212})); // 1
		System.out.println(bookGame(new int[]{99, 102}, new int[]{211,212})); // -1
	}

	public static int bookGame(int[] pobi, int[] crong){
		int answer = 0;
		int[] pobiNum = new int[4];
		int[] crongNum = new int[4];

		if(pobi[0] % 2 == 1 && pobi[0] + 1 == pobi[1] && crong[0] % 2 == 1 && crong[0] + 1 == crong[1]){
			// 왼합, 왼곱, 오른합, 오른곱
			pobiNum[0] = calBookSum(pobi[0]);
			pobiNum[1] = calBookMul(pobi[0]);
			pobiNum[2] = calBookSum(pobi[1]);
			pobiNum[3] = calBookMul(pobi[1]);

			crongNum[0] = calBookSum(crong[0]);
			crongNum[1] = calBookMul(crong[0]);
			crongNum[2] = calBookSum(crong[1]);
			crongNum[3] = calBookMul(crong[1]);

			Arrays.sort(pobiNum);
			Arrays.sort(crongNum);

			if(pobiNum[3] == crongNum[3]){
				answer = 0;
			} else if(pobiNum[3] > crongNum[3]){
				answer = 1;
			} else {
				answer = 2;
			}

		} else {
			answer = -1;
		}

		return answer;
	}

	public static int calBookSum(int pageNum){
		int pageSum = 0;

		while(pageNum != 0){
			pageSum += pageNum % 10;
			pageNum /= 10;
		}

		return pageSum;
	}

	public static int calBookMul(int pageNum){
		int pageSum = 1;

		while(pageNum != 0){
			pageSum *= pageNum % 10;
			pageNum /= 10;
		}

		return pageSum;
	}
}
```
