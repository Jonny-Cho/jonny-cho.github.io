const fs = require('fs');
const path = require('path');
const glob = require('glob');

class PostStandardizer {
  constructor() {
    // 표준화 규칙 정의
    this.replacements = [
      // 참고자료 섹션 통일 (가장 많이 사용되는 ### 참고자료로 통일)
      { 
        from: /^### 참고$/gm, 
        to: '### 참고자료',
        description: '참고 → 참고자료'
      },
      { 
        from: /^### 참고 자료$/gm, 
        to: '### 참고자료',
        description: '참고 자료 → 참고자료'
      },
      { 
        from: /^## 참고 자료$/gm, 
        to: '### 참고자료',
        description: 'H2 참고 자료 → H3 참고자료'
      },
      { 
        from: /^#### 참고자료$/gm, 
        to: '### 참고자료',
        description: 'H4 참고자료 → H3 참고자료'
      },
      { 
        from: /^### References$/gm, 
        to: '### 참고자료',
        description: 'References → 참고자료'
      },
      
      // 마무리 섹션 통일
      { 
        from: /^## (\d+\.\s*)?마무리$/gm, 
        to: '## 마무리',
        description: '번호가 붙은 마무리 → 마무리'
      },
      { 
        from: /^### 마무리$/gm, 
        to: '## 마무리',
        description: 'H3 마무리 → H2 마무리'
      },
      
      // 목차 섹션 통일
      { 
        from: /^# 목차$/gm, 
        to: '## 목차',
        description: 'H1 목차 → H2 목차'
      },
      { 
        from: /^### 목차$/gm, 
        to: '## 목차',
        description: 'H3 목차 → H2 목차'
      },
      
      // 일반적인 섹션 번호 정리 (연속된 공백 제거)
      { 
        from: /^##\s+(\d+)\.\s+/gm, 
        to: '## $1. ',
        description: '섹션 번호 공백 정리'
      },
      { 
        from: /^###\s+(\d+\.\d+)\s+/gm, 
        to: '### $1 ',
        description: '하위 섹션 번호 공백 정리'
      }
    ];
    
    this.stats = {
      totalFiles: 0,
      modifiedFiles: 0,
      totalReplacements: 0,
      replacementsByType: {}
    };
  }

  standardizeAll(dryRun = false) {
    console.log('🔧 블로그 포스트 표준화 시작...');
    console.log(dryRun ? '📋 미리보기 모드 (실제 파일은 변경되지 않습니다)' : '✏️ 실제 파일 수정 모드');
    console.log('='.repeat(50) + '\n');
    
    const files = glob.sync('content/**/*.md');
    this.stats.totalFiles = files.length;
    
    files.forEach(file => {
      this.standardizeFile(file, dryRun);
    });
    
    this.reportStats(dryRun);
  }

  standardizeFile(filePath, dryRun = false) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileModified = false;
    let fileReplacements = [];

    // 각 교체 규칙 적용
    this.replacements.forEach(replacement => {
      const matches = content.match(replacement.from);
      if (matches) {
        content = content.replace(replacement.from, replacement.to);
        const count = matches.length;
        
        fileReplacements.push({
          description: replacement.description,
          count: count
        });
        
        this.stats.totalReplacements += count;
        this.stats.replacementsByType[replacement.description] = 
          (this.stats.replacementsByType[replacement.description] || 0) + count;
        
        fileModified = true;
      }
    });

    // 추가 정리 작업
    const additionalCleanup = this.performAdditionalCleanup(content);
    if (additionalCleanup.modified) {
      content = additionalCleanup.content;
      fileReplacements.push(...additionalCleanup.changes);
      fileModified = true;
    }

