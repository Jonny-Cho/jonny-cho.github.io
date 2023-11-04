---
title: LV2. 기능개발
date: '2019-08-21 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42586){:target="_blank"}

## 내 풀이

```java
class Solution {
    public int[] solution(int[] progresses, int[] speeds) {
        int[] answer;
        ArrayList<Integer> al = new ArrayList<>();
        int[] tempArr = new int[progresses.length];
        
        for(int i=0; i<progresses.length; i++) {
        	tempArr[i] = (99 - progresses[i]) / speeds[i] + 1 ;
        }
        
        loop : for(int i=0; i<tempArr.length; i++) {
        	int count = 1;
        	for(int j=i+1; j<tempArr.length; j++) {
        		if(tempArr[i] >= tempArr[j]) {
        			count++;
        			if(j == tempArr.length-1) {
        				al.add(count);
        				break loop;
        			}
        		} else {
        			al.add(count);
        			i = j;
        			count = 1;
        		}
        	}
        	
        	if(count == tempArr.length - i) {
        		al.add(count);
        		break;
        	}
        }
        
        answer = new int[al.size()];
        for(int i=0; i<answer.length; i++) {
        	answer[i] = al.get(i);
        }
        return answer;
    }
}
```

* 개선해야할 게 많다...

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42586){:target="_blank"}
