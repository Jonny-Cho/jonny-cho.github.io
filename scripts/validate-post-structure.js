const fs = require('fs');
const glob = require('glob');
const path = require('path');

// 표준 섹션 요구사항
const REQUIRED_SECTIONS = {
  all: ['참고자료'], // 모든 포스트에 필요한 섹션
  algorithm: ['문제 분석', '해결 방법', '코드 구현', '복잡도 분석'],
  spring: ['환경 설정', '구현'],
  git: ['기본 사용법'],
  java: ['기본 개념'],
  database: ['기본 개념'],
  react: ['환경 설정', '구현'],
  javascript: ['기본 문법'],
  vue: ['환경 설정', '구현'],
  nodejs: ['환경 설정', '구현'],
  typescript: ['타입 시스템']
};

// 표준 참고자료 패턴
const REFERENCE_PATTERNS = [
  '### 참고자료',
  '### 참고',
  '### 참고 자료',
  '## 참고 자료',
  '#### 참고자료',
  '### References'
];

// 표준 마무리 패턴
const CONCLUSION_PATTERNS = [
  '## 마무리',
  /## \d+\.\s*마무리/,
  '### 마무리'
];

class PostValidator {
  constructor() {
    this.results = [];
    this.stats = {
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: 0
    };
  }

  validateAll() {
    console.log('📋 블로그 포스트 구조 검증 시작...\n');
    
    const files = glob.sync('content/**/*.md');
    this.stats.total = files.length;

    files.forEach(file => {
      const result = this.validatePost(file);
      if (result.issues.length > 0 || result.warnings.length > 0) {
        this.results.push(result);
      }
      
      if (result.issues.length === 0) {
        this.stats.valid++;
      } else {
        this.stats.invalid++;
      }
      
      if (result.warnings.length > 0) {
        this.stats.warnings++;
      }
    });

    this.reportResults();
  }

  validatePost(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontMatter = this.extractFrontMatter(content);
    const category = this.extractCategory(filePath, frontMatter);
    const sections = this.extractSections(content);
    
    const issues = [];
    const warnings = [];
    
    // 1. 필수 섹션 확인
    const requiredSections = [
      ...REQUIRED_SECTIONS.all,
      ...(REQUIRED_SECTIONS[category] || [])
    ];

    const missingSections = requiredSections.filter(
      section => !this.hasSectionVariant(sections, section)
    );

    if (missingSections.length > 0) {
      issues.push({
        type: 'missing_sections',
        message: `누락된 필수 섹션: ${missingSections.join(', ')}`,
        severity: 'error'
      });
    }

    // 2. 참고자료 섹션 표준화 확인
    const refSection = this.findReferenceSection(sections);
    if (refSection && refSection !== '### 참고자료') {
      warnings.push({
        type: 'non_standard_reference',
        message: `비표준 참고자료 섹션: "${refSection}" → "### 참고자료"로 변경 권장`,
        severity: 'warning'
      });
    }

    // 3. 마무리 섹션 확인
    const conclusionSection = this.findConclusionSection(sections);
    if (conclusionSection && !conclusionSection.includes('## 마무리')) {
      warnings.push({
        type: 'non_standard_conclusion',
        message: `비표준 마무리 섹션: "${conclusionSection}" → "## 마무리"로 변경 권장`,
        severity: 'warning'
      });
    }

    // 4. Front matter 검증
    const frontMatterIssues = this.validateFrontMatter(frontMatter);
    issues.push(...frontMatterIssues);

    // 5. 구조 권장사항 확인
    const structureWarnings = this.checkStructureRecommendations(content, category);
    warnings.push(...structureWarnings);

    return {
      file: filePath,
      category,
      sections: sections.length,
      issues,
      warnings,
      frontMatter
    };
  }

  extractFrontMatter(content) {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) return {};

