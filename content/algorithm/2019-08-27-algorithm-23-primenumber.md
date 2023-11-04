---
title: LV2. 소수만들기
date: '2019-08-27 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12977){:target="_blank"}

## 내 풀이

```java
class Solution {
    public int solution(int[] nums) {
        int answer = 0;
        
        List<Integer> list = new ArrayList<>();
        
        combination(nums, 3, list);
        
        for(int i : list) {
        	if(checkPrimeNumber(i)) answer ++;
        }
        
        return answer;
    }

	public static boolean checkPrimeNumber(int number) {
		for (int i=2; i<number/2; i++) {
			if(number % i == 0) return false;
		}
		return true;
	}

	public static int combination(int[] arr, int destNum, List<Integer> list) {
		int[] temp = new int[destNum];
		return combination(arr,0,destNum,temp, list);
	}
    
    public static int combination(int[] arr, int curLoc, int destNum, int[] temp, List<Integer> list) {
    	int sum = 0;
    	
		if(destNum==0) {
			for(int i = 0; i < temp.length; i++) {
				sum += arr[temp[i]];
			}
			list.add(sum);
			return sum;
		}

		for(int i = curLoc; i < arr.length; i++) {
			temp[temp.length-destNum] = i;
			combination(arr,i+1,destNum-1, temp, list);
		}
		
		return sum;
	}
    
}
```

1. 재귀함수 사용해서 경우의 수 조합(Combination)
2. 배열의 합을 리스트로 담아놓고
3. 소수 판별 후 카운트

* 소수 판별 시간복잡도 줄이기(에라토스테네스의 체)

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12977){:target="_blank"}
