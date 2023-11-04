---
title: java 객체지향 시험
date: '2018-09-10 00:00:00'
categories: java
tags: [java, 객체지향]
---

`자바의 정석 6~7장 실습 세미나`

## 문제 1. 
### 두개의 정수 x, y를 저장하기 위한 인스턴스 변수가 선언된 Point클래스를 정의하시오

```java
class Point {
    int x;
    int y;
}
```

## 문제 2. 
### 앞서 정의한 Point클래스를 테스트하기 위한 PointTest클래스를 작성하고, Point객체를 생성하는 코드를 작성하시오

```java
class Point {
    int x;
    int y;
}

public class PointTest {
    public static void main(String[] args){
        Point.p = new Point(); // 객체생성
        p.x = 1;
        p.y = 1;
        System.out.println(p.x);
        System.out.println(p.y);
    }
}
```

## 문제 3. 
### Point클래스에 toString()을 오버라이딩해서 x와 y의 값을 포함한 문자열을 반환하도록 하시오. PointTest클래스에서 Point객체를 생성한 다음, x와 y의 값을 3과 5로 초기화하시오. 그리고 toString()을 호출해서 x와 y의 값을 출력하시오.

```java
class Point {
    int x;
    int y;

    public String toString(){
        return "x = " + x + ", y = " + y ;
    }
}

public class PointTest {
    public static void main(String[] args){
        Point.p = new Point(); // 객체생성
        p.x = 1;
        p.y = 1;
        System.out.println(p.x);
        System.out.println(p.y);
        System.out.println(p.toString()); //toString() 생략가능
    }
}
```

## 문제 4. 
### Point클래스에 x, y를 매개변수로 하는 생성자와 기본생성자(x, y를 모두 1로 초기화)를 추가하시오. 그 다음 PointTest클래스에서 테스트 하시오.

```java
class Point {
    int x;
    int y;

    public String toString(){
        return "x = " + x + ", y = " + y ;
    }

    Point(){
        this(1, 1);
        // x = 1; // x는 인스턴스변수
        // y = 1;
    } // 기본생성자
    Point(int x, int y){
        this.x = x; //this.x는 인스턴스변수, x는 로컬변수
        this.y = y;
    } // 매개변수 있는 생성자
}

public class PointTest {
    public static void main(String[] args){
        Point.p = new Point(); // 객체생성
        //p.x = 1; //기본생성자에 초기화 했으니까 안써도 됨
        //p.y = 1;
        Point.p1 = new Point(2, 2); // 매개변수 있는 생성자 이용 객체생성
        System.out.println(p.x);
        System.out.println(p.y);
        
        System.out.println(p.toString()); //toString() 생략가능
        // x = 1, y = 1 
        
        System.out.println(p2.toString());
        // x = 2, y = 2
    }
}
```

## 문제 5. 
### Point클래스에 두 점 사이의 거리를 double타입의 값으로 계산해서 반환하는 getDistance(Point p)를 추가하시오.

```java
class Point {
    int x;
    int y;

    public String toString(){
        return "x = " + x + ", y = " + y ;
    }

    Point(){
        this(1, 1);
        // x = 1; // x는 인스턴스변수
        // y = 1;
    } // 기본생성자
    Point(int x, int y){
        this.x = x; //this.x는 인스턴스변수, x는 로컬변수
        this.y = y;
    } // 매개변수 있는 생성자

    double getDistance(Point p){ // 매개변수와 입력값 비교
        int a = this.x - p.x;
        int b = this.y - p.y;
        
        return Mathsqrt(a*a+b*b); // 두 점 사이 거리 공식 -> 피타고라스로 법칙으로 유도
    }
}

public class PointTest {
    public static void main(String[] args){
        Point.p = new Point(); // 객체생성
        //p.x = 1;
        //p.y = 1;
        Point.p1 = new Point(2, 2); // 매개변수 있는 생성자 이용 객체생성
        System.out.println(p.x);
        System.out.println(p.y);
        
        System.out.println(p.toString()); //toString() 생략가능
        // x = 1, y = 1 
        
        System.out.println(p2.toString());
        // x = 2, y = 2
        System.out.println(p.getDistance(p1)); // (1,1) 과 (2, 2) 비교
    }
}
```

## 문제 6. 
### Point클래스에 두 점 사이의 거리를 double타입의 값으로 계산해서 반환하는 static메서드 getDistance(Point p1, Point p2)를 추가하시오.

