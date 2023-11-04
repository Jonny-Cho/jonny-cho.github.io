---
title: SpringBoot 2.1.2 - MyBatis - MySQL - maven 설정
date: '2019-01-21 00:00:00'
categories: spring
tags: [springboot, 스프링부트, MySQL]
---

* 순서
	* springboot 프로젝트 생성
	* pom.xml 확인
	* Dto 작성
	* DAO(Mapper) Interface 작성
	* Mapper.xml 작성
	* application.properties 작성
	* Controller 작성
	* thymeleaf를 이용해 view에 출력

## springboot 프로젝트 생성

* [Spring Initializr](https://start.spring.io/){:target="_blank"}

	* Maven Project
	* Java
	* 2.1.2
	* dependencies - web, mysql, mybatis, thymeleaf 선택

## pom.xml dependency 확인

* mysql connector의 scope 제거

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
	<groupId>org.mybatis.spring.boot</groupId>
	<artifactId>mybatis-spring-boot-starter</artifactId>
	<version>2.0.0</version>
</dependency>

<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
<!-- 			<scope>runtime</scope> -->
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-test</artifactId>
	<scope>test</scope>
</dependency>
</dependencies>
```

## Dto 작성

```java
public class MapDto {
	private int id;
	private String name;
	private String address;

	// getter, setter, tostring
}
```

## DAO(Mapper) Interface 작성

* Mapper 어노테이션 참고

```java
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.map.prac.dto.MapDto;

@Mapper
public interface MapMapper {
	public List<MapDto> listmap();
}
```

## Mapper.xml 작성

* src/main/resources 에 mapper 폴더 만들고 MapMapper.xml 생성

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.example.map.prac.mapper.MapMapper" >

    <select id="listMap" resultType="com.example.map.prac.dto.MapDto">
        select * from tbl_map
    </select>
    
</mapper>
```

## application.properties 작성

* mysql
* mapper.xml 을 위한 properties 작성

```
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/map?useSSL=false&serverTimezone=Asia/Seoul
spring.datasource.username=mapuser
spring.datasource.password=1234

mybatis.mapper-locations=classpath:mapper/*Mapper.xml
```


## Controller 작성

```java
@Controller
public class MapController {

	@Autowired
	private MapMapper mapper;
	
	@RequestMapping("listmap")
	public String listmap(Model model) {
		
		model.addAttribute("list", mapper.listMap());
		
		return "listmap";
	}
	
}
```

## thymeleaf를 이용해 view에 출력

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<table>
      <tr>
        <th>id</th>
        <th>name</th>
        <th>address</th>
      </tr>
      <tr th:each="list : ${list}">
        <td th:text="${list.id}">aa</td>
        <td th:text="${list.name}">bb</td>
        <td th:text="${list.address}">cc</td>
      </tr>
</table>

</body>
</html>
```
