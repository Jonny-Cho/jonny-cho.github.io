---
title: 'AI가 직접 코딩한다고? Claude Code와 블로그 목차 기능 구현기'
date: 2025-07-08 14:00:00
categories: ai
draft: false
tags: ['Claude Code', 'AI Agent', '개발생산성', '페어프로그래밍', 'AI도구', 'TOC']
---

개발자의 AI 도구 인식을 바꾼 결정적 순간과 실제 프로젝트 적용 경험담입니다.

## Part 1: 또 다른 AI 코딩 도구라고?

솔직히 말하면, Claude Code를 처음 들었을 때 별로 기대하지 않았습니다.

### 기존 AI 도구들의 한계

**GitHub Copilot**을 쓰면서 느꼈던 아쉬움들이 있었거든요.

```javascript
// Copilot이 제안하는 코드
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

코드 자동완성은 분명히 도움이 되지만, 결국 제안만 해줄 뿐입니다. 여러 파일을 오가며 수정해야 하는 작업에서는 한계가 명확했죠. 컴포넌트를 만들려면:

1. 새 파일 생성 (수동)
2. import문 추가 (수동) 
3. 다른 파일에서 import (수동)
4. 스타일 파일 생성 (수동)
5. 타입 정의 (수동)

모든 연결 작업은 여전히 제가 해야 했습니다.

**ChatGPT**도 마찬가지였습니다.

```
나: "React 컴포넌트 만들어줘"
ChatGPT: "여기 코드입니다..."
나: 복사 → 새 파일 생성 → 붙여넣기 → 에러 발생 → 다시 질문
```

파일 구조를 이해하지 못하니 맥락에 맞지 않는 답변을 주는 경우도 많았고, 기존 프로젝트의 컨벤션과 다른 코드를 제공하기 일쑤였습니다.

```
현실적인 개발 플로우:
1. AI한테 질문
2. 코드 복사
3. 파일 찾아서 붙여넣기  
4. import 에러 발생
5. 경로 수정
6. 타입 에러 발생
7. 다시 질문
8. 반복...
```

### 처음 만난 Claude Code의 충격

그래서 "Claude Code"라는 이름을 들었을 때도 "또 다른 ChatGPT 변형이겠지"라고 생각했습니다.

첫 번째 충격은 Claude Code가 제 프로젝트 구조를 **직접 탐색**한다는 것이었습니다.

```bash
# Claude가 실제로 실행하는 명령들
ls src/components/
cat package.json
grep -r "component" src/
cat gatsby-config.js
```

"파일 구조가 어떻게 되어 있나요?"라고 묻지 않아도, 알아서 프로젝트를 분석하기 시작했습니다. 마치 신입 개발자가 첫 출근해서 코드베이스를 둘러보는 것처럼요.

두 번째 충격은 **직접 파일을 수정**한다는 것이었습니다.

제가 "블로그에 목차 기능을 추가하고 싶어요"라고 말했더니:

1. 기존 컴포넌트 구조 분석 ✓
2. 새 컴포넌트 파일 생성 ✓  
3. 스타일 파일 생성 ✓
4. 템플릿 파일 수정 ✓
5. 설정 파일 업데이트 ✓

이 모든 것을 **동시에** 처리했습니다. 저는 그냥 지켜만 보고 있었어요.

## Part 2: 실전 적용 - 블로그 목차 기능 구현

이제 실제로 Claude Code와 함께 블로그 목차 기능을 구현한 과정을 자세히 보여드리겠습니다.

### 요구사항 전달

저는 단순하게 이렇게 말했습니다:

> "블로그 포스트 오른쪽에 목차(Table of Contents)를 추가하고 싶어. ZoomKoding 블로그처럼 스크롤에 따라 현재 섹션이 하이라이트되는 기능도 포함해서."

일반적인 AI라면 "어떤 기술 스택을 사용하시나요?", "파일 구조가 어떻게 되어 있나요?" 같은 질문을 했을 겁니다.

### Claude의 분석 과정

하지만 Claude Code는 바로 행동에 옮겼습니다:

```bash
# 1. 프로젝트 구조 파악
ls -la
cat package.json
cat gatsby-config.js

