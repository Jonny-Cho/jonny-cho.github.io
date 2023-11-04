---
title: LV2. 카펫
date: '2019-08-27 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42842){:target="_blank"}

## 내 풀이

```java
class Solution {
    public int[] solution(int brown, int red) {
        int[] answer;
        
        int b = ((brown / 2) + 2);
        int c = brown + red;
        
        int discriminant = (int) Math.sqrt((b * b) - (4 * c));
        
        int x = (b + discriminant) / 2;
        int y = (b - discriminant) / 2;
        
        answer = new int[] {x, y};
        
        return answer;
    }
}
```

### 후기

1. 규칙성 찾기
2. 2차방정식 나옴
3. 근의공식사용

* 중학교 수학을 지금 쓸 줄은 몰랐다...
* 완전탐색으로 푸는 방법은 모르겠다.

### 참고

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42842){:target="_blank"}
