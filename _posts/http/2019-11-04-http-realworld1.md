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
    //"log" // 책과 버전이 달라졌는지 log는 import하지 않는다. 뭐가 달라졌는지 확인해보자
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

![서버시작]({{site.url}}/_posts/http/2019-11-04-img/serverstart.png)

