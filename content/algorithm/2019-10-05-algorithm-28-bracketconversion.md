---
title: 2020 카카오 - 괄호 변환
date: '2019-10-05 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명 및 제한 조건

* [링크참고 - 프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/60058?language=java){:target="_blank"}

```java
public class BracketConversion {

	public static void main(String[] args) {
		Solution s = new Solution();
		System.out.println(s.solution("(()())()")); // "(()())()"
		System.out.println(s.solution("")); // ""
		System.out.println(s.solution(")(")); // "()"
		System.out.println(s.solution("()))((()")); // "()(())()"
	}

}

class Solution {
	public String solution(String p) {
			if(rightBracket(p)) return p;
			else return convertBracket(p);
	}

	private boolean rightBracket(String p) {
		int tempInt = 0;
		for(int i=0; i<p.length(); i++) {
			if(tempInt < 0) return false;
			if(p.charAt(i) == '(') tempInt++;
			if(p.charAt(i) == ')') tempInt--;
		}
		return true;
	}
	
	private String convertBracket(String p) {
		if ("".equals(p)) return "";

		String u = balancedBracket(p);
		String v = p.substring(u.length());
		
		StringBuilder sb = new StringBuilder();
		if(rightBracket(u)) {
			sb.append(u);
			sb.append(convertBracket(v));
			return sb.toString();
		}
		else {
			sb.append("(");
			sb.append(convertBracket(v));
			sb.append(")");
			sb.append(removeAndReverse(u));
			return sb.toString();
		}
	}

	private String balancedBracket(String w) {
		StringBuilder sb = new StringBuilder();
		int tempInt = 0;
		for(int i=0; i<w.length(); i++) {
			char c = w.charAt(i);
			if(c == '(') tempInt ++;
			if(c == ')') tempInt --;
			sb.append(c);
			if(i >= 1 && tempInt == 0) return sb.toString();
		}
		return sb.toString();
	}
	
	private String removeAndReverse(String u) {
		StringBuilder sb = new StringBuilder();
		String center = u.substring(1, u.length()-1);
		for(int i=0; i<center.length(); i++) {
			if(center.charAt(i) == '(') sb.append(')');
			if(center.charAt(i) == ')') sb.append('(');
		}
		return sb.toString();
	}
}
```

* 대략 1시간 사용
* 구현방법이 상세하게 적혀있어서 '어? 이렇게하면 풀린다고? 그렇구만... 왜지?' 하면서 구현했다.
* [우아한테크세미나 - 190425 TDD 리팩토링 by 자바지기 박재성님
](https://www.youtube.com/watch?v=bIeqAlmNRrA&t=2003s){:target="_blank"} 에 나온대로 메서드를 최대한 나누려고 노력 지금은 깊이 2단계 까지는 보인다.
* 개선할 것
  1. removeAndReverse 메서드를 앞과 뒤를 제거하는 것과 가운데 내용을 뒤집는 메서드로 쪼개는게 낫겠다.
  2. `'('` 과 `')'`를 비교하는 내용이 많이 등장하는데 실수를 방지하기 위해서 `isOpeningBracket()`, `isClosingBracket()` 메서드를 만들어도 되겠다.
  3. balancedBracket 메서드의 가장 밑 `return sb.toString();`은 논리적으로 실행될 수 없다. 균형잡힌 괄호의 index값을 리턴하게 하면 되려나... 고민해보자.
  4. 깊이 2인 메서드 1로 줄여보기

## 개선한 코드

```java
class Solution {
    public String solution(String p) {
        if(rightBracket(p)) return p;
        else return convertBracket(p);
    }

	private boolean rightBracket(String p) {
		int tempInt = 0;
		for(int i=0; i<p.length(); i++) {
			if(tempInt < 0) return false;
			if(isOpeningBracket(p.charAt(i))) tempInt++;
			if(isClosingBracket(p.charAt(i))) tempInt--;
		}
		return true;
	}

	private String convertBracket(String p) {
		if ("".equals(p)) return "";

		String u = balancedBracket(p);
		String v = p.substring(u.length());
		
		StringBuilder sb = new StringBuilder();
		if(rightBracket(u)) {
			sb.append(u);
			sb.append(convertBracket(v));
			return sb.toString();
		}
		else {
			sb.append(openingBracket());
			sb.append(convertBracket(v));
			sb.append(closingBracket());
			sb.append(removeAndReverse(u));
			return sb.toString();
		}
	}

	private String balancedBracket(String w) {
		StringBuilder sb = new StringBuilder();
		int tempInt = 0;
		for(int i=0; i<w.length(); i++) {
			char c = w.charAt(i);
			if(isOpeningBracket(c)) tempInt ++;
			if(isClosingBracket(c)) tempInt --;
			sb.append(c);
			if(i >= 1 && tempInt == 0) return sb.toString();
		}
		return "";
	}
	
	private String removeAndReverse(String u) {
		return reverse(removeEnds(u));
	}
	
	private String removeEnds(String u) {
		return u.substring(1, u.length()-1);
	}

	private String reverse(String center) {
		StringBuilder sb = new StringBuilder();
		for(int i=0; i<center.length(); i++) {
			if(isOpeningBracket(center.charAt(i))) sb.append(closingBracket());
			if(isClosingBracket(center.charAt(i))) sb.append(openingBracket());
		}
		return sb.toString();
	}

	private boolean isOpeningBracket(char c) {
		return c == '(';
	}
	
	private boolean isClosingBracket(char c) {
		return c == ')';
	}
	
	private String openingBracket() {
		return "(";
	}

	private String closingBracket() {
		return ")";
	}
}
```
