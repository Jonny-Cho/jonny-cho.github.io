const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class BlogPostGenerator {
  constructor() {
    this.categories = {
      'git': {
        name: 'Git & 버전 관리',
        sections: ['개요', '기본 사용법', '고급 활용', '실무 시나리오', '주의사항과 베스트 프랙티스']
      },
      'spring': {
        name: 'Spring Framework',
        sections: ['개요', '환경 설정', '구현', '테스트', '활용']
      },
      'java': {
        name: 'Java',
        sections: ['개요', '기본 개념', '구현 예제', '활용 방안']
      },
      'algorithm': {
        name: '알고리즘',
        sections: ['문제 분석', '해결 방법', '코드 구현', '복잡도 분석']
      },
      'database': {
        name: 'Database',
        sections: ['개요', '기본 개념', '실습', '활용']
      },
      'react': {
        name: 'React',
        sections: ['개요', '환경 설정', '구현', '최적화']
      },
      'javascript': {
        name: 'JavaScript',
        sections: ['개요', '기본 문법', '실습 예제', '활용']
      },
      'vue': {
        name: 'Vue.js',
        sections: ['개요', '환경 설정', '구현', '최적화']
      },
      'nodejs': {
        name: 'Node.js',
        sections: ['개요', '환경 설정', '구현', '배포']
      },
      'typescript': {
        name: 'TypeScript',
        sections: ['개요', '타입 시스템', '실습', '활용']
      },
      'productivity': {
        name: '생산성',
        sections: ['개요', '기본 기능', '고급 활용', '실무 팁', '워크플로우 개선']
      }
    };
    this.postData = {};
  }

  async createNewPost() {
    console.log('📝 새로운 블로그 포스트 생성기');
    console.log('================================\n');
    
    try {
      await this.collectPostInfo();
      const template = this.generateTemplate();
      const filePath = this.savePost(template);
      
      console.log(`\n✅ 포스트가 생성되었습니다!`);
      console.log(`📁 파일 경로: ${filePath}`);
      console.log(`📝 VS Code로 열기: code "${filePath}"`);
      console.log(`\n💡 VS Code에서 다음 스니펫을 사용하세요:`);
      console.log(`   - blogpost: 기본 포스트 템플릿`);
      console.log(`   - ${this.postData.category}: ${this.categories[this.postData.category].name} 전용 템플릿`);
      console.log(`   - ref: 참고자료 섹션`);
      console.log(`   - conclusion: 마무리 섹션`);
      console.log(`   - codeex: 코드 예제 섹션`);
      
    } catch (error) {
      console.error(`❌ 오류 발생: ${error.message}`);
    }
  }

  async collectPostInfo() {
    this.postData.title = await this.question('📝 제목을 입력하세요: ');
    this.postData.category = await this.selectCategory();
    this.postData.tags = await this.question('🏷️  태그를 입력하세요 (쉼표로 구분): ');
    this.postData.description = await this.question('📄 간단한 설명을 입력하세요: ');
    this.postData.draft = await this.question('📋 초안으로 저장하시겠습니까? (y/N): ') === 'y';
  }

  async selectCategory() {
    console.log('\n📂 카테고리를 선택하세요:');
    const categoryKeys = Object.keys(this.categories);
    categoryKeys.forEach((key, index) => {
      console.log(`${index + 1}. ${key} (${this.categories[key].name})`);
    });
    
    const choice = await this.question('\n번호를 입력하세요: ');
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < categoryKeys.length) {
      return categoryKeys[index];
    }
    
    console.log('⚠️  잘못된 선택입니다. 기본값(git)을 사용합니다.');
    return 'git';
  }

  generateTemplate() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    
    const tags = this.postData.tags
      .split(',')
      .map(tag => `'${tag.trim()}'`)
      .join(', ');

    const categoryConfig = this.categories[this.postData.category];
    const sections = this.generateSections(categoryConfig.sections);

    return `---
title: '${this.postData.title}'
date: ${date} ${time}
categories: '${this.postData.category}'
draft: ${this.postData.draft}
tags: [${tags}]
---

# ${this.postData.title}

${this.postData.description}

## 목차

${sections}

## 마무리

### 핵심 포인트

1. **포인트 1**: 설명
2. **포인트 2**: 설명
3. **포인트 3**: 설명

### 참고자료

**공식 문서:**
- [공식 문서 제목](URL)

**관련 자료:**
- [관련 자료 제목](URL)

**커뮤니티:**
- [커뮤니티 링크](URL)

---

**태그**: ${this.postData.tags.split(',').map(tag => `#${tag.trim()}`).join(' ')}
`;
  }

  generateSections(sections) {
    return sections.map((section, index) => {
      const sectionNumber = index + 1;
      
      switch(this.postData.category) {
        case 'algorithm':
          return this.generateAlgorithmSection(sectionNumber, section);
        case 'spring':
          return this.generateSpringSection(sectionNumber, section);
        case 'git':
          return this.generateGitSection(sectionNumber, section);
        case 'productivity':
          return this.generateProductivitySection(sectionNumber, section);
        default:
          return this.generateDefaultSection(sectionNumber, section);
      }
    }).join('\n\n');
  }

  generateAlgorithmSection(num, section) {
    const templates = {
      '문제 분석': `## ${num}. 문제 분석

