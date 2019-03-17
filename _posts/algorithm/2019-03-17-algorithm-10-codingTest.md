---
layout: post
title: 코딩테스트 기록
category: algorithm
tags: [algorithm]
comments: true
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
* 중에서 가장 큰숫자가 자신의 숫자
* 두명이서 대결했을 때 A가 이기면 1, B가 이기면 2, 무승부는 0, 예외사항은 -1출력

* 요거 풀다가 시간이 끝났는데 오늘 풀어봐야겠다.