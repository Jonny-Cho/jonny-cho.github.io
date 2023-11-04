---
title: LV2. 조이스틱
date: '2019-09-03 00:00:00'
categories: algorithm
tags: [algorithm]
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

1. 알파벳을 최소 이동거리로 치환하는 로직
2. 오른쪽으로 계속 이동하면서 가는게 최소이동거리인지 오른쪽으로 갔다가 다시 왼쪽으로 백해서 가는게 최소이동 거리인지 판단해야함
3. 테스트케이스 11 에서 한참 막혀서 확인해보니 "AAABAAA" 가 4 인경우를 생각 안했음. 필요한 변수가 총 4개 였음... 더 줄일 수 있을 것 같은데...

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42860){:target="_blank"}
