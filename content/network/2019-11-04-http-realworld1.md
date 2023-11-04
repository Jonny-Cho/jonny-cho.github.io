---
title: RealWorld Http 1
date: '2019-11-04 00:00:00'
categories: network
tags: [network, http]
---

어려우면 쓰고 외우고 다시보자  

## 이 책에서 배울 것

* HTTP 프로토콜 기초
* HTTP 발전과정
* 브라우저 내부에서 어떤 일이 일어나는가
* 서버와 브라우저가 어떻게 상호작용하는가

* HTTP 기본요소
    * 메서드와 경로
    * 헤더
    * 바디
    * 스테이터스 코드

* RFC 사양서를 현실에서 살펴보기
* curl 사용법
* go 언어 기본 사용법
* curl을 프로그래밍 언어 코드로 바꾸는 방법
* REST 아키텍처

### 구성

* HTTP/1.0 (1996)
* HTTP/1.1 (1997)
* HTTP/2 (2005)
* 현대 HTTP의 기능을 이해한다. 그 이해를 돕기 위해 역사를 되돌아본다.

---

## HTTP의 역사

* HTTP - 웹 브라우저와 웹 서버가 통신하는 절차와 형식을 규정한 것
* 웹 브라우저로 웹페이지를 표시할 때 서버로부터 정보를 받아오는 약속이지만, 그 범위를 넘어서 API등 다양한 서비스의 인터페이스로도 사용

### 고유명사

|이름|설명|
|:---|:---|
|IETF (The Internet Engineering Task Force) | RFC를 만든 단체|
|RFC (Request For Comments) | IETF가 만든 규약 문서|
|IANA (Internet Assigned Numbers Authority) | 포트 번호와 파일 타입등 웹에 관한 데이터베이스를 관리하는 단체 |
|W3C (World Wide Web Consortium)| 웹 관련 표준화를 하는 비영리 단체 |
|WHATWG (Web Hypertext Application Technology Working Group) | 웹 관련 규격을 논의하는 단체|

### 테스트 에코 서버 실행

* 에코 서버 - 클라이언트가 저송해주는 데이터를 그대로 되돌려 전송해주는 서버
* Go 언어 세팅하기
  1. https://golang.org/dl/ 에서 운영체제에 맞게 다운로드
  2. Go가 /usr/local/go에 설치된다.
  3. (맥의 경우) .bash_profile에 /usr/local/go/bin을 PATH 환경변수에 추가한다. `export PATH=$PATH:/usr/local/go/bin`
  4. .bash_profile 변경사항 적용 `source .bash_profile`
  5. 터미널에 `go`라고 쳤을 때 뭔가가 나오면 성공
  6. 작업폴더 하나 생성하고 bin, pkg, src폴더를 생성한다.
  7. src밑에 .go확장자로 파일 만들고 코드 작성
  8. 실행 `go run 경로/파일.go`

* src/server.go

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "net/http/httputil"
)

func handler(w http.ResponseWriter, r *http.Request){
    dump, err := httputil.DumpRequest(r, true)
    if err != nil {
        http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)
        return
    }
    fmt.Println(string(dump))
    fmt.Fprintf(w, "<html><body>hello</body></html>\n")
}

func main(){
    var httpServer http.Server
    http.HandleFunc("/", handler)
    log.Println("start http listening :18888")
    httpServer.Addr = ":18888"
    log.Println(httpServer.ListenAndServe())
}
```

![서버시작]({{site.url}}/assets/post-img/http/realworld1/serverstart.png)

## curl 실행

```bash
# curl 실행
curl --http1.0 http://localhost:18888/greeting

