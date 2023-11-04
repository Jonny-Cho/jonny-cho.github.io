---
title: LV1. 완주하지 못한 선수
date: '2019-06-01 00:00:00'
categories: algorithm
tags: [algorithm]
---

## 문제 설명

수많은 마라톤 선수들이 마라톤에 참여하였습니다. 단 한 명의 선수를 제외하고는 모든 선수가 마라톤을 완주하였습니다.

마라톤에 참여한 선수들의 이름이 담긴 배열 participant와 완주한 선수들의 이름이 담긴 배열 completion이 주어질 때, 완주하지 못한 선수의 이름을 return 하도록 solution 함수를 작성해주세요.

### 제한 조건

* 마라톤 경기에 참여한 선수의 수는 1명 이상 100,000명 이하입니다.
* completion의 길이는 participant의 길이보다 1 작습니다.
* 참가자의 이름은 1개 이상 20개 이하의 알파벳 소문자로 이루어져 있습니다.
* 참가자 중에는 동명이인이 있을 수 있습니다.

### 입출력 예

participant | completion | return
--- | --- | ---
["leo", "kiki", "eden"] | ["eden", "kiki"] | "leo"
["leo", "kiki", "leo"] | ["leo", "kiki"] | "leo"
["leo", "kiki", "leo", "leo"] | ["leo", "kiki", "leo"] | "leo"

### 입출력 예 설명

1. leo, kiki, eden이 참여했고, eden과 kiki만 완주했다. 완주하지 못한 사람은 leo
2. leo 2명 참가 그 중 1명만 완주. 완주하지 못한 사람은 leo
3. 동명이인 3명 중 2명 완주. 남은 한명 리턴

## 풀이

```java
class Solution {
	public String marathon(String[] participant, String[] completion) {
		String answer = "";
		int val;
		HashMap<String, Integer> hm = new HashMap<>();
		for(String p : participant) {
			val = 1;
			if(hm.containsKey(p)) val = hm.get(p) + 1;
			hm.put(p, val);
		}

		for(String c : completion) {
			val = hm.get(c);
			if(hm.containsKey(c)) val--;
			hm.put(c, val);
		}

		for(String key : hm.keySet()) {
			if(hm.get(key) == 1) answer = key;
		}

		return answer;
    }
}
```

### 틀림의 역사

1. 처음에는 arrayList로 넣고 remove했는데 효율성 통과 실패
2. ArrayList에서 remove가 느려서 그런 줄 알고 linkedList로 바꿔봤으나 같은이유로 실패. 알고리즘에서는 list가 효율성이 대체로 안좋게 나온다. 검색 ㄱㄱ
3. HashMap<String, Boolean> 형태로 처음에 작성했다가 동명이인을 고려하지 않아 실패

### 참고

* <a href="https://programmers.co.kr/learn/courses/30/lessons/42576" target="_blank">프로그래머스</a>