# 2. 기존 컴포넌트 구조 분석  
ls src/components/
cat src/templates/blog-template.js
cat src/layout/index.js

# 3. 스타일링 방식 확인
ls src/styles/
cat src/styles/_variables.scss
```

놀라운 점은 Claude가 **제 프로젝트의 특성을 완벽히 파악**했다는 것입니다:

- Gatsby v5 기반 블로그
- SCSS 모듈 사용  
- 컴포넌트별 디렉토리 구조
- 기존 레이아웃 시스템
- 반응형 디자인 패턴

### 단계별 구현 과정

#### 1단계: TableOfContents 컴포넌트 생성

Claude가 `src/components/table-of-contents/index.js` 파일을 생성했습니다:

```javascript
import React, { useEffect, useState } from 'react';
import './style.scss';

const TableOfContents = ({ html }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // HTML에서 헤딩 추출
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4');
    
    const headingData = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      const level = parseInt(heading.tagName.substring(1));
      return { id, text: heading.textContent, level };
    });

    setHeadings(headingData);
  }, [html]);

  // 스크롤 추적 로직
  useEffect(() => {
    const handleScroll = () => {
      // 현재 보이는 섹션 감지
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <nav className="table-of-contents">
      {/* TOC 렌더링 */}
    </nav>
  );
};

export default TableOfContents;
```

**놀라운 점들:**
- 제 프로젝트의 HTML 구조를 이해하고 있음
- `gatsby-remark-autolink-headers` 플러그인 사용을 파악
- React Hooks 패턴을 기존 컴포넌트와 일치시킴

#### 2단계: 스타일링 작업

동시에 `src/components/table-of-contents/style.scss` 파일도 생성:

```scss
.table-of-contents {
  position: sticky;
  top: 75px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 20px;
  
  &__item {
    &.active > &__link {
      color: #5f2eea;
      font-weight: 500;
      background-color: rgba(95, 46, 234, 0.08);
    }
  }
  
  &__link {
    font-size: 12px;
    line-height: 1.6;
    color: rgba(55, 53, 47, 0.6);
    word-break: keep-all; // 한글 고려!
  }
}
```

Claude가 **제 블로그의 디자인 시스템을 파악**하고 있었습니다:
- 기존 컬러 팰레트 사용
- 한글 텍스트를 위한 `word-break: keep-all`
- SCSS BEM 네이밍 컨벤션 준수

#### 3단계: 템플릿 통합

`src/templates/blog-template.js` 파일을 수정해서 TOC를 통합:

```javascript
import TableOfContents from '../components/table-of-contents';

function BlogTemplate({ data }) {
  const curPost = new Post(data.cur);
  const showToc = data.cur.frontmatter.toc !== false;

  return (
    <>
      <Layout>
        <PostHeader post={curPost} />
        <PostContent html={curPost.html} />
        <PostNavigator prevPost={prevPost} nextPost={nextPost} />
      </Layout>
      {showToc && (
        <aside className="blog-post-toc">
          <TableOfContents html={curPost.html} />
        </aside>
      )}
    </>
  );
}
```

#### 4단계: GraphQL 스키마 확장

`gatsby-node.js`에서 frontmatter 타입 정의도 추가:

```javascript
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      toc: Boolean
    }
  `;
  
  createTypes(typeDefs);
};
```

### 문제 발견과 해결

구현 후 테스트해보니 문제가 발생했습니다. 목록 페이지에서 상세 페이지로 넘어갈 때 **레이아웃이 어긋나는 현상**이었죠.

저는 그냥 "목록에서 상세로 넘어가면 본문이 왼쪽으로 이동해요"라고 언급했을 뿐인데, Claude가 바로 문제를 파악했습니다:

> "현재 본문과 목차를 flexbox로 묶어서 가운데 정렬하고 있어서 목차 유무에 따라 본문 위치가 달라지는군요. ZoomKoding 사이트처럼 목차를 fixed 위치로 변경하겠습니다."

```scss
// 문제 해결 코드
.blog-post-toc {
  position: fixed;  // flex에서 fixed로 변경
  top: 75px;
  right: 40px;      // 화면 끝에서 여백 확보
  width: 340px;
  z-index: 1;
  pointer-events: none; // 코드 블록과 겹칠 때 우선순위
  
  * {
    pointer-events: auto; // TOC 링크는 클릭 가능
  }
}
```

