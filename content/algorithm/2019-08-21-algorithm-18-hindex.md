---
title: LV2. H-Index
date: '2019-08-21 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42747" target="_blank">링크참고 - 프로그래머스</a>

## 내 풀이

```java
class Solution {
    public int solution(int[] citations) {
        int answer = 0;
        
        Arrays.sort(citations);
        for(int i=0; i<citations.length; i++) {
        	if(citations[i] >= citations.length - i) {
        		answer = citations.length - i;
        		break;
        	}
        }
        
        return answer;
    }
}
```

### 참고

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42747" target="_blank">프로그래머스</a>