# 서버 측 로그
GET /greeting HTTP/1.0
Host: localhost:18888
Connection: close
Accept: */*
User-Agent: curl/7.54.0
```

![서버클라이언트]({{site.url}}/assets/post-img/http/realworld1/serverclient.png)

* 웹사이트의 페이지를 서버에 요청
* 그 응답으로 웹사이트의 내용을 받아온다.
* Hyper Text Transfer Protocol이라는 이름 그대로.
* 수신 후에는 서버와 연결이 끊어진다.

### HTTP 0.9 -> 1.0

* HTTP 0.9의 단점
  * 하나의 문서를 전송하는 기능밖에 없었다.
  * 통신되는 모든 내용은 HTML 문서로 가정, 콘텐츠의 형식을 서버가 전달할 수단이 없었다.
  * 검색 이외의 요청을 보낼 수 없었다.
  * 새로운 문장을 전송하거나 갱신 또는 삭제할 수 없었다.

* HTTP 1.0 변경사항
  * 요청시 메서드 추가 (GET)
  * 요청시 HTTP 버전 추가 (HTTP/1.0)
  * 헤더 추가 (Host, User-Agent, Accept)


### 전자메일

* 일단 pass
* Gmail에서 원본 보기하면 원시 정보를 확인할 수 있다.
* p.43
* 콘텐트 스니핑 - IE의 경우 MIME타입이 아닌 내용을 보고 파일 형식을 추측하려고 하는 동작. text/plain 파일인데도 HTML과 자바스크립트가 적혀 있으면 브라우저가 파일을 실행해버리는 일도 있었다. 보안의 구멍이 될 수 있다.
* 간단하게 정리하면 HTTP 통신은 고속으로 전자메일이 왕복하는 것

### 뉴스그룹

* 메서드
  * GET - 서버에 헤더와 콘텐츠 요청
  * HEAD - 서버에 헤더만 요청
  * POST - 새로운 문서 투고
  * 자바스크립트에서 XMLHttpRequest 지원 후
  * PUT - 이미 존재하는 URL 문서 갱신
  * DELETE - 지정된 URL 문서 삭제. 삭제에 성공하면 삭제된 URL은 무효가 된다.

* 스테이터스 코드
  * 1xx - 처리가 계속됨
  * 2xx - 성공
  * 3xx - 서버에서 클라이언트로의 명령. 정상 처리의 범주. 리디렉트나 캐시 이용 지시
  * 4xx - 클라이언트 오류
  * 5xx - 서버 오류

### 리디렉트

* 301/308 - 요청된 페이지가 다른 장소로 영구적으로 이동했을 때 사용. 구글은 301을 사용할 것을 권장
* 302/307 - 일시적인 이동. 모바일 전용 사이트로 이동, 관리 페이지 표시
* 303 - 요청된 페이지에 반환할 콘텐츠가 없거나 혹은 원래 반환할 페이지가 따로 있을 때, 그 쪽으로 이동시키려고 사용. 예를들어 로그인 후 원래 페이지로 이동하는 경우

### URL (p.56)

### 바디 (p.60)

```bash
헤더1: 헤더 값1
헤더2: 헤더 값2
Content-Length: 바디의 바이트 수

여기부터 지정된 바이트 수만큼 바디 포함
```

* 송신 시에 바디를 서버에 보려면 -d 옵션 사용

#### GET 요청 시의 바디

* 로이필딩 : GET과 함께 바디를 보낼 수 있지만, 그렇게 하는 것이 결코 유용하진 않습니다.
* '서버는 메시지 바디를 읽어올 수 있어야 하지만, 요청된 메서드가 바디의 시맨틱스를 정하지 않은 경우는 요청을 처리할 때 메시지 바디는 무시돼야 한다'

---

## 브라우저 기본 기능의 이면

### 단순한 폼 전송(x-www-form-urlencoded)

```html
<form method="POST">
</form>
```

* curl 커맨드의 -d 옵션을 사용해 폼으로 전송할 데이터 설정 가능

```bash
curl --http1.0 -d title="The Art of Community" -d author="Jono Bacon" http://localhost:18888
```

* RFC 1866에서 책정한 변환 포맷 - 알파벳, 수치, 별표, 하이픈, 마침표, 언더스코어 이외에는 변환 필요. 공백은 +로 바뀐다.
* RFC 3986 - 공백이 %20으로 변환

> 얼마전 엑셀 다운로드 기능을 위한 POI API 사용하면서 브라우저별로 한글 파일명으로 다운로드 할 때 공백을 다르게 처리해줬던 기억이 있는데 각 브라우저마다 차용한 RFC 버전이 달라서 생기는 것이라고 예상

### 폼을 이용한 파일 전송(멀티파트 폼 형식 - RFC 1867)

```html
<form method="POST" enctype="multipart/form-data">
</form>
```

* 멀티파트를 이용하는 경우는 한 번의 요청으로 복수의 파일을 전송할 수 있어서 받는 쪽에서 파일을 나눠야 한다.

> 파일첨부를 위해서 필수

### text/plain

* www-form-urlencoded에 가깝지만 변환을 하지 않고 개행으로 구분해 값을 전송

> p.70 text/plain을 사용할 일은 없겠다고 하는데, 지금 진행하는 프로젝트의 모든 파일첨부에 이것이 붙어 있다. 나중에 조금더 알아보자

### 폼을 이용한 리디렉트

* 300번대 스테이터스 코드를 사용한 리디렉트의 제한
  * URL 2000자 이내 - GET의 쿼리로 보낼 수 있는 데이터양에 한계있음
  * 데이터가 URL에 포함 - 보안이슈

### 콘텐트 니고시에이션

* 하나의 요청 안에서 서버와 클라이언트가 서로 최고의 설정은 공유하는 시스템
* 헤더 이용(p.72)
  * Accept
  * Accept-Language
  * Accept-Charset
  * Accept-Encoding

### 파일 종류 결정

### 표시 언어 결정

### 문자셋 결정

* 대부분 MIME 타입과 세트로 Content-Type 헤더에 실려 통지
`Content-Type: text/html; charset=UTF-8`

### 쿠키

* 웹사이트의 정보를 브라우저 쪽에 저장하는 작은 파일
* 서버가 클라이언트에 '이 파일을 보관해줘'라고 쿠키 저장을 지시
* HTTP 헤더를 기반으로 구현되어 있다.
* 첫 방문인지 아닌지 판단

#### 쿠키의 잘못된 사용

* 확실하게 저장된다는 보장 없음
* 최대 크기 4킬로 제한
* 헤더에 존재하기 때문에 통신량이 늘어남 -> 속도저하 가능성 증가
* 보안 secure속성이 없으면 평문으로 전송 -> 서명이나 암호화 처리 필요

#### 쿠키의 제약

* 쿠킨은 특정 서비스를 이요하는 토큰으로 이용될 때가 많다.
* 쿠키 보낼 곳(Path) 제어, 쿠키 수명(Expires) 설정등 제한 필요
* 제한설정(p.80) 
  * Expires, Max-Age
  * Domain
  * Path
  * Secure
  * HttpOnly
  * SameSite

### 인증과 세션

#### Basic인증 Digest 인증

#### 쿠키를 사용한 세션 관리

* 지금은 Basic인증과 Digest 인증 모두 많이 사용되지 않는다.
  * 최상위 페이지에 사용자 고유 정보를 제공할 수 없다. 특정 폴더 아래를 보여주지 않는 방식으로만 사용할 수 있기 때문.
  * 요청할 때마다 계산 필요.
  * 로그인 화면 사용자화할 수 없다.
  * 명시적 로그오프 불가
  * 로그인한 단말 식별 불가

* 최근에는 폼을 이요한 로그인과 쿠키를 이용한 세션 관리 조합을 주로 이용.
  * SSL/TLS 필수
  * 서버에서 ID/PW 인증 후 문제 없으면 세션 토큰 발행
  * 토큰을 데이터베이스에 저장
  * 토큰은 쿠키로 브라우저에 전달
  * 두 번째 이후 접속에서는 쿠키를 재전송해서 로그인된 클라이언트임을 서버가 알 수 있음.
  * CSRF 대책으로 랜덤 키를 보내는 경우도 있으므로, 랜덤 키도 잊지 말고 전송합시다(?) -> 10장에서 자세히

#### 서명된 쿠키를 이용한 세션 데이터 저장

* Memcached

## 프록시

* HTTP 등의 통신을 중계. + 각종 부가 기능 구현
* 캐시 기능이 있는 프록시를 조직의 네트워크 출입구에 설치하면, 콘텐츠를 저장한 웹 서버의 부담은 줄이고 각 사용자가 페이지를 빠르게 열람 할 수 있게 하는 효과가 있다.
* 외부 공격으로부터 네트워크를 보호하는 방화벽 역할
* 압축해서 속도를 높이는 필터, 콘텐츠 필터링 등에도 이용
* 보통 메서드 뒤 경로명은 /helloworld 처럼 오는데 프록시 설정시 스키마가 추가돼, http://로 시작하는 URL 형식이 된다.

```bash
GET http://example.com/helloworld
Host: example.com
```

* 프록시 설정하려면 `-x/--proxy` 옵션 사용
* 프록시 인증용 유저명과 패스워드는 `-U/--proxy-user` 옵션 사용

```bash
curl --http1.0 -x http://localhost:18888 -U user:pass http://example.com/helloworld
```

### 캐시(p.88)

* 파일 크기가 커진 현대 웹사이트 -> 로딩속도 느려짐
* 콘텐츠가 변경되지 않았을 땐 로컬에 저장된 파일을 재사용하자.
* GET과 HEAD메서드만 캐시된다.

#### 갱신 일자에 따른 캐시

#### Expires(p.89~90)

* 갱신 일자를 이용한 캐시의 경우 캐시의 유효성을 확인하기 위해 통신이 발생
* 이 통신 자체를 없애는 방법 -> Expires 헤더 이용
* Expires 헤더에 날짜와 시간 포함.
* 클라이언트는 Expires가 기한 내라면 신선하다고 판단 -> 강제로 캐시 이용 (요청 전송 X)
* 신선하지 않으면 서버 접속 -> Last-Modified 헤더를 이용한 캐시 로직

#### Pragma:no-cache

* 요청한 콘텐츠가 이미 저장돼 있어도, 원래 서버에서 가져오라고 프록시 서버에 지시하는 것
* HTTP1.1에 Cache-Control로 통합됐지만 하위 호환성 유지를 위해 남아있다.

#### ETag 추가

* HTTP 컨텐츠가 바뀌었는지를 검사할 수 있는 태그. 같은 주소의 자원이더락도 컨텐츠가 달라졌다면 ETag가 다르다.
* ETag값이 변경되었다면 클라이언트가 응답 내용이 달라졌다는 것을 알고, 이미 저장된 캐시를 지우고 새로 컨텐츠를 내려받을 수 있다.

`Etag: W/"3bf2-wdj3VvN8/CvXVgafkI30/TyczHk"`

#### Cache-Control (1)

* Expires보다 우선해서 처리
* 더 유연한 캐시 제어 지시
* p.95 이미지

#### Vary

* 같은 URL이라도 클라이언트에 따라 반환 결과가 다름을 나타내는 헤더

`Vary: User-Agent, Accept_-Language`

* 검색 엔진용 힌트.
* 모바일 버전은 다르게 보이게 판단하는 재료
* 언어별로 바르게 인덱스를 만드는 힌트

### 리퍼러(Referer)

* 사용자가 어느 경로로 웹사이트에 도달했는지 파악할 수 있도록 서버에 보내는 헤더
* 철자가 referrer와 다른 이유는 처음 만들 때 오자...

### robot.txt

* 크롤러 접근 제어 방법
  * robots.txt (블랙리스트)
  * 사이트맵 (화이트리스트)


---

### References

* Real World HTTP
* HTTP 완벽가이드 조금
* 그림으로 배우는 Http & Network
* [알아둬야 할 HTTP 쿠키 & 캐시 헤더](https://www.zerocho.com/category/HTTP/post/5b594dd3c06fa2001b89feb9){:target="_blank"}
