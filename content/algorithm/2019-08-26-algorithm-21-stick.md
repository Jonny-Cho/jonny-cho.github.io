---
title: LV2. 쇠막대기
date: '2019-08-26 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42585" target="_blank">링크참고 - 프로그래머스</a>

## 내 풀이

```java
class Solution{
	public int solution(String arrangement) {
		int answer = 0;
		
		String[] arr = arrangement.split("");
		
		LinkedList<Integer> stackOpen = new LinkedList<>();
		
		int startIndex = 0;
		int endIndex = 0;
		
		for(int i=0; i<arr.length-1; i++) {
			if(arr[i].equals("(") && arr[i+1].equals("(")) {
				stackOpen.push(i);
			}
			
			if(arr[i].equals(")") && arr[i+1].equals(")")) {
				startIndex = stackOpen.pop();
				endIndex = i+1;
				answer += countRazer(arr, startIndex, endIndex);
			}
		}
		
		return answer;
	}

	private int countRazer(String[] arr, int startIndex, int endIndex) {
		int count = 0;

		for(int i=startIndex; i<endIndex; i++) {
			if(arr[i].equals("(") && arr[i+1].equals(")")) {
				count++;
			}
		}
		
		return count+1;
	}

}
```

## 다른 사람의 풀이

```java
class Solution {
    public static int solution(String arrangement) {
        int answer = 0;
        Stack<Integer> st = new Stack<>();
        for (int i = 0; i < arrangement.length(); i++) {
            if (arrangement.charAt(i) == '(') {
                st.push(i);
            } else if (arrangement.charAt(i) == ')') {
                if (st.peek() + 1 == i) {
                    st.pop();
                    answer += st.size();
                } else {
                    st.pop();
                    answer += 1;
                }
            }
        }
        return answer;
    }
}
```

## 배운점

1. 나는 시작과 끝 index를 구한다음 그 안에 있는 레이저의 갯수를 구하는 방법밖에 생각이 안남... 그러다보니 시간복잡도는 O(n2)에다가 매번 arr을 넘겨주고 있어서 굉장히 비효율적이다.
2. 다른사람의 풀이를 보면 레이저를 만날 때 왼쪽 막대기의 갯수를 더해간다. O(n)으로 끝남.
3. split이나 charArray로 안바꾸고 시작해도 된다.

### 참고

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42585" target="_blank">프로그래머스</a>
