---
title: LV2. 큰 수 만들기
date: '2019-09-03 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42883){:target="_blank"}

## 내 풀이

```java
class Solution {
    public String solution(String number, int k) {
    	int index = 0;
		StringBuilder answer = new StringBuilder();
		int maxIndex = -1;
		int cntDeletedNumber = 0;
		while(index < number.length() - k) {
			int maxNum = 0;
			for(int i=index; i<=index+k; i++) {
				maxNum = Math.max(maxNum, number.charAt(i)-'0');
			}
			for(int i=index; i<=index+k; i++) {
				if(number.charAt(i)-'0'==maxNum) {
					cntDeletedNumber = i - maxIndex - 1;
					maxIndex = i;
					break;
				}
			}
			answer.append(maxNum);
			k -= cntDeletedNumber;
			index = maxIndex+1;
		}
		return answer.toString();
    }
}
```

* maxIndex를 -1로 초기화 했다는게 너무 마음에 안든다.

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42883){:target="_blank"}