    // 결과 출력 및 파일 저장
    if (fileModified) {
      this.stats.modifiedFiles++;
      
      console.log(`📝 ${filePath}`);
      fileReplacements.forEach(change => {
        console.log(`   ✓ ${change.description}${change.count ? ` (${change.count}개)` : ''}`);
      });
      console.log('');

      if (!dryRun) {
        fs.writeFileSync(filePath, content);
      }
    }
  }

  performAdditionalCleanup(content) {
    let modifiedContent = content;
    let changes = [];
    let modified = false;

    // 1. 연속된 빈 줄 정리 (3개 이상의 연속 빈 줄을 2개로)
    const originalLineCount = (modifiedContent.match(/\n\n\n+/g) || []).length;
    if (originalLineCount > 0) {
      modifiedContent = modifiedContent.replace(/\n\n\n+/g, '\n\n');
      changes.push({
        description: `연속된 빈 줄 정리`,
        count: originalLineCount
      });
      modified = true;
    }

    // 2. 파일 끝 정리 (파일 끝에 정확히 하나의 빈 줄)
    if (!modifiedContent.endsWith('\n')) {
      modifiedContent += '\n';
      changes.push({
        description: '파일 끝 빈 줄 추가'
      });
      modified = true;
    } else if (modifiedContent.endsWith('\n\n\n')) {
      modifiedContent = modifiedContent.replace(/\n+$/, '\n');
      changes.push({
        description: '파일 끝 과도한 빈 줄 정리'
      });
      modified = true;
    }

    // 3. 코드 블록 후 빈 줄 확인
    const codeBlockIssues = (modifiedContent.match(/```[a-zA-Z]*\n[\s\S]*?\n```(?!\n)/g) || []).length;
    if (codeBlockIssues > 0) {
      modifiedContent = modifiedContent.replace(/(```[a-zA-Z]*\n[\s\S]*?\n```)(?!\n)/g, '$1\n');
      changes.push({
        description: '코드 블록 후 빈 줄 추가',
        count: codeBlockIssues
      });
      modified = true;
    }

    return {
      content: modifiedContent,
      changes,
      modified
    };
  }

  standardizeSpecificFiles(patterns, dryRun = false) {
    console.log(`🎯 특정 패턴의 파일들 표준화: ${patterns.join(', ')}`);
    console.log(dryRun ? '📋 미리보기 모드' : '✏️ 실제 수정 모드');
    console.log('='.repeat(50) + '\n');

    const allFiles = [];
    patterns.forEach(pattern => {
      const files = glob.sync(pattern);
      allFiles.push(...files);
    });

    // 중복 제거
    const uniqueFiles = [...new Set(allFiles)];
    this.stats.totalFiles = uniqueFiles.length;

    uniqueFiles.forEach(file => {
      this.standardizeFile(file, dryRun);
    });

    this.reportStats(dryRun);
  }

  standardizeSingleFile(filePath, dryRun = false) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 파일을 찾을 수 없습니다: ${filePath}`);
      return;
    }

    console.log(`🎯 단일 파일 표준화: ${filePath}`);
    console.log(dryRun ? '📋 미리보기 모드' : '✏️ 실제 수정 모드');
    console.log('='.repeat(50) + '\n');

    this.stats.totalFiles = 1;
    this.standardizeFile(filePath, dryRun);
    this.reportStats(dryRun);
  }

  reportStats(dryRun) {
    console.log('📊 표준화 결과 요약');
    console.log('==================');
    console.log(`전체 파일: ${this.stats.totalFiles}개`);
    console.log(`수정된 파일: ${this.stats.modifiedFiles}개`);
    console.log(`총 변경사항: ${this.stats.totalReplacements}개\n`);

    if (Object.keys(this.stats.replacementsByType).length > 0) {
      console.log('📝 변경사항 상세:');
      Object.entries(this.stats.replacementsByType).forEach(([type, count]) => {
        console.log(`   • ${type}: ${count}개`);
      });
      console.log('');
    }

    if (this.stats.modifiedFiles === 0) {
      console.log('✅ 모든 파일이 이미 표준 형식을 따릅니다!');
    } else if (dryRun) {
      console.log('💡 실제 변경을 적용하려면:');
      console.log('   npm run standardize:existing');
    } else {
      console.log('✅ 표준화가 완료되었습니다!');
      console.log('💡 변경사항을 확인하려면:');
      console.log('   git diff');
      console.log('   npm run validate:posts  # 구조 검증');
    }
  }

  // 백업 생성
  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `backups/posts-${timestamp}`;
    
    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups');
    }
    
    fs.mkdirSync(backupDir, { recursive: true });
    
    const files = glob.sync('content/**/*.md');
    files.forEach(file => {
      const relativePath = file.replace('content/', '');
      const backupPath = path.join(backupDir, relativePath);
      const backupDirPath = path.dirname(backupPath);
      
      if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath, { recursive: true });
      }
      
      fs.copyFileSync(file, backupPath);
    });
    
    console.log(`💾 백업 생성 완료: ${backupDir}`);
    return backupDir;
  }

  // 특정 카테고리만 표준화
  standardizeCategory(category, dryRun = false) {
    const pattern = `content/${category}/**/*.md`;
    this.standardizeSpecificFiles([pattern], dryRun);
  }
}

// CLI 실행
if (require.main === module) {
  const args = process.argv.slice(2);
  const standardizer = new PostStandardizer();
  
  // 플래그 파싱
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const backup = args.includes('--backup') || args.includes('-b');
  const category = args.find(arg => arg.startsWith('--category='))?.split('=')[1];
  const file = args.find(arg => arg.startsWith('--file='))?.split('=')[1];
  const help = args.includes('--help') || args.includes('-h');

  if (help) {
    console.log(`
🔧 블로그 포스트 표준화 도구

사용법:
  node scripts/standardize-posts.js [옵션]

옵션:
  --dry-run, -d           미리보기 모드 (실제 파일 변경 없음)
  --backup, -b            변경 전 백업 생성
  --category=CATEGORY     특정 카테고리만 표준화 (예: --category=git)
  --file=FILE_PATH        특정 파일만 표준화 (예: --file=content/git/file.md)
  --help, -h              도움말 표시

예시:
  npm run standardize:existing                    # 전체 표준화
  npm run standardize:existing -- --dry-run       # 미리보기
  npm run standardize:existing -- --backup        # 백업 후 표준화
  npm run standardize:existing -- --category=git  # git 카테고리만

표준화 규칙:
  • 참고자료 섹션: ### 참고자료로 통일
  • 마무리 섹션: ## 마무리로 통일  
  • 목차 섹션: ## 목차로 통일
  • 섹션 번호 공백 정리
  • 연속된 빈 줄 정리
  • 코드 블록 후 빈 줄 추가
`);
    process.exit(0);
  }

  // 백업 생성
  if (backup && !dryRun) {
    standardizer.createBackup();
    console.log('');
  }

  // 실행
  if (file) {
    standardizer.standardizeSingleFile(file, dryRun);
  } else if (category) {
    standardizer.standardizeCategory(category, dryRun);
  } else {
    standardizer.standardizeAll(dryRun);
  }
}

module.exports = PostStandardizer;