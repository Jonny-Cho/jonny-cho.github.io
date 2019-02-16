---
layout: post
title: 프로젝트 - GEHA-방찾기 기능 설명
category: project
tags: [프로젝트]
comments: true
---

* [홈페이지 링크](){:target="_blank"}

* 결과화면

![GEHA-방찾기-결과화면]({{site.url}}/assets/post-img/project/search.png)

* 스토리보드

![GEHA-방찾기-스토리보드]({{site.url}}/assets/post-img/sql/storyboard.jpg)

* ERD

![GEHA-방찾기-ERD]({{site.url}}/assets/post-img/project/erd.png)

* 사용한 기술 **(주요 기술)**

	* Backend & DB
		* **Springboot 2.x**
		* **MySQL 5.7**
	* Deploy
		* AWS EC2 & RDS
	* Template
		* Handlebars
		* Thymeleaf
	* FrontEnd
		* **AJAX**
		* **Javascript & jQuery**
		* Bootstrap 3.x
	* API & Plugin
		* **다음 지도 Web API**
		* air datepicker
		* Serialize Object
	* 개발 환경
		* Windows 10
		* STS 3.x
		* Maven
		* MyBatis

* 간단한 설명
	* 게스트하우스 프로젝트에서 중요한 부분인 검색 페이지를 맡음
	* 날짜와 인원수를 동시에 검색하는 검색 쿼리에 시간을 가장 많이 투자
	* AJAX를 사용해 모든 검색이 하나의 url에서 동작하도록 구성
	* 다음 지도 API에서 제공하는 기능을 적절하게 사용해서 사용자 경험을 더 좋게 하도록 노력
	* Git과 GitHub를 적극 사용해서 협업으로서의 버전관리에 익숙해짐

* 소스코드 깃허브 링크 **(주요 소스코드)**

	* **[search.html](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/resources/templates/search.html){:target="_blank"}**
		* html / css / javascript를 한번에 확인할 수 있습니다.

	* [search.css](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/resources/static/css/search.css){:target="_blank"}
	
	* **[SearchController.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/controller/SearchController.java){:target="_blank"}**
	
	* [SearchDao.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/dao/SearchDao.java){:target="_blank"}

	* [SearchCriteria.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/criteria/SearchCriteria.java){:target="_blank"}

	* [SearchDto.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/dto/SearchDto.java){:target="_blank"}

	* **[searchMapper.xml](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/resources/mapper/searchMapper.xml){:target="_blank"}**
		* [Mapper 검색 쿼리 설명]({{site.url}}/project/2019/02/16/gehaquery/)

* 기능 설명
	1. 검색 부분
		* 날짜 - air datepicker plugin을 사용해서 사용자로부터 정확한 날짜 정보를 받을 수 있음
		* 키워드 검색 - 키워드 입력후 Enter키를 눌렀을 때도 이벤트 발생
		* 인원 - 1 ~ 10명 까지의 인원 선택 가능
		* 가격 - jquery ui를 사용. 1만원 ~ 10만원 사이의 범위 선택 가능
		* 정렬 부분(평점 높은 순 ~ 높은 가격 순)을 클릭하면 검색 부분에 hidden Input에 데이터가 들어간 후 다시 Ajax요청
	2. 지도 부분
		* 검색 결과에 나오는 게스트하우스들만 지도에 표시
		* 마커를 클릭하면 게스트하우스의 정보가 표시
		* Map을 클릭하거나 드래그 했을 때만 휠로 줌 가능
		* 마우스가 Map을 벗어나면 휠을 동작했을 때 페이지 스크롤로 변경
	3. 결과 부분
		* Ajax요청 -> 검색 쿼리를 거쳐 나온 결과를 출력
		* Handlebars template을 이용해서 html 주입
		* Bootstrap을 사용해서 화면이 줄어들었을 때 한 줄에 보이는 데이터의 갯수를 조절 (3개, 2개, 1개)

* 문제 -> 질문 -> 해결
	* 날짜와 인원수를 동시에 검색하는 부분
		* [구루비 - 예약사이트 날짜검색&인원검색 방법](http://www.gurubee.net/article/80746){:target="_blank"}
	* 카카오 API에서 다른 오버레이를 클릭했을 때 기존 오버레이 삭제하는 부분
		* [kakao devtalk - Ajax 검색 결과가 달라질 때 다중 마커 삭제 방법](https://devtalk.kakao.com/t/ajax/68718){:target="_blank"}

* 소감
	* 뜬구름 같았던 Ajax의 개념이 명확해졌고 사용자 경험을 얼마나 개선할 수 있는지 체감했다. 
	* [여기어때](https://www.goodchoice.kr/product/search/6){:target="_blank"}는 검색 버튼을 누를 때 페이지가 새로고침되는데 이것보다 더 나은 사이트를 만든 것 같다.
	* 질문을 잘해야 좋은 답변을 얻을 수 있다는 것을 알게 되었다.
	* SQL의 기초문법 특히 여러가지 Join의 차이점을 정확하게 알고 사용할 수 있게 되었다.
	* 생각보다 프론트앤드에 시간을 많이 쏟게 되어버렸는데 다음 프로젝트를 한다면 스프링의 특징이자 장점인 시큐리티, 트랜잭션, AOP를 사용할 수 있는 사이트를 만들고 싶다. (가상 은행?)

* References

	* [여기어때](https://www.goodchoice.kr/product/search/6){:target="_blank"}
	* [우주](https://www.woozoo.kr/houses){:target="_blank"}
	* [다음 지도 API](http://apis.map.daum.net/web/){:target="_blank"}
	* [구루비](http://www.gurubee.net/){:target="_blank"}
	* 코드로 배우는 스프링 웹 프로젝트 - 구멍가게 코딩단 - 남가람북스
	* [jQuery UI - Slider](https://jqueryui.com/slider/#range){:target="_blank"}
	* [jQuery Serialize Object](https://github.com/macek/jquery-serialize-object){:target="_blank"}
	* [Air Datepicker](http://t1m0n.name/air-datepicker/docs/){:target="_blank"}
	* [Kakao Oven](https://ovenapp.io/){:target="_blank"}
	* [AQueryTool](http://aquerytool.com/){:target="_blank"}
	* [AUI Project](http://www.auiproject.com/){:target="_blank"}