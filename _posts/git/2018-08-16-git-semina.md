---
layout: post
title: 마이크로소프트 Git Learning 세미나에 다녀왔다.
category: git
tags: [git]
comments: true
---

Event Attendee code
msevent298cu

2:00 - 5:00 git 기초
5:00 - 6:00 git advanced

발표자 Microsoft student partner 고희원

---

깃을 저장소 용도로만 사용하고 있어서
협업으로서의 git을 배우기 위해 참여
merge나 branch에 익숙해지는게 목표
충돌해결까지 되면 금상첨화

---
[이론]

## Intro

1) Linux 기본 Command

```bash

ls
ls -al
clear
cd
cd ..
mkdir
rm -rf
rmdir - 디렉토리 지우기

```

2) 코드 편집기 설치

3) [깃허브링크](https://github.com/HuiwonKo/MSP_Seminar_20180727) 에서 pdf 다운로드

## Version Control System, Git, Github

1) VCS - 과거 특정 시점의 버전을 다시 불러올 수 있는 시스템

local VCS - Mac OSX의 RCS
central VCS - CVCS
**distributed(분산) VCS - Git, Mercurial, Bazaar**

2) Github
- Git 이라는 도구를 응용할 때 필요한 원격 저장소 사이트
- 각종 Remote Repository(원격 저장소)들의 집합

## Practice Setting

git init - Working Directory
이제부터 깃이 이 폴더를 관리하겠다
git add - Staging Area
git commit - Local Repository
git push - Remote Repository

## Git Workflow

git init
git status
git add 파일명
git commit -m "커밋명"

git remote add origin 경로
origin은 별명
git push origin master
master는 브랜치

[Tip]
* commit은 의미있는 단위로 끊어서
* 깃푸쉬는 신중하게

---

[실습]

## Git Workflow Practice (1)

## Git Workflow Practice (2)

## Collaborate with Git Practice - Pull Request

```bash

```


##


### 참고자료
* [Git Learning with Microsoft Github - onoffmix](https://onoffmix.com/event/147910)

* [깃허브링크](https://github.com/HuiwonKo/MSP_Seminar_20180727)