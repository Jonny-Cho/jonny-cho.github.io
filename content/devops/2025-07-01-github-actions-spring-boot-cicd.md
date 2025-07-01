---
title: 'GitHub Actions로 Spring Boot CI/CD 파이프라인 구축'
date: 2025-07-01 12:00:00
categories: 'devops'
draft: false
tags: ['GitHub Actions', 'CI/CD', 'Spring Boot', 'DevOps', 'Docker', 'AWS']
---

# GitHub Actions로 Spring Boot CI/CD 파이프라인 구축

현대 소프트웨어 개발에서 CI/CD는 필수적인 개발 프로세스가 되었습니다. 특히 Spring Boot 애플리케이션을 개발할 때 GitHub Actions를 활용하면 코드 변경부터 운영 환경 배포까지의 전체 과정을 자동화할 수 있습니다.

이 글에서는 GitHub Actions를 사용하여 Spring Boot 프로젝트의 완전한 CI/CD 파이프라인을 구축하는 방법을 단계별로 알아보겠습니다.

## 1. CI/CD와 GitHub Actions 소개

### CI/CD란?

**CI (Continuous Integration)** 는 코드 변경사항을 지속적으로 통합하고 자동으로 빌드, 테스트하는 프로세스입니다.

**CD (Continuous Deployment/Delivery)** 는 검증된 코드를 자동으로 운영 환경에 배포하는 프로세스입니다.

### GitHub Actions의 장점

- **완전 무료** (퍼블릭 레포지토리)
- **GitHub과 완벽 연동**
- **풍부한 마켓플레이스** (재사용 가능한 액션들)
- **간단한 YAML 설정**
- **클라우드 러너 제공**

## 2. 사전 준비사항

### Spring Boot 프로젝트 구조

```
my-spring-app/
├── src/
│   ├── main/
│   └── test/
├── build.gradle.kts
├── gradle/
│   └── wrapper/
├── gradlew
├── gradlew.bat
├── Dockerfile
└── .github/
    └── workflows/
        └── ci-cd.yml
```

### 필요한 도구들

- Java 21 이상
- Gradle 8.x
- Docker
- GitHub 계정

## 3. GitHub Actions 워크플로우 기초

### 워크플로우 파일 생성

`.github/workflows/ci-cd.yml` 파일을 생성합니다:

```yaml
name: Spring Boot CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # CI 작업들이 여기에 추가됩니다
```

### 주요 구성 요소

- **name**: 워크플로우 이름
- **on**: 트리거 조건
- **jobs**: 실행할 작업들
- **steps**: 각 작업의 단계들

## 4. CI (Continuous Integration) 파이프라인 구축

### 4.1 기본 CI 워크플로우

```yaml
name: Spring Boot CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
    
    - name: Cache Gradle dependencies
      uses: actions/cache@v3
      with:
        path: |
          ~/.gradle/caches
          ~/.gradle/wrapper
        key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
        restore-keys: ${{ runner.os }}-gradle-
    
    - name: Run tests
      run: ./gradlew clean test
    
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Gradle Tests
        path: build/test-results/test/*.xml
        reporter: java-junit
```

### 4.2 코드 품질 검사 추가

```yaml
  code-quality:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
    
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    
    - name: Run SpotBugs
      run: ./gradlew spotbugsMain
    
    - name: Generate test coverage
      run: ./gradlew jacocoTestReport
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      with:
        file: build/reports/jacoco/test/jacocoTestReport.xml
```

### 4.3 멀티 환경 테스트

```yaml
  multi-jdk-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        java: [21, 22]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up JDK ${{ matrix.java }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ matrix.java }}
        distribution: 'temurin'
    
    - name: Run tests with JDK ${{ matrix.java }}
      run: ./gradlew clean test
```

## 5. CD (Continuous Deployment) 파이프라인 구축

### 5.1 Docker 이미지 빌드 및 푸시

먼저 `Dockerfile`을 생성합니다:

```dockerfile
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# 비루트 사용자 생성 (보안상 이점)
RUN addgroup --system --gid 1001 spring
RUN adduser --system --uid 1001 --gid 1001 spring

COPY build/libs/*.jar app.jar

RUN chown spring:spring app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

GitHub Actions 워크플로우에 Docker 빌드 추가:

```yaml
  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
    
    - name: Build with Gradle
      run: ./gradlew clean build -x test
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v4
    
    - name: Login to GitHub Container Registry
      uses: docker/login-action@v4
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v6
      with:
        context: .
        push: true
        tags: |
          ghcr.io/${{ github.repository }}:latest
          ghcr.io/${{ github.repository }}:${{ github.sha }}
