---
layout: post
title: 03-마크다운으로 포스팅 하기
category: githubpages
tags: [githubpages]
---

## 마크다운 문법 알아보기

* [마크다운 작성법](https://gist.github.com/ihoneymon/652be052a0727ad59601){: target="_blank"}

* 이걸 참고해서 어떤식으로 적어야 하는지 감을 잡아보자

## posting 할 때는 규칙을 꼭 지켜야 한다

* _posts 폴더 안에 카테고리별로 폴더를 만드는 것이 정리하기 좋다.
* _posts/githubpages 폴더 안에 2018-07-23-githubpages-03-posting.md 파일을 만든다.

*yyyy-mm-dd-category명-제목.md 의 순서를 반드시 지켜야 한다*

```
---
layout: post
title: 마크다운으로 포스팅 하기
category: githubpages
tags: [githubpages] #[태그1, 태그2] 같이 여러 태그들을 사용할 수 있다.
---


이 부분에 마크다운 문법으로 글을 쓴다

```

## git commit 하기
```shell
git add .
git commit -m "added post testing"
git push
```

---

### 참고자료
* [깃허브 코드 확인](https://github.com/Jonny-Cho/jonny-cho.github.io/commit/b9aa8159cb276e9032ce0698219533fc6c5ce364){: target="_blank" }
* [초보몽키의 개발공부로그](https://wayhome25.github.io/){: target="_blank" }