```java
class Point {
    int x;
    int y;

    public String toString(){
        return "x = " + x + ", y = " + y ;
    }

    Point(){
        this(1, 1);
        // x = 1; // x는 인스턴스변수
        // y = 1;
    } // 기본생성자
    Point(int x, int y){
        this.x = x; //this.x는 인스턴스변수, x는 로컬변수
        this.y = y;
    } // 매개변수 있는 생성자

    double getDistance(Point p){ // 매개변수와 입력값 비교
        // int a = this.x - p.x;
        // int b = this.y - p.y
        // return Mathsqrt(a*a+b*b);
        return getDistance(this, p) // 다른함수호출
    }

    static double getDistance(Point p){ // 매개변수와 입력값 비교
        int a = p1.x - p2.x;
        int b = p1.y - p2.y;
        
        return Mathsqrt(a*a+b*b);
    }
}

public class PointTest {
    public static void main(String[] args){
        Point.p = new Point(); // 객체생성
        //p.x = 1;
        //p.y = 1;
        Point.p1 = new Point(2, 2); // 매개변수 있는 생성자 이용 객체생성
        Point.p2 = new Point(3, 3);
        System.out.println(p.x);
        System.out.println(p.y);
        
        System.out.println(p.toString()); //toString() 생략가능
        // x = 1, y = 1 
        
        System.out.println(p2.toString());
        // x = 2, y = 2

        System.out.println(p.getDistance(p1)); // (1, 1) 과 (2, 2) 비교
        // im 호출방법 -> 객체명.함수명
        
        System.out.println(Point.getDistance(p1, p2)); // (2, 2) 와 (3, 3) 비교
        // cm 호출방법 -> 클래스명.함수명
    }
}
```

## 문제 7. 
### Point클래스의 equals()를 다음과 같은 조건으로 오버라이딩 하고 테스트 하시오.
### 조건 1) 비교하는 객체가 Point객체가 아니면 false를 반환
### 조건 2) Point객체의 x와 y의 값이 같을 때만 true를 반환

```java
class Point {
    int x;
    int y;

    public String toString(){
        return "x = " + x + ", y = " + y ;
    }

    Point(){
        this(1, 1);
        // x = 1; // x는 인스턴스변수
        // y = 1;
    } // 기본생성자
    Point(int x, int y){
        this.x = x; //this.x는 인스턴스변수, x는 로컬변수
        this.y = y;
    } // 매개변수 있는 생성자

    double getDistance(Point p){ // 매개변수와 입력값 비교
        // int a = this.x - p.x;
        // int b = this.y - p.y
        // return Mathsqrt(a*a+b*b);
        return getDistance(this, p) // 다른함수호출
    }

    static double getDistance(Point p){ // 매개변수와 입력값 비교
        int a = p1.x - p2.x;
        int b = p1.y - p2.y;
        
        return Mathsqrt(a*a+b*b);
    }

    // 이 부분 이해잘안됨. 개념 다시
    public boolean equals(Object obj){
        //if(obj==null && (obj instanceof Point)) return false;
        if(!(obj instanceof Point)) return false; // 1)

        Point p = (Point) obj; // 형변환
        // obj에는 x, y를 컨트롤 할 수 있는 참조변수(리모컨)가 없다. ex) obj.x
        // 형변환을 해서 p.x, p.y 를 사용할 수 있게 바꾼다.

        //if(this.x==p.x && this.y==p.y)
        //  return true;
        //else
        //  return false;

        return this.x == p.x && this.y == p.y; // 2)
    }

}

public class PointTest {
    public static void main(String[] args){
        Point.p = new Point(); // 객체생성
        //p.x = 1;
        //p.y = 1;
        Point.p1 = new Point(2, 2); // 매개변수 있는 생성자 이용 객체생성
        Point.p2 = new Point(3, 3);
        System.out.println(p.x);
        System.out.println(p.y);
        
        System.out.println(p.toString()); //toString() 생략가능
        // x = 1, y = 1 
        
        System.out.println(p2.toString());
        // x = 2, y = 2

        System.out.println(p1.equals(p2)); //p1과 p2가 같니? false

        System.out.println(p.getDistance(p1)); // (1, 1) 과 (2, 2) 비교
        // im 호출방법 -> 객체명.함수명
        
        System.out.println(Point.getDistance(p1, p2)); // (2, 2) 와 (3, 3) 비교
        // cm 호출방법 -> 클래스명.함수명
    }
}
```

