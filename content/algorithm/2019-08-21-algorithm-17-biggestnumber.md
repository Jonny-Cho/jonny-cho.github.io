---
title: LV2. 가장 큰 수
date: '2019-08-21 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42746" target="_blank">링크참고 - 프로그래머스</a>

## 내 풀이

```java
class Solution{
	
	public String solution(int[] numArr) {
		String answer = "";
		
		quickSort(numArr);

		// 모두 0인경우
		for(int i=0, count=0; i<numArr.length; i++) {
			if(numArr[i] == 0) count++ ;
			if(count == numArr.length) return "0";
		}
		
		for(int i : numArr) {
			answer += String.valueOf(i);
		}
		
		return answer;
	}
	
	private static void quickSort(int[] arr) {
		quickSort(arr, 0, arr.length - 1);
	}

	private static void quickSort(int[] arr, int start, int end) {
		int part2 = partition(arr, start, end);
		if(start < part2 - 1) quickSort(arr, start, part2 - 1);
		if(part2 < end) quickSort(arr, part2, end);
	}

	private static int partition(int[] arr, int start, int end) {
		int pivot = arr[(start + end) / 2];
		while(start <= end) {
			while(custom(arr[start], pivot)) {
				start++;
			}
			while(custom(pivot, arr[end])) {
				end--;
			}
			if(start <= end) {
				swap(arr, start, end);
				start++;
				end--;
			}
		}
		return start;
	}

	private static boolean custom(int arrStart, int pivot) {
		
		String strA = String.valueOf(arrStart);
		String strB = String.valueOf(pivot);

		if(Integer.parseInt(strA + strB) <= Integer.parseInt(strB + strA)) {
			return false;
		}
		
		return true;
	}

	private static void swap(int[] arr, int start, int end) {
		int tmp = arr[start];
		arr[start] = arr[end];
		arr[end] = tmp;
	}
	
}
```

### 참고

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42746" target="_blank">프로그래머스</a>