### 세부 개선 작업

기본 기능 완성 후, 사용자 경험을 위한 세부 개선도 계속 진행되었습니다:

**1) 목차 자동 스크롤**
```javascript
// 활성 섹션이 목차 화면 밖으로 나가면 자동 스크롤
useEffect(() => {
  if (activeId) {
    const activeElement = document.querySelector('.table-of-contents__item.active');
    if (activeElement) {
      activeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }
}, [activeId]);
```

**2) 브라우저 스크롤바 스타일링**
```scss
html {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }
}
```

**3) TOC 스크롤바 완전 숨김**
```scss
.table-of-contents {
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none; // Firefox
}
```

## Part 3: AI와 페어 프로그래밍하는 경험

### 협업 포인트

Claude Code와 작업하면서 흥미로웠던 점은 **언제 개입하고 언제 맡겨야 하는지**를 배우게 된 것입니다:

**제가 주도한 부분:**
- 요구사항 정의 ("ZoomKoding처럼")
- 사용자 경험 피드백 ("목차가 너무 오른쪽에 붙어보여")
- 비즈니스 로직 결정 (`toc: false`로 비활성화 옵션)

**Claude가 주도한 부분:**
- 기술적 구현 방법 선택
- 코드 아키텍처 설계
- 크로스 브라우저 호환성
- 성능 최적화 (스크롤 이벤트 디바운싱 등)

### 새로운 개발 프로세스

```
기존 방식:
설계 → 컴포넌트 생성 → 스타일링 → 테스트 → 디버깅 → 리팩토링
(각 단계를 순차적으로, 혼자서)

Claude Code 방식:  
요구사항 설명 → [Claude가 전체 구현] → 피드백 → 개선
(병렬적으로, 협업하며)
```

**시간 비교:**
- 기존 방식: 반나절 (4-6시간) 예상
- Claude Code: 실제 30분만에 완성

### 기존 방식 vs Claude Code

| 구분 | 기존 방식 | Claude Code 방식 |
|------|-----------|------------------|
| **파일 생성** | 수동으로 하나씩 | 한 번에 모든 파일 |
| **import 관리** | 수동으로 추가 | 자동으로 연결 |
| **타입 안전성** | 에러 발생 후 수정 | 처음부터 올바르게 |
| **크로스 브라우저** | 나중에 확인 | 처음부터 고려 |
| **접근성** | 놓치기 쉬움 | 기본적으로 적용 |
| **성능 최적화** | 나중에 개선 | 처음부터 최적화 |

### 여전히 사람이 필요한 영역

물론 모든 게 완벽하지는 않습니다:

**설계 영역:**
- 비즈니스 요구사항 해석
- 사용자 경험 판단  
- 아키텍처 방향성 결정

**검증 영역:**
- 보안 취약점 점검
- 성능 임계점 판단
- 팀 컨벤션 준수 여부

**소통 영역:**
- 동료 개발자와의 협업
- 디자이너와의 커뮤니케이션
- 비개발 팀원들과의 조율

하지만 이런 한계들마저도 "아직은"이라는 단서가 붙는 것 같습니다.

## 마무리: 개발자 역할의 진화

Claude Code와 함께 작업하면서 제 역할이 바뀌었습니다:

**이전**: 직접 코딩하는 사람  
**이후**: 요구사항을 설명하고 결과를 검토하는 사람

마치 시니어 개발자가 주니어에게 업무를 설명하고 코드 리뷰를 하는 느낌이었습니다. 차이점이 있다면 이 "주니어"는:

- 24시간 일할 수 있고
- 실수를 해도 재빨리 수정하며  
- 절대 기분 나빠하지 않고
- 여러 기술을 동시에 완벽하게 구사한다는 것이죠.

Claude Code와의 첫 만남과 실전 적용은 그야말로 충격적이었습니다. "AI가 코딩을 도와준다"는 수준을 넘어서 "AI와 함께 개발한다"는 새로운 패러다임을 경험했습니다.

다음 편에서는 Claude Code를 1개월간 사용하면서 느낀 변화들과 AI 시대 개발자의 미래에 대한 생각들을 공유해보겠습니다.