## 문제 8. 
### Point클래스를 상속받고 z를 인스턴스 변수로 갖는 Point3D클래스를 작성하시오.

```java
class Point3D extends Point {
    int z;
}
```

## 문제 9. 
### Point3D클래스에 생성자 Point3D(int x, int y, int z)와 기본 생성자(x, y, z를 1로 초기화)를 추가하시오.

```java
class Point3D extends Point{
    int z;

    Point3D(){
        this(1, 1, 1);
        z = 1;
    }

    Point3D(int x, int y, int z){
        super(x, y); // 상속받은 변수는 조상이 초기화 하게 하자
        //this.x = x;
        //this.y = y;
        this.z = z;
    }
}
```

## 문제 10. 
### Point3D클래스의 toString()이 x, y, z의 값을 문자열로 반환하도록 오버라이딩하시오.

```java
class Point3D extends Point{
    int z;

    Point3D(){
        this(1, 1, 1);
        // x = 1;
        // y = 1;
        // z = 1;
    }

    Point3D(int x, int y, int z){
        super(x, y); // 상속받은 변수는 조상이 초기화 하게 하자
        //this.x = x;
        //this.y = y;
        this.z = z;
    }

    public String toString(){
        // return "x = " + x + ", y = " + y + ", z = " + z; 
        return super.toString() + ", z = " + z; // 상속받은거 이용하자 참조변수구분 super (괄호없음)
    }
}

class Point {
    int x;
    int y;

    public String toString(){
        return "x = " + x + ", y = " + y ;
    }

    Point(){
        this(1, 1);
        // x = 1; // x는 인스턴스변수
        // y = 1;
    } // 기본생성자
    Point(int x, int y){
        this.x = x; //this.x는 인스턴스변수, x는 로컬변수
        this.y = y;
    } // 매개변수 있는 생성자

    double getDistance(Point p){ // 매개변수와 입력값 비교
        // int a = this.x - p.x;
        // int b = this.y - p.y
        // return Mathsqrt(a*a+b*b);
        return getDistance(this, p) // 다른함수호출
    }

    static double getDistance(Point p){ // 매개변수와 입력값 비교
        int a = p1.x - p2.x;
        int b = p1.y - p2.y;
        
        return Mathsqrt(a*a+b*b);
    }

    // 이 부분 이해잘안됨. 개념 다시
    public boolean equals(Object obj){
        //if(obj==null && (obj instanceof Point)) return false;
        if(!(obj instanceof Point)) return false; // 1)

        Point p = (Point) obj; // 형변환
        // obj에는 x, y를 컨트롤 할 수 있는 참조변수(리모컨)가 없다. ex) obj.x
        // 형변환을 해서 p.x, p.y 를 사용할 수 있게 바꾼다.

        //if(this.x==p.x && this.y==p.y)
        //  return true;
        //else
        //  return false;

        return this.x == p.x && this.y == p.y; // 2)
    }

}

public class PointTest {
    public static void main(String[] args){
        Point.p = new Point(); // 객체생성
        //p.x = 1;
        //p.y = 1;
        Point.p1 = new Point(2, 2); // 매개변수 있는 생성자 이용 객체생성
        Point.p2 = new Point(3, 3);
        System.out.println(p.x);
        System.out.println(p.y);
        
        System.out.println(p.toString()); //toString() 생략가능
        // x = 1, y = 1 
        
        System.out.println(p2.toString());
        // x = 2, y = 2

        System.out.println(p.getDistance(p1)); // (1, 1) 과 (2, 2) 비교
        // im 호출방법 -> 객체명.함수명
        
        System.out.println(Point.getDistance(p1, p2)); // (2, 2) 와 (3, 3) 비교
        // cm 호출방법 -> 클래스명.함수명

        System.out.println(p1.equals(p2)); //p1과 p2가 같니? false

        Point.p3d = new Point();
        System.out.println(p3d.toString()); // x = 1, y = 1, z = 1

        Point.p3d2 = new Point();
        System.out.println(p3d2.toString(2, 2, 2)); // x = 2, y = 2, z = 2
    }
}

```

### 참고자료

* 자바의 정석 6~7장
