---
title: LV1. K번째 수
date: '2019-08-21 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42748" target="_blank">링크참고 - 프로그래머스</a>

## 내 풀이

```java
class Solution {
    public int[] solution(int[] array, int[][] commands) {
        int[] answer = new int[commands.length];

        int[] tempArr;
        for(int i=0; i<commands.length; i++) {
    		int start = commands[i][0]-1;
    		int end = commands[i][1]-1;
    		int target = commands[i][2]-1;
        	
        	tempArr = new int[end - start + 1];
        	for(int k=0; k<tempArr.length; k++) {
        		tempArr[k] = array[k + start];
        	}
        	
        	Arrays.sort(tempArr);
        	answer[i] = tempArr[target];
        }
        
        return answer;
    }
}
```

### 참고

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42748" target="_blank">프로그래머스</a>
