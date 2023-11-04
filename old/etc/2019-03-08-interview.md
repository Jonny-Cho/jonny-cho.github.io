---
layout: post
title: 면접대비 총정리(작성중)
category: etc
tags: [면접준비]
comments: true
published: false
---

## JAVA

1. 클래스변수, 인스턴스변수, 지역변수 차이설명

2. 배열과 List의 사용상 차이점

3. 오버로딩과 오버라이딩

4. 객체지향 캡상추다 설명

5. 추상클래스와 인터페이스의 공통점과 차이점

	* 추가) 인터페이스로 다형성을 구현한 예를 들어봐라
		* 컬렉션 프레임워크!!! List, Set, Map 요놈들은 인터페이스다. 이것들을 이용해서 ArrayList, LinkedList으로 용도에 맞게 구현해서 사용하는 것.

6. 내부클래스의 필요성

	* 내부 클래스에서 외부 클래스의 멤버들을 쉽게 접근 가능
	* 코드의 복잡성을 줄일 수 있다 (캡슐화)

7. 기본타입의 형변환과 참조타입의 형변환에 대해 설명하고 코드로 예를 들어봐라
	
	* 추가) 기본타입과 참조타입의 차이점은?
		* 기본형은 값을 참조
		* 참조형은 주소를 참조

## Servlet & JSP

1. HttpServlet의 init(), service(), destroy()메서드의 호출시점과 HttpServlet 객체의 생명주기에 대해 설명

	* <a href="https://hackersstudy.tistory.com/72" target="_blank">Servlet의 동작 과정 및 생명주기</a>

	* <a href="https://victorydntmd.tistory.com/154" target="_blank">[JSP/Servlet] Servlet 생명주기 ( Life Cycle )</a>

2. HttpServletRequest클래스와 HttpServletResponse클래스의 역할은?

3. 웹브라우저에서 웹어플리케이션서버를 통해 JSP파일을 호출하였을 때 Servlet Container내에서의 처리과정

	* 추가) WAS와 웹 서버의 차이
		* <a href="https://jeong-pro.tistory.com/84" target="_blank">WAS 와 웹 서버 차이 (WAS,Web Server) 그리고 아파치, 톰캣</a>

4. JSP에 내장되어 있는 속성변수(pageContext, request, session, application)들의 참조범위

5. jsp:include 액션과 include 디렉티브의 사용상 차이점

6. Cookie 객체와 Session 객체의 사용 용도

7. Filter 인터페이스와 ServletContextListener 인터페이스의 사용 용도

## Database

1. 정보, 데이터, 데이터베이스, 데이터베이스 관리시스템의 개념설명

2. 데이터베이스 내부에서 select, from, where, group by, having, order by에 대한 처리순서 나열
	
	* 추가) where와 having의 차이점

3. 아래 조인들에 대해 각각 설명

	1. self join

	2. inner join

	3. left outer join

	4. right outher join

	5. full outer join

	* 추가) inner 조인과 outer 조인의 차이점은?
		* inner join - 반대쪽에 매칭되는 값이 없으면 제외
		* outer join - 반대쪽에 매칭되는 값이 없어도 보여줌

4. DML, DDL, DCL에대해 설명하고 각각 3개 이상의 명령어를 나열

5. 데이터 무결성을 지키기 위해 사용되는 제약조건 나열하고 설명
	* 개체 무결성
	* 참조 무결성
	* 도메인 무결성

6. 트랜잭션과 락(Lock)에 대해 설명
	* 트랜잭션
		* 여러 쿼리를 묶어서 하나의 단위로 처리 하는 개념.
		* 예) 영화예매 - 좌석 지정은 성공했지만 결제를 실패한 경우 이미 지정된 좌석도 취소되어야 한다면 이 두가지의 행위를 트랜잭션으로 묶음
	* 락
		* 갱신손실 문제(두 개의 트랜잭션이 한 개의 데이터를 동시에 update할 때 발생하는 문제)를 해결하기 위함.
		* 트랜잭션이 데이터를 읽거나 수정할 때 데이터에 표시하는 잠금 장치.
		* 자신이 사용할 데이터를 락으로 잠그면 다른 트랜잭션은 잠금이 풀릴 때까지 기다려야 한다.

7. 트리거 개념을 설명하고 적절한 사용용도 나열

	* 데이터 변경(Insert, Delete, Update)문이 실행될 때 자동으로 같이 실행되는 프로시저.
	* 종류 - Before 트리거, After 트리거
	* 용도 - 백업 로그

8. 인덱스 사용시 장점에 대해 서술

	* 검색 빨라짐

	* 추가) 인덱스 써봤음?
	* 추가) 인덱스의 작동원리에 대해 설명
		* 튜플의 키 값에 대한 물리적 위치를 기록해둔 자료구조 (B-tree 구조)
		* 데이터에 접근가능한 주소를 정렬해 놓은 것이 인덱스

