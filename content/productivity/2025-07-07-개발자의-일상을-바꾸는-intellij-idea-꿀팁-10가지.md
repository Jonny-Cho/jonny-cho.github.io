---
title: '개발자의 일상을 바꾸는 IntelliJ IDEA 꿀팁 10가지'
date: 2025-07-07 23:59:00
categories: 'productivity'
draft: false
tags: ['IntelliJ', 'IDE', '생산성', '개발도구', '단축키']
---

# 개발자의 일상을 바꾸는 IntelliJ IDEA 꿀팁 10가지

개발 생산성을 10배 향상시킬 수 있는 IntelliJ IDEA의 숨겨진 기능과 유용한 팁들을 실무 중심으로 소개합니다.

IntelliJ IDEA는 강력한 IDE이지만, 대부분의 개발자들은 기본 기능만 사용하고 있습니다. 오늘 소개할 10가지 꿀팁을 익히면 코딩 속도가 눈에 띄게 향상되고, 반복적인 작업들을 자동화할 수 있습니다.

## 목차

1. [검색과 네비게이션의 마법사: Search Everywhere](#1-검색과-네비게이션의-마법사-search-everywhere)
2. [코드 생성 자동화: Live Templates와 Generate](#2-코드-생성-자동화-live-templates와-generate)
3. [리팩토링의 달인: 스마트한 코드 개선](#3-리팩토링의-달인-스마트한-코드-개선)
4. [디버깅 마스터: 효율적인 문제 해결](#4-디버깅-마스터-효율적인-문제-해결)
5. [Version Control 통합: Git을 더 스마트하게](#5-version-control-통합-git을-더-스마트하게)
6. [플러그인으로 확장하기: 필수 플러그인 추천](#6-플러그인으로-확장하기-필수-플러그인-추천)
7. [커스터마이징: 나만의 개발 환경](#7-커스터마이징-나만의-개발-환경)
8. [성능 최적화: 더 빠른 IntelliJ](#8-성능-최적화-더-빠른-intellij)
9. [실무 팁: 협업과 코드 품질](#9-실무-팁-협업과-코드-품질)
10. [워크플로우 개선: 개발 속도 10배 향상](#10-워크플로우-개선-개발-속도-10배-향상)

## 1. 검색과 네비게이션의 마법사: Search Everywhere

### 1.1 Search Everywhere (Double Shift)

IntelliJ의 가장 강력한 기능 중 하나인 Search Everywhere를 제대로 활용하지 못하는 개발자들이 많습니다.

```
Double Shift (Shift + Shift)
```

**기본 사용법:**
- 파일 검색: 파일명 입력
- 클래스 검색: 클래스명 입력
- 심볼 검색: 메서드명, 변수명 입력
- 액션 검색: 기능명 입력

**고급 활용법:**
```
/git      → Git 관련 액션만 검색
#method   → 메서드만 검색
UserService → 클래스 검색
user.java → 파일 검색
```

### 1.2 스마트한 필터링

**Camel Case 활용:**
```
US → UserService
HC → HttpClient
RCT → ResponseCacheTest
```

**와일드카드 사용:**
```
*Test.java    → 모든 테스트 파일
User*Service  → UserService, UserDetailService 등
```

## 2. 코드 생성 자동화: Live Templates와 Generate

### 2.1 Live Templates 활용

자주 사용하는 코드 패턴을 템플릿으로 만들어 생산성을 극대화할 수 있습니다.

**기본 템플릿들:**
```java
// psvm + Tab
public static void main(String[] args) {
    
}

// sout + Tab
System.out.println();

// fori + Tab
for (int i = 0; i < ; i++) {
    
}
```

**커스텀 템플릿 만들기:**

1. `Settings` → `Editor` → `Live Templates`
2. `+` 버튼으로 새 템플릿 추가
3. Abbreviation: `logger`
4. Template text:
```java
private static final Logger logger = LoggerFactory.getLogger($CLASS$.class);
```

### 2.2 Generate 기능 (Alt + Insert)

```java
// Alt + Insert로 자동 생성 가능한 것들:
- Constructor
- Getter/Setter
- equals() and hashCode()
- toString()
- Override Methods
- Implement Methods
- Test Methods
```

**Builder 패턴 자동 생성:**
```java
public class User {
    private String name;
    private int age;
    
    // Alt + Insert → Builder 선택
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        // 자동 생성됨
    }
}
```

## 3. 리팩토링의 달인: 스마트한 코드 개선

### 3.1 Extract 계열 리팩토링

**Extract Method (Ctrl + Alt + M):**
```java
// 기존 코드
public void processUser(User user) {
    if (user.getAge() >= 18 && user.isActive() && user.hasValidEmail()) {
        // 복잡한 로직...
    }
}

// 리팩토링 후
public void processUser(User user) {
    if (isEligibleUser(user)) {
        // 복잡한 로직...
    }
}

private boolean isEligibleUser(User user) {
    return user.getAge() >= 18 && user.isActive() && user.hasValidEmail();
}
```

**Extract Variable (Ctrl + Alt + V):**
```java
// 기전 코드
return users.stream()
    .filter(user -> user.getAge() >= 18)
    .collect(Collectors.toList());

// 리팩토링 후
Predicate<User> isAdult = user -> user.getAge() >= 18;
return users.stream()
    .filter(isAdult)
    .collect(Collectors.toList());
```

### 3.2 Rename Everywhere (Shift + F6)

변수, 메서드, 클래스명을 변경할 때 모든 참조를 자동으로 업데이트합니다.

```java
// userId를 memberId로 변경
// Shift + F6 후 새 이름 입력하면 모든 참조가 자동 변경됨
String userId = "12345";        → String memberId = "12345";
logger.info("User ID: " + userId); → logger.info("User ID: " + memberId);
```

## 4. 디버깅 마스터: 효율적인 문제 해결

### 4.1 조건부 브레이크포인트

일반적인 브레이크포인트 대신 특정 조건에서만 멈추도록 설정할 수 있습니다.

**설정 방법:**
1. 브레이크포인트 우클릭
2. Condition 체크박스 활성화
3. 조건 입력: `userId.equals("admin")`

```java
for (User user : users) {
    // 브레이크포인트 + Condition: user.getAge() > 65
    processUser(user); // 65세 이상 사용자일 때만 멈춤
}
```

### 4.2 Evaluate Expression (Alt + F8)

디버깅 중에 코드를 실행하고 결과를 확인할 수 있습니다.

```java
// 디버깅 중 Alt + F8로 실행 가능한 예시:
users.stream().filter(u -> u.getAge() > 30).count()
LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
this.calculateTotalPrice()
```

### 4.3 Drop Frame

실행 중인 메서드를 처음부터 다시 실행할 수 있습니다.

```java
public void calculateOrder(Order order) {
    double price = order.getBasePrice();
    double tax = calculateTax(price);    // ← 여기서 Drop Frame
    double total = price + tax;          // 이 라인부터 다시 실행됨
    order.setTotalPrice(total);
}
```

## 5. Version Control 통합: Git을 더 스마트하게

### 5.1 Git Blame과 Annotate

코드의 각 라인이 언제, 누가 작성했는지 확인할 수 있습니다.

```
우클릭 → Git → Annotate with Git Blame
```

**유용한 정보:**
- 작성자
- 커밋 날짜
- 커밋 메시지
- 커밋 해시

### 5.2 Local History

Git 커밋 없이도 파일의 변경 이력을 확인할 수 있습니다.

```
우클릭 → Local History → Show History
```

**활용 예시:**
- 실수로 삭제한 코드 복구
- 이전 버전과 비교
- 작업 과정 추적

### 5.3 Cherry-Pick과 Interactive Rebase

**Cherry-Pick:**
```
Git → Branches → 원하는 브랜치 → Cherry-Pick
```

**Interactive Rebase:**
```
Git → Uncommitted Changes → Interactive Rebase
```

## 6. 플러그인으로 확장하기: 필수 플러그인 추천

### 6.1 코딩 편의성 플러그인

**Rainbow Brackets:**
- 괄호마다 다른 색상으로 표시
- 중첩된 괄호 구조를 쉽게 파악

**String Manipulation:**
- 다양한 문자열 변환 기능
- camelCase ↔ snake_case ↔ CONSTANT_CASE

```java
// 선택 후 Alt + M
userName     → user_name (snake_case)
user_name    → UserName (PascalCase)
UserName     → USER_NAME (CONSTANT_CASE)
```

### 6.2 개발 도구 플러그인

**GitToolBox:**
- 인라인으로 Git 정보 표시
- 자동 fetch 기능
- 브랜치 정보 상태바 표시

**Key Promoter X:**
- 마우스로 수행한 작업의 단축키를 알려줌
- 단축키 학습에 도움

## 7. 커스터마이징: 나만의 개발 환경

### 7.1 키맵 설정

**자주 사용하는 기능에 단축키 할당:**

```
Settings → Keymap

추천 커스텀 단축키:
- Reformat Code: Ctrl + Alt + L → Ctrl + Shift + F
- Optimize Imports: Ctrl + Alt + O → Ctrl + Shift + O
- Run: Shift + F10 → F5
```

### 7.2 코드 스타일 설정

**팀 단위로 코딩 스타일 통일:**

```
Settings → Editor → Code Style → Java

- Indent: 4 spaces
- Line wrapping: 120 characters
- Import order: java.*, javax.*, 빈 줄, 다른 패키지
```

**Export/Import 설정:**
```
Settings → Export Settings... → 설정 파일 생성
다른 PC에서 Import Settings...로 동일한 환경 구성
```

## 8. 성능 최적화: 더 빠른 IntelliJ

### 8.1 메모리 설정 최적화

**Help → Change Memory Settings:**
```
기본값: -Xmx2048m
권장값: -Xmx4096m (RAM 8GB 이상인 경우)
대형 프로젝트: -Xmx8192m
```

### 8.2 불필요한 플러그인 비활성화

```
Settings → Plugins

비활성화 권장:
- 사용하지 않는 언어 플러그인 (Python, Ruby 등)
- 사용하지 않는 프레임워크 플러그인
- 테마 관련 플러그인 (하나만 사용)
```

### 8.3 인덱싱 최적화

```
Settings → Directories

제외할 디렉토리:
- node_modules (프론트엔드 프로젝트)
- .gradle/caches
- target (Maven 빌드 디렉토리)
- logs 디렉토리
```

## 9. 실무 팁: 협업과 코드 품질

### 9.1 TODO와 FIXME 관리

```java
// TODO: 사용자 권한 검증 로직 추가 필요
public void deleteUser(String userId) {
    userRepository.delete(userId);
}

// FIXME: 성능 개선 필요 - N+1 쿼리 문제
public List<OrderDto> getOrdersWithItems() {
    return orders.stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
}
```

**TODO 창에서 일괄 관리:**
```
View → Tool Windows → TODO
```

### 9.2 코드 템플릿으로 일관성 유지

**파일 템플릿 설정:**
```
Settings → Editor → File and Code Templates

Java Class Template:
/**
 * ${DESCRIPTION}
 *
 * @author ${USER}
 * @since ${DATE}
 */
public class ${NAME} {
    
}
```

### 9.3 Live Edit 활용

**Spring Boot + Thymeleaf 개발 시:**
1. `Settings` → `Build` → `Compiler` → "Build project automatically" 체크
2. `Registry` (Ctrl + Shift + Alt + /) → `compiler.automake.allow.when.app.running` 체크
3. HTML, CSS 수정 시 브라우저에서 실시간 반영

## 10. 워크플로우 개선: 개발 속도 10배 향상

### 10.1 개선 전후 비교

**기존 방식:**
1. 마우스로 파일 탐색 (10초)
2. 수동으로 import 추가 (5초)
3. 마우스로 메뉴 클릭 (3초)
4. 반복적인 코드 타이핑 (30초)

**개선된 방식:**
1. Double Shift로 즉시 검색 (1초)
2. Alt + Enter로 자동 import (1초)
3. 단축키로 즉시 실행 (0.5초)
4. Live Template으로 자동 생성 (2초)

### 10.2 측정 가능한 효과

**시간 절약 계산:**
- 파일 검색: 10초 → 1초 (90% 절약)
- 코드 생성: 30초 → 2초 (93% 절약)
- 리팩토링: 60초 → 5초 (92% 절약)

**하루 8시간 기준:**
- 기존 방식: 60분 소요 작업
- 개선 방식: 6분 소요 작업
- **54분 절약 = 11.25% 생산성 향상**

### 10.3 습관화 전략

**1주차: 검색 마스터**
- Double Shift만 사용하기
- 마우스로 파일 찾기 금지

**2주차: 생성 자동화**
- Alt + Insert 활용
- Live Template 3개 이상 만들기

**3주차: 리팩토링 달인**
- Extract Method 매일 1회 이상
- Rename 기능 적극 활용

**4주차: 통합 마스터**
- 모든 기능 종합 활용
- 새로운 단축키 하나씩 추가

## 마무리

### 핵심 포인트

1. **검색이 모든 것의 시작**: Double Shift를 마스터하면 작업 속도가 3배 빨라집니다
2. **자동화가 핵심**: Live Template과 Generate 기능으로 반복 작업을 없애세요
3. **리팩토링으로 코드 품질 향상**: Extract 기능들을 활용해 더 깔끔한 코드를 작성하세요
4. **커스터마이징이 생산성의 핵심**: 자신의 작업 패턴에 맞게 IDE를 조정하세요
5. **꾸준한 연습이 마스터의 길**: 새로운 기능을 하나씩 익혀가며 점진적으로 개선하세요

### 참고자료

**공식 문서:**
- [IntelliJ IDEA 공식 문서](https://www.jetbrains.com/help/idea/)
- [키보드 단축키 가이드](https://www.jetbrains.com/help/idea/keyboard-shortcuts-and-mouse-reference.html)

**관련 자료:**
- [Live Templates 가이드](https://www.jetbrains.com/help/idea/using-live-templates.html)
- [디버깅 가이드](https://www.jetbrains.com/help/idea/debugging-code.html)

**커뮤니티:**
- [JetBrains 공식 블로그](https://blog.jetbrains.com/)
- [IntelliJ IDEA Tips YouTube 채널](https://www.youtube.com/playlist?list=PLQ176FUIyIUYnLuYVKM6JhVd6ukPgzdW7)

---

**태그**: #IntelliJ #IDE #생산성 #개발도구 #단축키