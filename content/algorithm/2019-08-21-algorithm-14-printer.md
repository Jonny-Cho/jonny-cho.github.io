---
title: LV2. 프린터
date: '2019-08-21 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42587){:target="_blank"}

## 내 풀이

```java
class Solution {
    public int solution(int[] priorities, int location) {
    int answer = 0;
		LinkedList<HashMap<Integer, Integer>> q = new LinkedList<>();
		LinkedList<HashMap<Integer, Integer>> answerQ = new LinkedList<>();
		
		LinkedHashMap<Integer, Integer> hm;
		
		for(int i=0; i<priorities.length; i++) {
			hm = new LinkedHashMap<>();
			hm.put(i, priorities[i]);
			q.add(hm);
		}
		
		while(q.size() > 0) {
			int count = 0;
			for(int i=1; i<q.size(); i++) {
				if((int)q.get(0).values().toArray()[0] < (int)q.get(i).values().toArray()[0]) {
					count++;
					if(count > 0) break;
				}
			}
			if(count == 0) {
				answerQ.offer(q.poll());
			} else {
				q.offer(q.poll());
			}
		}
		
		for(int i=0; i<answerQ.size(); i++) {
			if(answerQ.get(i).get(location) != null) {
				answer = i+1;
				break;
			}
		}
		
		return answer;
    }
}
```

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42587){:target="_blank"}
