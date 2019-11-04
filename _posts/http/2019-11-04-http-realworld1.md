---
layout: post
title: RealWorld Http 1
category: http
tags: [http]
comments: true
---

어려우면 쓰고 외우고 다시보자  

## 이 책에서 배울 것

* HTTP 프로토콜 기초
* HTTP 발전과정
* 브라우저 내부에서 어떤 일이 일이너나느가
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
* 현대 HTTP의 기능을 이해한다 그 이해를 돕기 위해 역사를 되돌아본다.

---

## HTTP의 역사

* HTTP - 웹 브라우저와 웹 서버가 통신하는 절차와 형식을 규정한 것
* 웹 브라우저로 웹페이지를 표시할 때 서버로부터 정보를 받아오는 약속이지만, 그 범위를 넘어서 API등 다양한 서비스의 인터페이스로도 사용

### 고유명사

IETF - The Internet Engineering Task Force - RFC를 만든 단체
RFC - Request For Comments - IETF가 만든 규약 문서
IANA - Internet Assigned Numbers Authority - 포트 번호와 파일 타입등 웹에 관한 데이터베이스를 관리하는 단체
W3C - World Wide Web Consortium - 웹 관련 표준화를 하는 비영리 단체
WHATWG - Web Hypertext Application Technology Working Group - 웹 관련 규격을 논의하는 단체

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

* 송신 시에 바디를 서버에 봬려면 -d 옵션 사용

#### GET 요청 시의 바디

* 로이필딩 : GET과 함께 바디를 보낼 수 있지만, 그렇게 하는 것이 결코 유용하진 않습니다.
* '서버는 메시지 바디를 읽어올 수 있어야 하지만, 요청된 메서드가 바디의 시맨틱스를 정하지 않은 경우는 요청을 처리할 때 메시지 바디는 무시돼야 한다'