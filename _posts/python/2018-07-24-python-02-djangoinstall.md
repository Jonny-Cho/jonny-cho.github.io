---
layout: post
title: python02-맥에 장고 설치하기
category: python
tags: [python]
comments: true
---

##장고 1.10.4버전 설치

`pip install django==1.10.4`

---

{{ }} 안의 이름은 원하는대로 정하시면 됩니다. 다만 {{ }} 안에 같은 이름이 있는 경우 같은 이름으로 넣어주세요.

##독립환경 설정하기 (Virtual Environment)

*pyenv-virtualenv 라이브러리 설치: `brew install pyenv-virtualenv`
*터미널 시작 시 자동 반영: `echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bash_profile`
*즉각 반영: `source ~/.bash_profile`
*폴더 생성: `mkdir {{ python_project }}`
*폴더 들어가기: `cd {{ python_project }}`
*파이썬 3.5.2버전 독립환경 설정: `pyenv virtualenv {{ my_python }}`
*독립환경 실행: `pyenv activate {{ my_python }}`


##장고 설치

1. 장고 설치하기: `pip install django==1.10.4`
2. 새로운 프로젝트 만들기: `django-admin startproject {{firstsite}}`
3. 기본 데이터베이스 설정하기: `python manage.py migrate`
4. 로컬 서버 시작하기: `python manage.py runserver`
5. 로컬 서버 종료: CONTROL + C