## Web - UI

1. DTD(Document Type Definition)와 XML Schema의 장단점

2. HTML에서 Block Element와 Inline Element의 차이점 설명하고 각각 3개의 Element의 예를들어라

3. HTML과 비교하여 XHTML의 문법 규칙에 대해 아는대로 나열

4. CSS Box Model이란?

5. CSS에서 fixed, relative, absolute, static positioning의 차이점

6. Javascript에서 전역변수와, 지역변수의 선언 위치와 사용가능한 범위에 대해 설명

	* 추가) 콜백이 무엇이고 언제쓰는 것인지 설명
		* 나중에 호출되는 함수
		* 비동기적 프로그래밍을 위해 사용

7. Javascript에서 fale로 판별되는 타입변환을 4개이상 나열

8. Function객체가 가지고있는 prototype 프로퍼티의 역할
	
	* <a href="https://medium.com/@bluesh55/javascript-prototype-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-f8e67c286b67" target="_blank">[Javascript] 프로토타입 이해하기</a>

	* 자바스크립트는 클래스 대신 프로토타입이 존재

9. Java의 배열과 비교하여 Javascript 배열의 특징

10. Javascript의 call 메서드와 apply 메서드의 사용법에 대해 코드 예를 보여 설명

	* <a href="https://youtu.be/PAr92molMHU" target="_blank">유튜브 - 자바스크립트 this? 간단히 핵심만 파악하기</a>
	* <a href="https://www.zerocho.com/category/JavaScript/post/57433645a48729787807c3fd" target="_blank">Zerocho - 함수의 메소드와 arguments</a>

11. 네트워크상에서 전송되는 데이터를 XML형식으로 표현하는 것과 JSON형식으로 표현하는 것의 장단점

12. DOM(Document Object Model) 기술의 효용성

13. XML기술의 효용성

14. Well Formed XML Document와 Valid XML Document의 차이점

15. 동기 통신방식과 비동기 통신방식의 차이점

16. AJAX기술의 효용성

17. AJAX에서 XMLHttpRequest 객체의 역할

18. jQuery에서 메서드 체이닝에 대해 설명하고 코드로 예를 들어라

## Framework

1. Framework를 사용하여 개발하였을 때 얻을 수 있는 장점

2. ORM(Object Relation Mapping)의 개념과 대표적인 ORM 프레임워크를 나열

	* 추가) ORM은 아니지만 마이바티스를 사용해본 적이 있는지? JDBC와 비교해서 마이바티스가 가진 장점은?
		* 쿼리만 따로 관리하기 때문에 가독성, 유지보수에 유리
		* 동적 쿼리
		* `<cache />`

3. MVC개념에 대해 설명, 대표적인 MVC 프레임워크 나열

4. DI의 개념과 장점

	* 추가) DI를 XML과 Annotation방식을 통해서 사용할 수 있다. XML은 두가지, Annotation은 다섯가지의 방법이 있는데, 그것에 대해 설명

5. AOP의 개념과 장점

	* 추가) AOP 용어 (Advice, Pointcut, Weaving...) 설명

6. Spring프레임워크에서 Auto-wiring과 Auto-weaving의 개념에 대해 설명

7. 스프링프레임워크의 사용 효용성에 대해 서술

## 면접 질문

1. 비전공인데 개발자로 전향한 이유

1. 프로젝트를 진행하면서 어려웠던 점은?

1. 그 어려웠던 점을 어떤식으로 해결했나?

1. 우리 회사 홈페이지를 본 적 있는지? 어떤 인상을 받았나?

1. 리더의 경험을 한 적이 있나? 리더가 되기 위한 자질은 무엇이라고 생각하나?

1. 본인이 생각했을 때 본인의 장점은?

1. 단점은?

1. 신기술을 배우는 것을 좋아한다고 했는데, 회사에서는 안정성을 이유로 신기술을 보수적으로 받아들이는 편이다. 본인이 하고싶지 않은 일을 맡게 되었을 때 어떻게 하겠는가?

1. 유닉스 계열 운영체제를 사용해본적이 있나? - 명령어 몇개를 말해봐라 - 본인이 생각했을 때 어느정도 수준이라고 생각하나?

1. 학원에서 수료했을 때 본인이 생각하는 순위는 몇등인가?

1. 조기졸업을 했다? 이유가 있나?

1. 졸업이 2015년도다. 꽤 시간이 지났는데 이때까지 어떤 일들을 해왔나?

1. 이직이 잦은데 그 이유는?

## 기타 질문

1. 주량이?

1. 일을 하면서 스트레스를 받을 때 푸는 본인만의 방법이 있나?

1. 개발 관련된 이야기를 제외하고 본인의 개인적인 꿈이 무엇인가?

1. 운동 좋아하나?
