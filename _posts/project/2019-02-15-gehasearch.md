---
layout: post
title: 프로젝트 - GEHA-방찾기 기능 설명
category: project
tags: [프로젝트]
comments: true
---

* 스토리보드

![GEHA-방찾기-스토리보드]({{site.url}}/assets/post-img/sql/storyboard.jpg)

* 결과화면

![GEHA-방찾기]({{site.url}}/assets/post-img/project/search.png)

* 사용한 기술 **(주요 기술)**
	* Backend & DB
		* **Springboot 2.x**
		* **MySQL 5.7**
		* MyBatis
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

* 간단한 설명
	* 게스트하우스 프로젝트에서 중요한 부분인 검색 페이지를 맡음
	* 날짜와 인원수를 동시에 검색하는 검색 쿼리에 시간을 가장 많이 투자
	* AJAX를 사용해 모든 검색이 하나의 url에서 동작하도록 구성
	* 다음 지도 API에서 제공하는 기능을 적절하게 사용해서 사용자 경험을 더 좋게 하도록 노력
	* Git과 GitHub를 적극 사용해서 협업으로서의 버전관리에 익숙해짐

* 소스코드 깃허브 링크

	* **[search.html](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/resources/templates/search.html){:target="_blank"}**
		* html / css / javascript를 한번에 확인할 수 있습니다.
	
	* **[SearchController.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/controller/SearchController.java){:target="_blank"}**
	
	* [SearchDao.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/dao/SearchDao.java){:target="_blank"}

	* [SearchCriteria.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/criteria/SearchCriteria.java){:target="_blank"}

	* [SearchDto.java](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/java/com/bit/geha/dto/SearchDto.java){:target="_blank"}

	* **[searchMapper.xml](https://github.com/geha-pjt/geha-pjt/blob/master/src/main/resources/mapper/searchMapper.xml){:target="_blank"}**

* [홈페이지 링크](){:target="_blank"}

* 기능 설명
	1. 검색 부분
		1. 
		2. 
		3. 
	2. 지도 부분
		1. 
		2. 
		3. 
	3. 결과 부분
		1. 
		2. 
		3. 

* 문제 -> 질문 -> 해결
	* 날짜와 인원수를 동시에 검색하는 부분
		* [구루비 - 예약사이트 날짜검색&인원검색 방법](http://www.gurubee.net/article/80746){:target="_blank"}
	* 카카오 API에서 다른 오버레이를 클릭했을 때 기존 오버레이 삭제하는 부분
		* [kakao devtalk - Ajax 검색 결과가 달라질 때 다중 마커 삭제 방법 ](https://devtalk.kakao.com/t/ajax/68718){:target="_blank"}

* 배운 점
	* 복잡한 검색 쿼리문 작성
	* 

* 아쉬운 점 / 개선할 점