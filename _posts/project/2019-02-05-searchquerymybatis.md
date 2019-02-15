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

* 사용한 기술
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
		* Javascript & jQuery
		* Bootstrap 3.x
	* API & Plugin
		* **카카오 지도 API**
		* air datepicker
		* Serialize Object

* 간단한 설명
	* 게스트하우스 프로젝트에서 중요한 부분인 검색 페이지를 맡음
	* 날짜와 인원수를 동시에 검색하는 검색 쿼리에 시간을 가장 많이 투자
	* AJAX를 사용해 모든 검색이 하나의 url에서 동작하도록 구성
	* 카카오 지도 API에서 제공하는 기능을 적절하게 사용해서 사용자 경험을 더 좋게 하도록 노력
	* Git과 GitHub을 적극 사용해서 협업으로서의 버전관리에 익숙해짐

* [깃허브 링크](https://github.com/geha-pjt/geha-pjt){:target="_blank"}

* [홈페이지 링크](){:target="_blank"}

* 기능 설명

* 문제 -> 질문 -> 해결
	* 날짜와 인원수를 동시에 검색하는 부분
	* 카카오 API에서 다른 오버레이를 클릭했을 때 기존 오버레이 삭제하는 부분

* 아쉬운 점