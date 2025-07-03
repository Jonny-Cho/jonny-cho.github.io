# 📝 블로그 포스트 표준화 도구

이 문서는 블로그 포스트의 일관된 구조와 품질을 유지하기 위한 도구들을 설명합니다.

## 🎯 목표

- **일관성**: 모든 포스트가 동일한 구조와 명명 규칙을 따름
- **효율성**: 템플릿과 자동화로 빠른 포스트 작성
- **품질**: 자동 검증으로 누락된 섹션이나 오타 방지
- **유지보수**: 표준 변경 시 일괄 적용 가능

## 🛠️ 도구 구성

### 1. VS Code 스니펫 (`.vscode/markdown.code-snippets`)

새 포스트 작성 시 사용할 수 있는 템플릿들입니다.

**사용법:**
```
// VS Code에서 .md 파일 편집 시
blogpost    // 기본 포스트 템플릿
algorithm   // 알고리즘 문제 전용 템플릿
spring      // Spring 관련 포스트 템플릿
gitpost     // Git 관련 포스트 템플릿
ref         // 참고자료 섹션
conclusion  // 마무리 섹션
codeex      // 코드 예제 섹션
```

### 2. CLI 포스트 생성기 (`scripts/new-post.js`)

대화형으로 새 포스트를 생성하는 도구입니다.

**사용법:**
```bash
# 대화형 포스트 생성
npm run new:post

# 특정 카테고리 포스트 생성
npm run new:algorithm
npm run new:spring
npm run new:git
npm run new:java

# 도움말
node scripts/new-post.js --help
```

**생성되는 구조:**
- Front matter (title, date, categories, tags)
- 카테고리별 맞춤 섹션 구조
- 표준 참고자료 및 마무리 섹션

### 3. 포스트 구조 검증기 (`scripts/validate-post-structure.js`)

기존 포스트들의 구조를 검증하고 문제점을 찾는 도구입니다.

**사용법:**
```bash
# 전체 포스트 검증
npm run validate:posts

# 특정 파일 검증
npm run validate:file content/git/2025-07-03-git-example.md

# 명령행에서 직접 실행
node scripts/validate-post-structure.js [파일경로]
```

**검증 항목:**
- 필수 섹션 누락 확인 (참고자료, 카테고리별 필수 섹션)
- Front matter 필드 확인 (title, date, categories)
- 표준 명명 규칙 준수 여부
- 구조 권장사항 (목차, 코드 블록 언어 명시 등)

### 4. 기존 포스트 표준화 도구 (`scripts/standardize-posts.js`)

기존 포스트들을 표준 형식으로 일괄 변환하는 도구입니다.

**사용법:**
```bash
# 미리보기 (실제 변경 없음)
npm run standardize:preview

# 백업 후 표준화
npm run standardize:backup

# 전체 표준화
npm run standardize:existing

# 특정 카테고리만
node scripts/standardize-posts.js --category=git

# 특정 파일만
node scripts/standardize-posts.js --file=content/git/example.md
```

**표준화 규칙:**
- `### 참고` → `### 참고자료`
- `### 참고 자료` → `### 참고자료`
- `## 참고 자료` → `### 참고자료`
- `#### 참고자료` → `### 참고자료`
- `### References` → `### 참고자료`
- `## 1. 마무리` → `## 마무리`
- `### 마무리` → `## 마무리`
- 연속된 빈 줄 정리
- 코드 블록 후 빈 줄 추가

## 📋 카테고리별 표준 구조

### Algorithm 포스트
```markdown
## 1. 문제 분석
### 1.1 문제 요약
### 1.2 입출력 조건
### 1.3 제약사항

## 2. 해결 방법
### 2.1 접근 방식
### 2.2 알고리즘 설계

## 3. 코드 구현

## 4. 복잡도 분석
### 4.1 시간복잡도
### 4.2 공간복잡도

## 마무리
### 참고자료
```

### Spring 포스트
```markdown
## 1. 개요
### 1.1 배경
### 1.2 목표

## 2. 환경 설정
### 2.1 의존성 추가
### 2.2 설정 파일

## 3. 구현

## 4. 테스트
### 4.1 단위 테스트
### 4.2 통합 테스트

## 5. 활용
### 5.1 실무 적용
### 5.2 베스트 프랙티스

## 마무리
### 참고자료
```

