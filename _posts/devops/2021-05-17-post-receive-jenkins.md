---
layout: post
title: post-receive를 활용한 젠킨스 CI (github없이 CI하기)
category: devops
tags: [jenkins, ci, post-receive, git hooks]
comments: true
---

github, gitlab등의 웹호스팅 기반 서비스를 사용한다면 젠킨스와 연동하기 쉬운데요. 여러가지 이유로 설치형 git을 사용해야만 하는 경우 CI를 어떤식으로 진행하는지 정리해봤습니다.

세 줄 요약
1. 젠킨스 빌드를 원격으로 유발하는 URL 설정
2. git이 설치된 서버에 post-receive git hooks 설정
3. post-receive script 코드에 1번 URL을 연결

## 1. 젠킨스 설치
* docker등의 가상환경에서 구축하는 방법도 있지만 지금은 local window 환경에서 설치해보겠습니다.

### 1.1 설치파일 다운로드

https://www.jenkins.io/ 에서 설치파일을 다운로드합니다.

![0.png]({{site.url}}/assets/post-img/devops/0517/0.png)

port를 설정합니다. 이번에는 1234로 설정하겠습니다.

![1.png]({{site.url}}/assets/post-img/devops/0517/1.png)

JDK 설정을 해줘야하는데 공식사이트를 잘 읽어보면 8과 11만 지원한다고 되어 있습니다.
나중에는 어떻게 바뀔지 모르니 공식 문서를 꼭 정독하시고 적절한 JDK 버전을 설정해주세요.

![2.png]({{site.url}}/assets/post-img/devops/0517/2.png)

![3.png]({{site.url}}/assets/post-img/devops/0517/3.png)

localhost:1234에 접속해 보겠습니다.

![4.png]({{site.url}}/assets/post-img/devops/0517/4.png)

빨간색 글씨로 Unlock Jenkins라고 쓰여 있습니다.

표시된 주소에 들어가면 초기 AdminPassword가 적혀있습니다.

![5.png]({{site.url}}/assets/post-img/devops/0517/5.png)

비밀번호를 붙여넣고 Continue 버튼을 눌러주세요.

![6.png]({{site.url}}/assets/post-img/devops/0517/6.png)

Install Suggested plugins를 클릭해서 추천하는 plugin들을 설치합니다.

![7.png]({{site.url}}/assets/post-img/devops/0517/7.png)

이번 예제에서는 프로젝트를 Gradle로 빌드하기 때문에 Gradle plugin이 필요한데 이때 설치가 됩니다.

설치가 완료되면 Create First Admin User 화면이 뜹니다. 사용하실 계정을 만들어 주세요.

### 1.2 Jenkins Item 추가하기 (Demo-test)

![9.png]({{site.url}}/assets/post-img/devops/0517/9.png)

새로운 Item 버튼을 클릭합니다.

![10.png]({{site.url}}/assets/post-img/devops/0517/10.png)

Freestyle project 선택후 OK 클릭

![11.png]({{site.url}}/assets/post-img/devops/0517/11.png)

소스코드 관리에서 Git을 선택하고 빌드하려고 하는 Repository URL을 입력합니다.
에러가 나는 이유는 Credentials가 없기 때문인데 Add버튼을 클릭한 후 Kind에 Username with password로 선택한 후 로그인 아이디와 패스워드를 입력합니다.

![12.png]({{site.url}}/assets/post-img/devops/0517/12.png)

![13.png]({{site.url}}/assets/post-img/devops/0517/13.png)

Credentials를 다시 클릭하면 Add한 계정이 들어있습니다. 클릭했을 때 에러가 사라진다면 성공입니다.

![14.png]({{site.url}}/assets/post-img/devops/0517/14.png)

Branches to build 에서는 build할 branch를 설정할 수 있습니다. //TODO master로 수정하기

![15.png]({{site.url}}/assets/post-img/devops/0517/15.png)

빌드 유발 → 빌드를 원격으로 유발을 클릭하고 토큰을 지정해줘야 합니다.
나중에는 복잡한 토큰을 입력하는게 좋겠지만. 지금은 abc라고 설정해보겠습니다.
이렇게 설정하게 되면 `http://jenkins_url/job/Demo-test/build?token=abc` 의 주소로 Get 요청을 보내게 되면 Jenkins 빌드가 시작됩니다.


Build → Invoke Gradle script를 클릭합니다.
Use Gradle Wrapper, Make gradlew executable 선택합니다.
Wrapper location → graddle wrapper가 들어 있는 경로를 설정합니다.
프로젝트 내에 gradle 폴더가 루트에 있다면 `${workspace}`라고 입력해주면 됩니다.

![16.png]({{site.url}}/assets/post-img/devops/0517/16.png)

Tasks에 필요한 task들을 나열합니다.

저장을 클릭하고 대시보드로 돌아가면 Item이 추가된 것을 확인할 수 있습니다. (방금 한 설정을 수정하려면 Demo-test 부분 클릭 → 구성으로 들어가면 됩니다.)

![18.png]({{site.url}}/assets/post-img/devops/0517/18.png)

## 2 Jenkins 빌드해보기 (수동)

### 2.1 Build Now 버튼을 클릭

![19.png]({{site.url}}/assets/post-img/devops/0517/19.png)

### 2.2 원격으로 빌드 유발 (Http Get 요청)

Item을 만들 때 원격으로 빌드 유발 설정을 했기 때문에 Get요청을 통해 원격으로 빌드를 유발시킬 수 있습니다.
새탭을 열고 아래의 URL을 입력해 보겠습니다.
`http://localhost:1234/job/Demo-test/build?token=abc`

![20.png]({{site.url}}/assets/post-img/devops/0517/20.png)

아무화면도 안뜨지만 다시 Jenkins로 돌아가보면

![21.png]({{site.url}}/assets/post-img/devops/0517/21.png)

새로운 빌드가 진행되는 것을 확인할 수 있습니다.

### 2.3 작업 공간에서 빌드 결과 확인

![22.png]({{site.url}}/assets/post-img/devops/0517/22.png)

![23.png]({{site.url}}/assets/post-img/devops/0517/23.png)

build/libs 폴더로 들어가면 현재 무슨버전으로 프로젝트가 빌드되었는지 확인할 수 있습니다.
build.gradle 에서 버전을 하나씩 올려주면 빌드가 잘 되었는지 파악하기 쉽습니다.

## 3. Git hooks 설정
