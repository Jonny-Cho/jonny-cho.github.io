---
layout: post
title: 마이크로소프트 Git Learning 세미나에 다녀왔다.
category: git
tags: [git, 세미나]
---

2:00 - 5:00 git 기초  
5:00 - 6:00 git advanced

발표자 Microsoft student partner  
고희원, 다영

---

* 깃을 저장소 용도로만 사용하고 있어서 협업으로서의 git을 배우기 위해 참여.
* merge와 branch에 익숙해지는게 목표.

---
[이론]

## Git 기초

### Intro

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

3) [깃허브링크](https://github.com/ekdud2412/MSP_Seminar_20180816) 에서 pdf 다운로드

#### Version Control System, Git, Github

1) VCS - 과거 특정 시점의 버전을 다시 불러올 수 있는 시스템

* local VCS - Mac OSX의 RCS
* central VCS - CVCS
* distributed(분산) VCS - **Git**, Mercurial, Bazaar

2) Github
- Git 이라는 도구를 응용할 때 필요한 원격 저장소 사이트
- 각종 Remote Repository(원격 저장소)들의 집합

### Practice Setting

```bash
git init - Working Directory
git add - Staging Area
git commit - Local Repository
#commit은 변화의 단위라는 말이 의미있었다.

git push - Remote Repository
```

### Git Workflow

```bash
git init
git status
git add 파일명
git commit -m "커밋명"

git remote add origin GighubURL
origin은 별명
git push origin master
master는 브랜치
```

[Tip]
* commit은 의미있는 단위로 끊어서
* 깃푸쉬는 신중하게

------------

[실습]

### Git Workflow Practice (1)

* workflow 익히기

```bash
git init
git add a.py
git commit -m "first commit"
git add remote origin 경로
git push -u origin master
```

### Git Workflow Practice (2)

* commit 여러번 한 후 한번에 push하기

```bash
# git show, git log, git shortlog, git status 활용해서 추적
git add b.py
git commit -m "add b.py"
git add c.py
git commit -m "add c.py"
git push
```

## Collaborate with Git Practice - Pull Request


![Collaborate]({{site.url}}/assets/post-img/git/collaborate.png)


### 협업하기
    - Setting/colaborators에서 이메일추가
    - 상대방은 이메일로 수락
    - 같이 push가능

### Branch
    - master branch
    - feature/topic branch
        + 기능에 영향받지 않는 독립적인 브랜치
    - merge
        + Feature tip에서 작업한내용을 master branch와 병합

> 깨달음. master가 실제 프로젝트에 영향을 주는 브랜치고 나머지는 master에 merge하기 전에 테스트하는 브랜치.

### branch 만들기

```bash
# 만들기, 이동하기
1) git branch <branch name> -> git checkout <branch name>
# 만들고 이동 한번에
2) git checkout -b <branch name>

git checkout - b develop
git add <file name / directory name>
git commit -m "<commit message>"
git remote add origin <URL>
git push -u origin develop
# develop 브랜치로 push
```

### Pull Request
branch에서 완료된 작업을 리뷰 후 master로 merge 요청하기 위해 사용

[사원]
* develop branch에 수정사항을 push한다
* Compare & pull request클릭
* 참고사항 입력 후 Create pull request 클릭

[매니저]
* Merge pull request 클릭
* Confirm merge 클릭

develop 브랜치에서 작업하던 수정사항이 master 브랜치에 반영되었다.

---

### 기억할 명령어

* git show
커밋한 내용이 보여지는 명령어

* git blame
누가 이 코드를 작성했는지 보여주는 명령어. 말그대로 blame

* git log
commit 코드, author, date, 커밋내용이 보여진다. 위에 있을수록 최신

* git shortlog
커밋 내용만 보여진다. 밑에 있을수록 최신

* fetch/clone
* pull
* checkout


### 참고자료
* [Git Learning with Microsoft Github - onoffmix](https://onoffmix.com/event/147910)

* [발표자료 깃허브링크](https://github.com/ekdud2412/MSP_Seminar_20180816)
