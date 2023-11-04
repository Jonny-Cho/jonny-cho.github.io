---
title: 리눅스 CentOS7에 MySQL 5.7 설치하기
date: '2019-01-03 00:00:00'
categories: linux
tags: [linux]
---

## 순서

1. [MySQL 5.7 설치](#1)
2. [UTF-8 (한글) 설정](#2)
3. [MySQL 구동](#3)

## MySQL 5.7 설치 <a id="1"></a>

<a href="https://www.lesstif.com/pages/viewpage.action?pageId=24445108" target="_blank">정광섭님 블로그 - CentOS에 MySQL 5.7 설치하기</a>

### 모든 패키지가 포함된 bundle 다운로드

`wget --no-check-certificate  https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.22-1.el7.x86_64.rpm-bundle.tar`

### 번들 압축 해제

`tar xvf *bundle.tar`

### yum으로 설치

`yum localinstall MySQL-server* MySQL-client*`

### MySQL 5.7

`rpm -ivh https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm`

* 이제 yum 명령어로 mysql 을 설치할 수 있다
* `yum search mysql-community` 명령어로 전체 패키지 목록을 확인
* `yum install mysql-community-server`
    * 아래의 패키지를 모두 설치하는 명령어
    * mysql-community-server
    * mysql-community-client
    * mysql-community-libs 
    * mysql-community-common


## UTF-8 (한글) 설정 <a id="2"></a>

<a href="http://wincloud.link/pages/viewpage.action?pageId=9469960" target="_blank">Confluence-MySQL 기본 인코딩을 UTF8 로 변경</a>

### /etc/my.cnf 파일 수정

```bash
vi /etc/my.cnf
```

* 아래의 내용 추가하고 저장

```bash
[mysql]
default-character-set = utf8
 
[mysqld]
character-set-client-handshake=FALSE
init_connect="SET collation_connection = utf8_general_ci"
init_connect="SET NAMES utf8"
character-set-server = utf8
collation-server = utf8_general_ci
  
[client]
default-character-set = utf8

esc -> :wq
```

`service msqld restart`

```sql
mysql> status
--------------
mysql  Ver 14.14 Distrib 5.6.27, for Linux (x86_64) using  EditLine wrapper
Connection id:      7
Current database:  
Current user:       root@localhost
SSL:            Not in use
All updates ignored to this database
Current pager:      stdout
Using outfile:      ''
Using delimiter:    ;
Server version:     5.6.27 MySQL Community Server (GPL)
Protocol version:   10
Connection:     Localhost via UNIX socket
Server characterset:    utf8
Db     characterset:    utf8
Client characterset:    utf8
Conn.  characterset:    utf8
UNIX socket:        /var/lib/mysql/mysql.sock
Uptime:         13 min 21 sec
Threads: 5  Questions: 312  Slow queries: 0  Opens: 67  Flush tables: 1  Open tables: 60  Queries per second avg: 0.389
--------------
mysql>
```

## MySQL 구동 <a id="3"></a>

`systemctl start mysqld`

* root 암호, 보안설정 위해 mysql_secure_installation 실행

`mysql_secure_installation`

* 다음 명령어로 초기 암호 획득

`grep 'password' /var/log/mysqld.log`
