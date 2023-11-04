---
title: LV2. 타겟넘버
date: '2019-08-28 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* <a href="https://programmers.co.kr/learn/courses/30/lessons/43165" target="_blank">링크참고 - 프로그래머스</a>

## 내 풀이

```java
class Solution {
    public int solution(int[] numbers, int target) {
        int answer = 0;
        
        answer = countTargetNumber(numbers, target);
        
        return answer;
    }

	private int countTargetNumber(int[] numbers, int target) {
		return countTargetNumber(numbers, 0, 0, target);
	}

	private int countTargetNumber(int[] numbers, int begin, int sum, int target) {
		if(begin == numbers.length) {
			if(target == sum) {
				return 1;
			} else {
				return 0;
			}
		}
		else {
			return countTargetNumber(numbers, begin+1, sum+numbers[begin] , target) + countTargetNumber(numbers, begin+1, sum-numbers[begin] , target);
		}
	}
}
```

1. 손으로 푼 내용을 어떻게 구현해야할지 모르겠어서
2. 재귀함수 응용법 공부(프로그래머스 - 영리한 프로그래밍을 위한 알고리즘)
3. 3번째 인자에 하나는 +, 하나는 -를 넣으면 된다는 생각을 하는게 어려웠다.

### 참고

* <a href="https://programmers.co.kr/learn/courses/30/lessons/43165" target="_blank">프로그래머스</a>
