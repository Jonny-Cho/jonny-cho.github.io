---
layout: post
title: LV2. 조이스틱
category: algorithm
tags: [algorithm]
comments: true
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42860){:target="_blank"}

## 내 풀이

```java
class Solution {
    public int solution(String name) {
        int answer = 0;
        
        int[] arr = nameToArray(name);
        
        int start = startIndex(arr);
        int end = endIndex(arr);
        int beforeZero = beforeZero(arr, start, end);
        int afterZero = afterZero(arr, start, end);
        
        int way = shorterWay(arr, start, end, beforeZero, afterZero);
        for(int i=0; i<arr.length; i++) {
        	answer += arr[i];
        }
        
        answer += way;
        return answer;
    }

	private int[] nameToArray(String name) {
		int[] arr = new int[name.length()];
		for(int i=0; i<name.length(); i++) {
			arr[i] = name.charAt(i) - 'A';
			if(arr[i] > 13) {
				arr[i] = arr[i] - (2 * (arr[i] - 13));
			}
		}
		return arr;
	}
	
	private int startIndex(int[] arr) {
		for(int i=0; i<arr.length; i++) {
			if(arr[i] > 0) return i;
		}
		return 0;
	}
	
	private int endIndex(int[] arr) {
		for(int i=arr.length-1; i>0; i--) {
			if(arr[i] > 0) return i;
		}
		return arr.length-1;
	}
	
	private int beforeZero(int[] arr, int start, int end) {
		
		for(int i=start; i<end; i++) {
			if(arr[i] == 0) {
				return i-1;
			}
		}
		return -1;
	}
	
	private int afterZero(int[] arr, int start, int end) {
		for(int i=start; i<=end; i++) {
			if(arr[i] == 0) {
				for(int j=i; j<=end; j++) {
					if(arr[j] != 0) {
						return j+1;
					}
				}
			}
		}
		return -1;
	}
	
	private int shorterWay(int[] arr, int start, int end, int beforeZero, int afterZero) {
		if(beforeZero == -1 || afterZero == -1) {
			return end;
		}else {
			return Math.min(end, (2*beforeZero+arr.length-afterZero)+1);
		}
	}
}
```

1. 손으로 푼 내용을 어떻게 구현해야할지 모르겠어서
2. 재귀함수 응용법 공부(프로그래머스 - 영리한 프로그래밍을 위한 알고리즘)
3. 3번째 인자에 하나는 +, 하나는 -를 넣으면 된다는 생각을 하는게 어려웠다.

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42860){:target="_blank"}