---
title: 2019년 9월
date: '2019-09-28 00:00:00'
categories: algorithm
tags: [algorithm]
---

### 1번문제

* 물건과 박스배열이 주어질 때 박스에 넣을 수 있는 물건의 최대 갯수 구하기

```java
public class Test1 {

	public static void main(String[] args) {
		Solution s = new Solution();
		System.out.println(s.solution(new int[] {5, 3, 7}, new int[] {3, 7, 6})); // 3
		System.out.println(s.solution(new int[] {1, 2}, new int[] {2, 3, 1})); // 2
		System.out.println(s.solution(new int[] {3, 8, 6}, new int[] {5, 6, 4})); // 2
	}

}

class Solution{
	
	public int solution(int[] goods, int[] boxes) {
		Arrays.sort(goods);
		Arrays.sort(boxes);
		int answer = 0;
		int i = goods.length-1;
		int j = boxes.length-1;
		while (i >= 0 && j >= 0){
			if(goods[i] <= boxes[j]) {
				answer++;
				j--;
			}
			i--;
		}
		return answer;
	}
	
}

```

### 2번문제

* 비숍의 위치 배열이 주어질 때 비숍이 갈 수 있는 곳을 제외한 체스판 위치의 갯수 구하기
* 비숍이 갈 수 있는 곳을 판단하는 판별식 구현에 1시간 가량 씀(dfs로 해야하나 한번에 풀 수 있는 식이 있나 고민하는 시간이 컸다)
* `if(Math.abs(x - i) == Math.abs(y - j))`

```java
public class Test2 {

	public static void main(String[] args) {
		Solution s = new Solution();
		System.out.println(s.solution(new String[] {"D5"})); //50
		System.out.println(s.solution(new String[] {"D5", "E8", "G2"})); //42
	}

}

class Solution {
    public int solution(String[] bishops) {
        int answer = 0;
        
        // D5를 체스판 위치로 변경
        int [][] positions = new int[bishops.length][2];
        for(int i=0; i<bishops.length; i++) {
        	positions[i][0] = bishops[i].charAt(0)-'A';
        	positions[i][1] = bishops[i].charAt(1)-'1';
        }

	// 체크를 위한 boolean 이차원 배열 만들기
	boolean[][] board = new boolean[8][8];

	for(int k=0; k<positions.length; k++) {
		int x = positions[k][0];
		int y = positions[k][1];
		for(int i=0; i<board.length; i++) {
			for(int j=0; j<board[0].length; j++) {
				// 비숍이 갈 수 있는 곳 판단
				if(Math.abs(x - i) == Math.abs(y - j)) {
					board[i][j] = true;
				}
			}
		}
	}
        
        // boolean 배열의 false 카운트
        for(int i=0; i<board.length; i++) {
        	for(int j=0; j<board[0].length; j++) {
        		if(board[i][j] == false) answer ++;
        	}
        }
        return answer;
    }

}
```

* 여러개의 비숍이 위치할 때 중복을 제거하는 로직 추가가 필요할 것 같다.
* 이 문제에서는 boolean 배열 만들지 않아도 될 것 같다. 체스판의 위치가 필요한게 아니라 갯수만 리턴하면 되니까.

### 3번문제

* 남은 30분동안 못 풀고 끝났는데 dp를 공부하고나서 다시 푸니까 너무 빨리 풀려버림... 아쉽다
* dp공부는 이 블로그를 참고 <a href="https://kwanghyuk.tistory.com/4" target="_blank">KHAN(광혁) - 백준 2579번 계단오르기</a>
* 문제는 이 문제를 1차원 배열로 줄여놓은 것 <a href="https://www.acmicpc.net/problem/9465" target="_blank">백준 9465번 - 스티커</a>

```java
public class Test3 {

	public static void main(String[] args) {
		Solution s = new Solution();
		System.out.println(s.solution(new int[] {12, 12, 12, 12, 12})); //36
		System.out.println(s.solution(new int[] {12, 80, 14, 22, 100})); //180
	}

}

class Solution {
    public int solution(int[] sticker) {
        int[] dp = new int[sticker.length];
        dp[0] = sticker[0];
        dp[1] = Math.max(dp[0], sticker[1]);
        for(int i=2; i<sticker.length; i++) {
        	dp[i] = Math.max(dp[i-2] + sticker[i], dp[i-1]);
        }
        return dp[sticker.length-1];
    }
}
```

* 난이도가 높지 않았는데 시간내에 못풀어서 아쉬움이 크다.
* 그래도 이 정도로 성장했구나 확인할 수 있었던 시간이었다.
