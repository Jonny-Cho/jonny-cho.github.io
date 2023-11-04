---
title: Spring - MyBatis - MySQL 연결하기
date: '2019-01-02 00:00:00'
categories: spring
tags: [spring, 스프링, MySQL]
---

## 목차

1. [dependency 설정](#1)
2. [root-context.xml 설정](#2)
3. [MVC 프로젝트 파일 만들기](#3)

### 들어가기 전에

* 프로젝트 이름 : mboard
* 패키지 이름 : com.mboard.bbs
* 한글설정(web.xml & jsp)

## dependency 설정 <a id="1"></a>

* mybatis 3.4.1
* mybatis-spring 1.3.0
* mysql-connector-java 6.0.6
* spring-jdbc 4.3.8RELEASE

## root-context.xml 설정 <a id="2"></a>

* 네임스페이스 추가 : aop, beans, context, jdbc, mybatis-spring
* MySQL DataSource 설정, Mapper 인터페이스를 빈객체로 등록

* 참고
	* db이름 : mbbsprac
	* ip&port : 127.0.0.1:3306
	* username : mbbsuser
	* password : 1234
	* table명 : tbl_board

```xml
 <!-- DataSource 설정 -->
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
	<property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
	<property name="url" value="jdbc:mysql://127.0.0.1:3306/mbbsprac?useSSL=false&amp;serverTimezone=Asia/Seoul"/>
	<property name="username" value="mbbsuser"/>
	<property name="password" value="1234"/>
</bean>

<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
	<property name="dataSource" ref="dataSource" />
	<property name="mapperLocations" value="classpath:com/mboard/bbs/dao/mapper/*.xml"/>
</bean>

<!-- Mapper 인터페이스 빈객체 등록 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
	<property name="basePackage" value="com.mboard.bbs.dao" />
</bean>
```

## MVC 프로젝트 파일 만들기 <a id="3"></a>

### controller 

```java
@Controller
public class BController {
	
	private static final Logger logger = LoggerFactory.getLogger(BController.class);
	
	@Resource(name="bs")
	private BoardService bs;
	
	@RequestMapping("/list")
	public String list(Model model) {
		logger.info("list()");
		System.out.println("list()");
		
		model.addAttribute("list", bs.list());

		return "list";
	}	
}
```

### BoardService

```java
public interface BoardService {
	public ArrayList<BDto> list();	
}
```

### BoardServiceImpl

```java
@Service("bs")
public class BoardServiceImpl implements BoardService {

	@Autowired
	IDao dao;
	
	@Override
	public ArrayList<BDto> list() {
		return dao.list();
	}

}
```

### IDao

```java
@Repository
public interface IDao {
	public ArrayList<BDto> list();
}
```

### IDao.xml (Mapper)

```xml
<mapper namespace="com.mboard.bbs.dao.IDao">
	<select id="list" resultType="com.mboard.bbs.dto.BDto">
		SELECT * FROM TBL_BOARD ORDER BY 1 DESC
	</select>
</mapper>
```

### BDto

```java
public class BDto {
	private String name;
	private double grade;
	private String address;
	private BigDecimal location_x;
	private BigDecimal location_y;

	// 생성자, getter/setter, tostring
}
```

### list.jsp

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<title>게시판 리스트</title>
</head>
<body>
	
	<div class="container">
		<table class="table table-hover">
			<tr>
				<th>번호</th>
				<th>제목</th>
				<th>작성일</th>
				<th>조회수</th>
				<th>수정하기</th>
				<th>삭제하기</th>
			</tr>
			<c:forEach items="${list}" var="list">
				<tr>
					<td>${list.bno}</td>
					<td><a href="content_view?bno=${list.bno}">${list.title}</a></td>
					<td><%-- ${list.bDate} --%> <fmt:formatDate value="${list.regdate}" pattern="yyyy-MM-dd"/></td>
					<td>${list.viewcnt}</td>
					<td><a href="update_view?bno=${list.bno}" class="btn btn-default" role="button">수정하기</a></td>
					<td><a href="delete?bno=${list.bno}" class="btn btn-default" role="button">삭제하기</a></td>
				</tr>
			</c:forEach>
		</table>
		<a href="write_view" class="btn btn-default" role="button">글쓰기</a>
	</div>
	<br />
	
	<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	
</body>
</html>
```
