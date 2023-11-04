---
title: 리눅스 CentOS7 서버 세팅 정리 (아파치 톰캣)
date: '2018-12-31 00:00:00'
categories: linux
tags: [linux]
---

## 순서

1. [CentOS 설치](#1)
2. [톰캣 설치](#2)
3. [JDK 설치](#3)
4. [환경변수 설정](#4)
5. [톰캣 실행 및 테스트](#5)
6. [서비스 등록](#6)
7. [서비스 관리](#7)

## CentOS 설치 <a id="1"></a>

1. USB 만들기
    * [wikidocs 리눅스 개발 놀이터 만들기 - 설치 USB 만들기](https://wikidocs.net/16269){:target="_blank"}

2. CentOS usb 부팅
    1. BIOS Configuration 들어가기(메인보드마다 다른데 삼성은 F2)
    2. Boot
    3. Boot Device Priority
    4. Boot Option #1 -> usb이름
    5. Save and Reset (F10)

3. 기본 설정
    1. DATE & TIME -> Asia Seoul
    2. Software selection -> GNOME Desktop
    3. Network & Host name -> ON
    4. Installation destination
        * 설치할 디스크 선택
        * Other Storage Options -> I will configure partitioning
        * 기존에 설치된 OS가 있다면 - 버튼으로 삭제
        * Click here to create them automatically
    5. Begin
    6. User Settings
        * Root Password
        * User Creation 설정
    7. 인스톨링 시간 대략 20분

4. usb 빼고 재부팅
    * 부팅순서 첫번째로 usb 설정해놔서 usb를 빼야한다
    * 라이센스 동의후 Finish
    * root로 로그인하는게 편리

5. yum update - 5분정도 걸림

## 톰캣 설치 <a id="2"></a>

1. 의존성 설치
    * wget 설치
    * 참고 [victolee 블로그](https://victorydntmd.tistory.com/224){:target="_blank"}
    * yum install -y wget
    * 이미 설치된 경우 - already installed and latest version
2. 톰캣 다운로드
    1. 다운로드
        * [톰캣 다운로드 홈페이지](https://tomcat.apache.org/download-80.cgi){:target="_blank"}
        * core - tar.gz - copy link location
        * cd /usr
        * `wget http://mirror.navercorp.com/apache/tomcat/tomcat-8/v8.5.37/bin/apache-tomcat-8.5.37.tar.gz`
        * tar xvfz apache-tomcat-8.5.37
        
## JDK 설치 <a id="3"></a>

* [오라클 jdk](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html){:target="_blank"}
* linux x64 -> rpm 파일 링크 복사 하지말고 클릭해서 다운로드
* /usr/ 경로로 파일옮김
* rpm -ivh xxx.rpm 파일 압축해제
* /usr/java 폴더가 생김
* jdk1.8.0_191 로 파일명 변경

* 방화벽 설정 - 하지 않으면 외부에서 접속 못함
    * `firewall-cmd --permanent --add-port=80/tcp`
    * `firewall-cmd --reload`

## 환경변수 설정 <a id="4"></a>

* 어느 디렉터리에서나 tomcat을 실행할 수 있도록 환경변수 설정
* vi /etc/profile
    
    * #tomcat export
    * export CATALINA_HOME=/usr/apache-tomcat-8.5.37
    * #java_home
    * export JAVA_HOME=/usr/java/jdk1.8.0_191
    * export PATH=$PATH:$JAVA_HOME/bin
    * esc -> :wq

* 톰캣 환경설정 (server.xml)
    * vi /usr/apache-tomcat-8.5.37/conf/server.xml
    * port는 80으로 변경
    * URIEncoding="UTF-8" 추가

```
<Connector port="80" protocol="HTTP/1.1"
            URIEncoding="UTF-8"
            connectionTimeout="20000"
            redirectPort="8443" />
```

## 톰캣 실행 및 테스트 <a id="5"></a>

* `/usr/apache-tomcat-8.5.37/bin/startup.sh`
* `ps -ef | grep tomcat`

* ifconfig로 아이피 확인후 브라우저에서 접속
* `http://아이피`

## 서비스 등록 <a id="6"></a>

* 서버가 실행되면 tomcat이 자동으로 실행되도록 서비스를 등록

```
# /usr/local/apache-tomcat-8.5.37/bin/catalina.sh stop

# vi /usr/lib/systemd/system/tomcat.service
[Unit]
Description=tomcat8
After=network.target syslog.target

[Service]
Type=forking

Environment=JAVA_HOME=/usr/java/jdk1.8.0_191
User=root
Group=root

ExecStart=/usr/apache-tomcat-8.5.37/bin/startup.sh
ExecStop=/usr/apache-tomcat-8.5.37/bin/shutdown.sh

UMask=0007
RestartSec=10
Restart=always

SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

## 서비스 관리 <a id="7"></a>

* 마지막으로 서비스를 활성화 시킵니다.

서비스가 등록이 되었는지 확인하기 위해 재부팅을 한 후, 프로세스를 확인하는 것으로 테스트를 마칩니다.

재부팅을 했는데 톰캣이 돌아가고 있으면 서비스 등록이 성공적으로 된 것입니다.

```
# systemctl enable tomcat.service 
# systemctl start tomcat.service 
# ps -ef | grep tomcat 
# reboot 
# ps -ef | grep tomcat
```

---
