---
layout: post
title: python01-맥에 파이썬 설치하기
category: python
tags: [python]
comments: true
---

##맥에는 기본적으로 2.7버전의 파이썬이 설치 되어 있습니다.

*파이썬 버전 확인: python --version
*파이썬 실행: python
*파이썬 실행 종료: quit()

##하지만 저희는 3.5.2버전의 파이썬을 이용해서 개발해보겠습니다.

##Homebrew 설치

1. 터미널(terminal) 열기
2. 아래 명령 복사 붙여넣기
3. ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

##파이썬 관리도구 pyenv 설치

1. brew 최신 버전 업데이트: brew update
2. pyenv 설치하기: brew install pyenv
3. 시작 시 자동 실행: echo 'eval "$(pyenv init -)"' >> ~/.bash_profile
4. 즉각 반영: source ~/.bash_profile
5. 파이썬 버전 확인: pyenv versions
6. 현재 설치된 파이썬 리스트: pyenv install --list
7. 파이썬 3.5.2버전 설치: pyenv install 3.5.2
8. 파이썬 3.5.2버전 기본값 설정: pyenv global 3.5.2