### ${num}.1 문제 요약

문제를 한 줄로 요약하세요.

### ${num}.2 입출력 조건

**입력:**
- 입력 조건

**출력:**
- 출력 조건

### ${num}.3 제약사항

- 제약사항`,

      '해결 방법': `## ${num}. 해결 방법

### ${num}.1 접근 방식

문제 해결 접근 방식을 설명하세요.

### ${num}.2 알고리즘 설계

1. 단계 1
2. 단계 2
3. 단계 3`,

      '코드 구현': `## ${num}. 코드 구현

\`\`\`java
// 솔루션 코드를 작성하세요
\`\`\``,

      '복잡도 분석': `## ${num}. 복잡도 분석

### ${num}.1 시간복잡도

- **시간복잡도**: O(n)
- **설명**: 시간복잡도 설명

### ${num}.2 공간복잡도

- **공간복잡도**: O(1)
- **설명**: 공간복잡도 설명`
    };

    return templates[section] || `## ${num}. ${section}\n\n내용을 작성하세요.`;
  }

  generateSpringSection(num, section) {
    const templates = {
      '환경 설정': `## ${num}. 환경 설정

### ${num}.1 의존성 추가

\`\`\`xml
<!-- Maven 의존성 -->
\`\`\`

### ${num}.2 설정 파일

\`\`\`yaml
# application.yml 설정
\`\`\``,

      '구현': `## ${num}. 구현

### ${num}.1 주요 컴포넌트 구현

\`\`\`java
// Java 코드
\`\`\``,

      '테스트': `## ${num}. 테스트

### ${num}.1 단위 테스트

\`\`\`java
// JUnit 테스트 코드
\`\`\``,

      '활용': `## ${num}. 활용

### ${num}.1 실무 적용

실무 적용 방안을 설명하세요.

### ${num}.2 베스트 프랙티스

1. **프랙티스 1**: 설명
2. **프랙티스 2**: 설명`
    };

    return templates[section] || `## ${num}. ${section}\n\n내용을 작성하세요.`;
  }

  generateGitSection(num, section) {
    const templates = {
      '기본 사용법': `## ${num}. 기본 사용법

### ${num}.1 기본 명령어

\`\`\`bash
# 기본 git 명령어
\`\`\`

### ${num}.2 옵션과 플래그

\`\`\`bash
# 고급 옵션들
\`\`\``,

      '고급 활용': `## ${num}. 고급 활용

### ${num}.1 고급 기능 1

\`\`\`bash
# 고급 명령어 예제
\`\`\``,

      '실무 시나리오': `## ${num}. 실무 시나리오

### ${num}.1 시나리오 1

**상황:** 상황 설명

\`\`\`bash
# 해결 방법
\`\`\``,

      '주의사항과 베스트 프랙티스': `## ${num}. 주의사항과 베스트 프랙티스

### ${num}.1 주의사항

- 주의사항 1
- 주의사항 2

### ${num}.2 베스트 프랙티스

1. **프랙티스 1**: 설명
2. **프랙티스 2**: 설명`
    };

    return templates[section] || `## ${num}. ${section}\n\n내용을 작성하세요.`;
  }

  generateProductivitySection(num, section) {
    const templates = {
      '기본 기능': `## ${num}. 기본 기능

### ${num}.1 필수 기능 소개

기본적인 필수 기능들을 설명합니다.

### ${num}.2 설정 방법

\`\`\`
설정 예제
\`\`\``,

      '고급 활용': `## ${num}. 고급 활용

### ${num}.1 고급 기능 활용

고급 기능을 활용하는 방법을 설명합니다.

### ${num}.2 커스터마이징

사용자 환경에 맞는 커스터마이징 방법을 제시합니다.`,

      '실무 팁': `## ${num}. 실무 팁

### ${num}.1 자주 사용하는 패턴

실무에서 자주 사용되는 패턴들을 소개합니다.

### ${num}.2 시간 절약 꿀팁

업무 효율성을 높이는 꿀팁들을 제공합니다.`,

      '워크플로우 개선': `## ${num}. 워크플로우 개선

### ${num}.1 개선 전후 비교

기존 방식과 개선된 방식을 비교합니다.

### ${num}.2 측정 가능한 효과

실제로 얻을 수 있는 효과를 구체적으로 제시합니다.`
    };

    return templates[section] || `## ${num}. ${section}\n\n내용을 작성하세요.`;
  }

  generateDefaultSection(num, section) {
    return `## ${num}. ${section}

### ${num}.1 기본 개념

기본 개념을 설명하세요.

### ${num}.2 실습 예제

\`\`\`javascript
// 예제 코드
\`\`\``;
  }

  savePost(template) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const slug = this.postData.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const fileName = `${dateStr}-${slug}.md`;
    const dirPath = path.join('content', this.postData.category);
    const filePath = path.join(dirPath, fileName);

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 디렉토리 생성: ${dirPath}`);
    }

    fs.writeFileSync(filePath, template);
    return filePath;
  }

  question(prompt) {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  }
}

// CLI 인자 처리
const args = process.argv.slice(2);
const typeFlag = args.find(arg => arg.startsWith('--type='));
const helpFlag = args.includes('--help') || args.includes('-h');

if (helpFlag) {
  console.log(`
