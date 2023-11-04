---
title: LV2. 전화번호 목록
date: '2019-08-21 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42577){: target="_blank"}
* [Google][]
* [Google]: http://google.com/
* <a href="https://google.com" target="_blank">새창에서 열려랴 얍</a>

## 내 풀이

```java
class Solution {
    public boolean solution(String[] phone_book) {
       boolean answer = true;
		for(int i=0; i<phone_book.length; i++) {
			for(int j=0; j<phone_book.length; j++) {
				if(i!=j && phone_book[i].length() <= phone_book[j].length()) {
					if(phone_book[j].startsWith(phone_book[i])) {
						answer = false;
						break;
					}
				} else if(i!=j && phone_book[i].length() > phone_book[j].length()) {
					if(phone_book[i].startsWith(phone_book[j])) {
						answer = false;
						break;
					}
				}
			}
		}
		return answer;
    }
}
```

### 참고

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42577" target="_blank">프로그래머스</a>
