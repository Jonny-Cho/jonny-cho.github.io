---
title: (참고) 오라클 SQL 세팅하기(SQL developer + Oracle DB 11g Express)
date: '2018-10-03 00:00:00'
categories: database
tags: [database]
---

## 설치하기

* [Oracle Database 11g Express Edition 설치 및 사용 방법](http://jink1982.tistory.com/4)

* [오라클 SQL Developer 설치 및 접속하는 방법](http://all-record.tistory.com/76)

---

## DBMS 접속하기

```sql
--Run SQL Command Line
> sqlplus
Enter user-name: system
Enter password: 1234

Connected to:
Oracle Database 11g Express Edition Release ...
```

## 사용자 계정 생성

```sql
> create user student identified by 1234;
User created.
```

## student 계정에 권한 주기

* student계정은 CREATE SESSION권한이 없어서 접근불가
* system계정으로 student계정에게 connect, resource권한을 줘야한다.

```sql
>conn student/1234 -- 에러. 권한 없음

> conn system/1234 -- system계정으로 연결
Connected.

> GRANT connect, resource TO student;
Connected.
-- system계정으로 student계정에게 connect, resource 권한을 준다

> conn student/1234
Connected. -- 접속성공
```

## SQL Developer에서 student계정 접속

1. \+버튼(새로만들기/데이터베이스 접속 선택) 누르기
2. 세부사항 입력
```
접속 이름 : student (SQL Developer에서 보여질 이름)
사용자 이름 : student (방금만든계정)
비밀번호 : 1234
```
3. 테스트 버튼 누르고 성공여부 확인
4. 테스트 성공하면 접속버튼 누르기

## CREATE로 테이블 생성해보기

* 아래의 표를 보고 테이블을 생성하시오.

```sql
CREATE TABLE student(
id NUMBER(5),
name CHAR(25),
salary NUMBER(7,2),
title CHAR(25) default '사원',
in_date DATE default SYSDATE,
dept_name CHAR(25)
);
```

`Table STUDNET이(가) 생성되었습니다.`