```

### 5.2 AWS ECS 배포

```yaml
  deploy-to-aws:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster my-cluster \
          --service my-service \
          --force-new-deployment
```

## 6. 고급 기능 활용

### 6.1 환경별 배포 관리

```yaml
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [staging, production]
    
    environment: ${{ matrix.environment }}
    
    steps:
    - name: Deploy to ${{ matrix.environment }}
      run: |
        echo "Deploying to ${{ matrix.environment }}"
        # 환경별 배포 스크립트 실행
```

### 6.2 Slack 알림 연동

```yaml
    - name: Notify Slack on success
      if: success()
      uses: 8398a7/action-slack@v4
      with:
        status: success
        channel: '#deployments'
        text: '✅ 배포 성공: ${{ github.ref }}'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    
    - name: Notify Slack on failure
      if: failure()
      uses: 8398a7/action-slack@v4
      with:
        status: failure
        channel: '#deployments'
        text: '❌ 배포 실패: ${{ github.ref }}'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 7. 완전한 CI/CD 파이프라인 예제

```yaml
name: Spring Boot CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  JAVA_VERSION: '21'
  GRADLE_OPTS: '-Xmx1024m'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        cache: gradle
    
    - name: Run tests
      run: ./gradlew clean test
    
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Gradle Tests
        path: build/test-results/test/*.xml
        reporter: java-junit

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        cache: gradle
    
    - name: Build application
      run: ./gradlew clean build -x test
    
    - name: Build Docker image
      run: |
        docker build -t my-spring-app:${{ github.sha }} .
        docker tag my-spring-app:${{ github.sha }} my-spring-app:latest
    
    - name: Login to Container Registry
      uses: docker/login-action@v4
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Push Docker image
      run: |
        docker tag my-spring-app:latest ghcr.io/${{ github.repository }}:latest
        docker push ghcr.io/${{ github.repository }}:latest
    
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # 실제 배포 스크립트 실행
```

## 8. 트러블슈팅 및 최적화

### 자주 발생하는 문제들

**1. 메모리 부족 오류**
```yaml
env:
  GRADLE_OPTS: '-Xmx2048m -XX:MaxMetaspaceSize=512m'
```

**2. 캐싱 문제**
```yaml
- name: Clear Gradle cache
  run: rm -rf ~/.gradle/caches
```

**3. 권한 문제**
```yaml
- name: Make scripts executable
  run: chmod +x scripts/deploy.sh
```

### 빌드 시간 최적화

```yaml
- name: Cache Gradle dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    restore-keys: |
      ${{ runner.os }}-gradle-

- name: Parallel build
  run: ./gradlew clean build --parallel
```

## 9. 보안 고려사항

### Secrets 관리

- AWS 크리덴셜
- 데이터베이스 연결 정보
- API 키
- 토큰

GitHub Repository Settings > Secrets and variables > Actions에서 설정:

```yaml
env:
  DB_HOST: ${{ secrets.DB_HOST }}
  DB_USERNAME: ${{ secrets.DB_USERNAME }}
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

### OIDC 인증 사용

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/github-actions-role
    aws-region: ap-northeast-2
```

## 10. 마무리

GitHub Actions를 활용한 Spring Boot CI/CD 파이프라인 구축을 통해 다음과 같은 이점을 얻을 수 있습니다:

### 장점
- **자동화된 빌드 및 테스트**
- **일관된 배포 프로세스**
- **빠른 피드백 루프**
- **인적 오류 감소**
- **개발 생산성 향상**

### 추가 고려사항
- **모니터링 및 로깅** 시스템 구축
- **롤백 전략** 수립
- **보안 검토** 정기 실시
- **성능 최적화** 지속적인 개선

### 다음 단계
1. **Kubernetes 배포** 전환 고려
2. **ArgoCD**와 같은 GitOps 도구 도입
3. **Multi-stage 배포** 전략 구현
4. **Infrastructure as Code** (Terraform) 적용

이제 여러분의 Spring Boot 프로젝트에 GitHub Actions CI/CD 파이프라인을 적용해보세요. 처음에는 간단한 CI부터 시작하여 점진적으로 기능을 확장해나가는 것을 추천합니다.

## 참고 자료

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**태그**: #GitHub-Actions #CI-CD #Spring-Boot #DevOps #Docker #AWS #자동화 #배포