    const frontMatter = {};
    frontMatterMatch[1].split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        frontMatter[key.trim()] = valueParts.join(':').trim();
      }
    });

    return frontMatter;
  }

  extractCategory(filePath, frontMatter) {
    // 1. Front matter에서 categories 확인
    if (frontMatter.categories) {
      return frontMatter.categories.replace(/['"]/g, '');
    }
    
    // 2. 파일 경로에서 추출
    const pathParts = filePath.split('/');
    if (pathParts.length > 1) {
      return pathParts[1]; // content/category/file.md
    }
    
    return 'unknown';
  }

  extractSections(content) {
    // Front matter 제거
    const mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // 헤더 추출 (## 또는 ### 시작)
    const headerRegex = /^#{1,6}\s+(.+)$/gm;
    const matches = mainContent.match(headerRegex) || [];
    
    return matches.map(match => match.trim());
  }

  hasSectionVariant(sections, targetSection) {
    if (targetSection === '참고자료') {
      return this.findReferenceSection(sections) !== null;
    }
    
    return sections.some(section => 
      section.toLowerCase().includes(targetSection.toLowerCase())
    );
  }

  findReferenceSection(sections) {
    for (const pattern of REFERENCE_PATTERNS) {
      const found = sections.find(section => section === pattern);
      if (found) return found;
    }
    return null;
  }

  findConclusionSection(sections) {
    for (const pattern of CONCLUSION_PATTERNS) {
      if (typeof pattern === 'string') {
        const found = sections.find(section => section === pattern);
        if (found) return found;
      } else {
        // RegExp 패턴
        const found = sections.find(section => pattern.test(section));
        if (found) return found;
      }
    }
    return null;
  }

  validateFrontMatter(frontMatter) {
    const issues = [];
    
    // 필수 필드 확인
    const requiredFields = ['title', 'date', 'categories'];
    requiredFields.forEach(field => {
      if (!frontMatter[field]) {
        issues.push({
          type: 'missing_frontmatter',
          message: `Front matter에 ${field} 필드가 없습니다`,
          severity: 'error'
        });
      }
    });

    // 날짜 형식 확인
    if (frontMatter.date && !/^\d{4}-\d{2}-\d{2}/.test(frontMatter.date)) {
      issues.push({
        type: 'invalid_date_format',
        message: 'date 필드가 YYYY-MM-DD 형식이 아닙니다',
        severity: 'warning'
      });
    }

    return issues;
  }

  checkStructureRecommendations(content, category) {
    const warnings = [];
    
    // 1. 목차 섹션 확인 (권장)
    if (!content.includes('## 목차')) {
      warnings.push({
        type: 'missing_toc',
        message: '목차 섹션(## 목차) 추가를 권장합니다',
        severity: 'info'
      });
    }

    // 2. 코드 블록 언어 명시 확인
    const codeBlocks = content.match(/```\w*/g);
    if (codeBlocks) {
      const unspecifiedBlocks = codeBlocks.filter(block => block === '```');
      if (unspecifiedBlocks.length > 0) {
        warnings.push({
          type: 'unspecified_code_language',
          message: `${unspecifiedBlocks.length}개의 코드 블록에 언어가 명시되지 않았습니다`,
          severity: 'info'
        });
      }
    }

    // 3. 카테고리별 권장 구조 확인
    if (category === 'algorithm' && !content.includes('복잡도')) {
      warnings.push({
        type: 'algorithm_missing_complexity',
        message: '알고리즘 포스트에 복잡도 분석 섹션을 추가하는 것을 권장합니다',
        severity: 'info'
      });
    }

    return warnings;
  }

  reportResults() {
    console.log('📊 검증 결과 요약');
    console.log('==================');
    console.log(`전체 포스트: ${this.stats.total}개`);
    console.log(`✅ 정상: ${this.stats.valid}개`);
    console.log(`❌ 문제 있음: ${this.stats.invalid}개`);
    console.log(`⚠️  경고 있음: ${this.stats.warnings}개\n`);

    if (this.results.length === 0) {
      console.log('🎉 모든 포스트가 표준 구조를 따릅니다!');
      return;
    }

    // 심각도별 분류
    const errors = this.results.filter(r => r.issues.some(i => i.severity === 'error'));
    const warnings = this.results.filter(r => r.warnings.length > 0);

    // 에러가 있는 포스트들
    if (errors.length > 0) {
      console.log('🚨 수정이 필요한 포스트들:');
      console.log('================================\n');
      
      errors.forEach(result => {
        console.log(`📁 ${result.file}`);
        console.log(`   카테고리: ${result.category}`);
        console.log(`   섹션 수: ${result.sections}`);
        
        result.issues.forEach(issue => {
          const emoji = issue.severity === 'error' ? '❌' : '⚠️';
          console.log(`   ${emoji} ${issue.message}`);
        });
        console.log('');
      });
    }

    // 경고가 있는 포스트들
    if (warnings.length > 0) {
      console.log('⚠️  개선 권장 포스트들:');
      console.log('========================\n');
      
      warnings.forEach(result => {
        if (result.warnings.length === 0) return;
        
        console.log(`📁 ${result.file}`);
        result.warnings.forEach(warning => {
          const emoji = warning.severity === 'warning' ? '⚠️' : 'ℹ️';
          console.log(`   ${emoji} ${warning.message}`);
        });
        console.log('');
      });
    }

    // 개선 제안
    console.log('💡 자동 개선 방법:');
    console.log('=================');
    console.log('1. npm run standardize:existing  # 기존 포스트 표준화');
    console.log('2. npm run new:post              # 새 포스트 생성 (표준 구조)');
    console.log('3. VS Code에서 스니펫 사용       # blogpost, ref, conclusion 등');
  }

  // 특정 파일만 검증
  validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 파일을 찾을 수 없습니다: ${filePath}`);
      return;
    }

    const result = this.validatePost(filePath);
    
    console.log(`📋 ${filePath} 검증 결과:`);
    console.log(`카테고리: ${result.category}`);
    console.log(`섹션 수: ${result.sections}`);
    
    if (result.issues.length === 0 && result.warnings.length === 0) {
      console.log('✅ 표준 구조를 따릅니다!');
    } else {
      result.issues.forEach(issue => {
        console.log(`❌ ${issue.message}`);
      });
      result.warnings.forEach(warning => {
        console.log(`⚠️ ${warning.message}`);
      });
    }
  }
}

// CLI 실행
if (require.main === module) {
  const args = process.argv.slice(2);
  const validator = new PostValidator();
  
  if (args.length > 0) {
    // 특정 파일 검증
    validator.validateFile(args[0]);
  } else {
    // 전체 검증
    validator.validateAll();
  }
}

module.exports = PostValidator;