### Git 포스트
```markdown
## 1. 개요

## 2. 기본 사용법
### 2.1 기본 명령어
### 2.2 옵션과 플래그

## 3. 고급 활용

## 4. 실무 시나리오

## 5. 주의사항과 베스트 프랙티스
### 5.1 주의사항
### 5.2 베스트 프랙티스

## 마무리
### 참고자료
```

## 🔄 워크플로우

### 새 포스트 작성 시
1. `npm run new:post` 또는 카테고리별 명령어 실행
2. 생성된 템플릿 파일을 VS Code로 열기
3. 필요에 따라 스니펫(`ref`, `conclusion`, `codeex`) 활용
4. 작성 완료 후 `npm run validate:file [파일경로]`로 검증

### 기존 포스트 정리 시
1. `npm run standardize:preview`로 변경사항 미리보기
2. `npm run standardize:backup`으로 백업 후 표준화
3. `npm run validate:posts`로 전체 검증
4. Git으로 변경사항 확인 후 커밋

### 정기 점검
```bash
# 월 1회 정도 실행 권장
npm run validate:posts          # 구조 검증
npm run standardize:preview     # 표준화 필요사항 확인
```

## 🎨 VS Code 설정 권장사항

### 워크스페이스 설정 (`.vscode/settings.json`)
```json
{
  "markdown.suggest.paths.enabled": true,
  "markdown.updateLinksOnFileMove.enabled": "prompt",
  "files.associations": {
    "*.md": "markdown"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### 추천 확장프로그램
- Markdown All in One
- Markdown Preview Enhanced
- Auto Rename Tag
- GitLens

## 📊 통계 및 모니터링

### 검증 결과 예시
```
📊 검증 결과 요약
==================
전체 포스트: 87개
✅ 정상: 82개
❌ 문제 있음: 3개
⚠️ 경고 있음: 2개
```

### 표준화 결과 예시
```
📊 표준화 결과 요약
==================
전체 파일: 87개
수정된 파일: 15개
총 변경사항: 23개

📝 변경사항 상세:
   • 참고 → 참고자료: 12개
   • H2 참고 자료 → H3 참고자료: 3개
   • 번호가 붙은 마무리 → 마무리: 8개
```

## 🚀 고급 활용

### 커스텀 카테고리 추가
`scripts/new-post.js`의 `categories` 객체에 새 카테고리 추가:

```javascript
this.categories = {
  // 기존 카테고리들...
  'nextjs': {
    name: 'Next.js',
    sections: ['개요', '환경 설정', '구현', '배포']
  }
};
```

### 새로운 표준화 규칙 추가
`scripts/standardize-posts.js`의 `replacements` 배열에 새 규칙 추가:

```javascript
{ 
  from: /^### 결론$/gm, 
  to: '## 마무리',
  description: '결론 → 마무리'
}
```

### Git Hook 연동
```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run validate:posts
if [ $? -ne 0 ]; then
  echo "포스트 구조 검증 실패. 수정 후 다시 커밋하세요."
  exit 1
fi
```

## 📞 문제 해결

### 자주 발생하는 문제

**Q: 스니펫이 VS Code에서 작동하지 않아요**
A: `.vscode/markdown.code-snippets` 파일이 프로젝트 루트에 있는지 확인하고, VS Code를 재시작해보세요.

**Q: 새 포스트 생성 시 한글이 깨져요**
A: 터미널의 인코딩을 UTF-8로 설정하고, Node.js 최신 버전을 사용하세요.

**Q: 표준화 도구가 원하지 않는 변경을 해요**
A: `--dry-run` 플래그로 미리보기 후, 특정 파일만 처리하거나 규칙을 수정하세요.

**Q: 검증 도구에서 false positive가 발생해요**
A: `scripts/validate-post-structure.js`의 검증 규칙을 프로젝트에 맞게 조정하세요.

## 📈 성과 지표

이 도구들을 도입한 후 기대되는 개선사항:

- **작성 시간 30% 단축**: 템플릿과 스니펫 활용
- **구조 일관성 95% 달성**: 자동 검증과 표준화
- **리뷰 시간 50% 단축**: 표준화된 구조로 빠른 검토
- **SEO 개선**: 일관된 메타데이터와 구조
- **사용자 경험 향상**: 예측 가능한 포스트 구조

---

이 도구들을 통해 더 나은 블로그 콘텐츠를 만들어보세요! 🚀