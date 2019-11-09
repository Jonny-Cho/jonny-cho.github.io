---
layout: post
title: 노드 삭제 후 깔끔하게 프로젝트 세팅하기
category: node
tags: [node]
comments: true
---

* node를 설치하는 여러가지 방법이 있는데 이 중 어떤 걸로 node를 설치하고 관리한건지 전혀 기억이 나지 않는다.
* 이번에 다시 세팅할 때는 좀 적어놓자는 마음.
* 삭제 -> 프로젝트 세팅 -> expressJS -> DB Connection -> NPM Deploy 순서로 따라가보면 될 듯하다.

## 삭제하기

* [mac에서 'node.js'를 완전히 삭제하는 방법](https://gomugom.github.io/how-to-remove-node-from-macos/){:target="_blank"}
* 나의 경우 이 블로그에 더해 yarn, nvm관련 폴더, 파일들도 완전 삭제했다.

## nvm 설치

* nvm 깃허브 설명이 제일 좋다. 다른 블로그의 경우 최신버전이 아닐 수 있으니 이곳을 참고하도록 하자.
* [nvm 깃허브](https://github.com/nvm-sh/nvm){:target="_blank"}
* 한글은 [김정환블로그 - NVM으로 노드 버전 관리하기](http://jeonghwan-kim.github.io/2016/08/10/nvm.html){:target:="_blank"}
* `curl -o- https://` 로 시작하는 스크립트로 설치 (`brew install nvm`명령어를 사용하는 방법도 있다.)
* 설치되면 `(~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc)` 중 하나의 파일에 다음과 같은 스크립트가 추가된다. (나의 경우 `~/.bash_profile` 파일)  

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

* bash파일을 실행시켜서 변경사항을 적용한다. `source ~/.bash_profile`

## nvm으로 node 설치하기

* 이제 `nvm ls-remote` 명령로 설치가능한 node 버전을 확인할 수 있다.
* LTS(Long Term Support)버전을 설치한다. 현재 LTS는 12.13.0 `nvm install 12.13.0`. `nvm install --lts`명령어도 있네.
* `nvm ls` 설치된 Node 버전 목록 확인
* `nvm use node` 혹은 `nvm run node --version` 명령어를 사용하면 현재 사용하고 있는 node의 버전을 확인 할 수 있다.
* `nvm which 12.13.0` 명령어로 node 설치경로를 확인할 수 있다.
* `node-v`, `npm -v` node안에 npm이 포함되어 설치된다. 두 명령어로 설치된 버전을 확인하자.

### References
  * [mac에서 'node.js'를 완전히 삭제하는 방법](https://gomugom.github.io/how-to-remove-node-from-macos/){:target="_blank"}
  * [처음 시작하는 Node.js 개발 1 설치 및 버전관리](https://heropy.blog/2018/02/17/node-js-install/){:target="_blank"}
  * [처음 시작하는 Node.js 개발 2 npm](https://heropy.blog/2018/02/18/node-js-npm/){:target="_blank"}
  * [nvm 깃허브](https://github.com/nvm-sh/nvm){:target="_blank"}
  * [김정환블로그 - NVM으로 노드 버전 관리하기](http://jeonghwan-kim.github.io/2016/08/10/nvm.html){:target:="_blank"}