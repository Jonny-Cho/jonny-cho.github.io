---
title: 가비지 컬렉션(GC)의 원리와 종류
date: '2021-06-01 00:00:00'
categories: java
tags: [garbage collection, gc]
---

## 1. 가비지 컬렉션?

JVM의 Heap 영역에서 사용하지 않는 객체를 삭제하는 프로세스

### (참고) JVM의 메모리 구조

1. 메소드 영역
   * 클래스 멤버 변수의 이름, 데이터 타입, 접근 제어자 정보같은 필드 정보와 메소드의 이름, 리턴 타입, 파라미터, 접근 제어자 정보같은 메소드 정보, Type정보(Interface인지 class인지), Runtime Constant Pool(문자 상수, 타입, 필드에 대한 레퍼런스가 저장됨), static 변수, final class 변수등이 생성되는 영역.
1. 힙 영역
   * new 키워드로 생성된 객체와 배열이 저장되는 영역.
   * String constant pool : 문자열 리터럴을 저장하는 공간 (String str = "abc" 에서 "abc" 부분)
   * 메소드 영역에 로드된 클래스만 생성이 가능하고 Garbage Collector가 참조되지 않는 메모리를 확인하고 제거하는 영역.
1. 스택 영역
   * 지역 변수, 파라미터, 리턴 값, 연산에 사용되는 임시 값등이 생성되는 영역.
1. PC Register
   * Thread(쓰레드)가 생성될 때마다 생성되는 영역으로 Program Counter 즉, 현재 쓰레드가 실행되는 부분의 주소와 명령을 저장하고 있는 영역. (*CPU의 레지스터와 다름)
1. Native method stack
   * 자바 외 언어로 작성된 네이티브 코드를 위한 메모리 영역.

## 2. GC의 수거대상

GC Roots로 부터 참조를 탐색했을 때, Unreachable한 Object

GC Roots
* stack 영역의 데이터들
* method 영역의 static 데이터들
* JNI에 의해 생성된 객체들

## 3. GC의 동작 순서

1. Marking - GC Root로 부터 모든 변수를 스캔하면서 각각 어떤 객체를 참조하고 있는지 찾아서 마킹한다.
![Marking](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide3.png)

1. Sweep - Unreachable한 객체들을 Heap에서 제거한다.
![Sweeping](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide1b.png)

1. Compact (optional) - Sweep 후에 분산된 객체들을 Heap의 시작 주소로 모아 메모리가 할당된 부분과 그렇지 않은 부분으로 나눈다.
![Compacting](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide4.png)

## 4. GC는 언제 일어날까?

### 4-1 Heap의 구조

![Heap structure](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide5.png)

1. Young Generation - 새로운 객체들이 할당되는 영역
    * Eden - 새로운 객체가 할당되는 공간
    * Survivor - Eden 영역이 꽉차서 Minor GC가 발생했을 때 Mark and Sweep을 통해 살아남은 객체들을 저장해 놓는 공간. S0, S1중에 한 곳은 빈 상태로 존재해야 한다.
1. Old Generation - Young Generation에서 오랫동안 살아남은 객체들이 존재하는 영역

### 4-2 GC가 일어나는 과정

1. 새로운 객체가 Eden 영역에 할당된다.
![Eden](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide13.png)

1. Eden 영역이 꽉차면 Minor GC가 발생된다.
![Filling the Eden Space](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide14.png)

1. Mark 과정에서 살아남은 객체들은 Survivor0 영역으로 복사하고, Eden 영역에 있는 데이터들을 삭제한다.
![Copying Referenced Objects](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide6.png)

1. 그 다음 Minor GC가 일어났을 때는, Eden영역과 Survivor0 영역을 모두 mark하고 살아남은 객체들은 Survivor1 영역으로 복사하고, Eden 영역과, Survivor0 영역의 데이터를 삭제한다. 복사가 될 때는 해당 객체의 Age값이 증가된다.
![Copying Referenced Objects](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide8.png)

1. 특정 age에 도달한 객체들은 Old generation 영역으로 옮겨진다. Young generation에서 Old generation으로 옮겨지는 현상을 promotion 이라한다.
![promotion](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/gcslides/Slide7.png)

1. Old generation 영역에도 데이터가 가득차면 Major GC가 발생한다.

## 5. GC의 특징

1. Most allocated objects are not referenced (considered live) for long, that is, they die young.
   * 대부분의 객체는 금방 unreachable한 상태가 된다.
1. Few references from older to younger objects exist.
   * 오래된 객체에서 젊은 객체로의 참조는 아주 적게 존재한다.

Minor GC가 Major GC에 비해 빈번히 작동해서 메모리의 부담이 적도록 고안
![weak generational hypothesis](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/images/ObjectLifetime.gif)

## 6. GC의 종류

* stop-the-world : GC를 실행하는 쓰레드 외의 모든 쓰레드가 작업을 중단하는 것

1. Serial GC
   * GC를 처리하는 쓰레드가 1개(싱글 쓰레드)
   * 다른 GC에 비해 stop-the-world 시간이 길다
   * Mark-Compact 알고리즘 사용
1. Parallel GC
   * Java 8의 default GC
   * Young Generation의 GC를 멀티 쓰레드로 수행
   * Serial GC에 비해 stop-the-world 시간 감소
1. Parallel Old GC
   * Parallel GC를 개선
   * Old Generation에서도 GC를 멀티 쓰레드로 수행
   * Mark-Summary-Compact 알고리즘 사용
1. CMS (Concurrent Mark Sweep) GC
   * stop-the-world 시간을 줄이기 위해 고안됨
   * compact 과정이 없음
   * initial Mark - GC Root에서 참조하는 객체들만 식별
   * Concurrent Mark - 이전 단계에서 식별한 객체들이 참조하는 모든 객체 추적
   * Remark - 이전 단계에서 식별한 객체를 다시 추적, 추가되거나 참조가 끊긴 객체 확정
   * Concurrent Sweep - unreachable 객체들을 삭제
1. G1 (Garbage First) GC
   * CMS GC를 개선
   * Java 9+의 default GC
   * Heap을 일정한 크기의 Region으로 나눔
   * 전체 Heap이 아닌 Region 단위로 탐색
   * compact 진행

### 참고자료
* <a href="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" target="_blank">Java Garbage Collection Basics</a>
* <a href="https://d2.naver.com/helloworld/1329" target="_blank">가비지 컬렉션 과정 - Generational Garbage Collection</a>
* <a href="https://youtu.be/Fe3TVCEJhzo" target="_blank">10분 테코톡 - 엘리의 GC</a>
* <a href="https://jeong-pro.tistory.com/148" target="_blank">JVM 구조와 자바 런타임 메모리 구조</a>