📝 블로그 포스트 생성기 도움말

사용법:
  node scripts/new-post.js                    # 대화형 모드
  node scripts/new-post.js --type=algorithm   # 특정 카테고리 지정

사용 가능한 카테고리:
  git, spring, java, algorithm, database, react, javascript, vue, nodejs, typescript

VS Code 스니펫:
  blogpost  - 기본 포스트 템플릿
  algorithm - 알고리즘 포스트 템플릿  
  spring    - Spring 포스트 템플릿
  gitpost   - Git 포스트 템플릿
  ref       - 참고자료 섹션
  conclusion - 마무리 섹션
  codeex    - 코드 예제 섹션
`);
  process.exit(0);
}

// 실행
if (require.main === module) {
  const generator = new BlogPostGenerator();
  
  // 타입이 지정된 경우 해당 카테고리로 설정
  if (typeFlag) {
    const type = typeFlag.split('=')[1];
    if (generator.categories[type]) {
      generator.postData.category = type;
      console.log(`📂 카테고리 자동 선택: ${type}`);
    }
  }
  
  generator.createNewPost().then(() => {
    rl.close();
  }).catch(error => {
    console.error(`❌ 오류: ${error.message}`);
    rl.close();
    process.exit(1);
  });
}

module.exports = BlogPostGenerator;