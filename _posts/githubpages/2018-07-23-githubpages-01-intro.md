---
layout: post
title: 지킬로 Github Pages 블로그 만들기 1
category: githubpages
tags: [githubpages]
comments: true
---

# 지킬로 Github Pages 블로그 만들기 1

## 깃허브 아이디 만들기

* 새 레퍼지토리 만들기
* username.github.io 의 형식이어야 한다.
* initialise this repository with a README 체크하기

## 지킬 템플릿 가져오기
* Jekyll 템플릿 clone
* 새로만든 저장소 clone
* 복사 붙여넣기

## 깃허브로 푸쉬하기 (터미널)
```shell
git add .
git git commit -m "First setting for jekyll blog"
git push
```

## CSS 세팅
* username.github.io 에 들어간다
* CSS적용이 안되었다. 개발자 도구로 확인해보면 CSS링크가 다른 것을 확인 할 수 있다.
* _config.yml 파일에 들어가서 baseurl: ”” 으로 바꿔준다. (따옴표안에 경로가 지정되어 있던 것을 삭제해준다)
* 새로고침해보자. 1단계 클리어.