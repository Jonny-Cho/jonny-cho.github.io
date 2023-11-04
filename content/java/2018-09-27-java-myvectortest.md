---
title: java MyVector 메서드 만들기 시험
date: '2018-09-27 00:00:00'
categories: java
tags: [java, Vector, ArrayList, 컬렉션프레임워크]
---

* 컬렉션 프레임워크에서 Vector(ArrayList의 구버전) 내부 메서드가 어떻게 동작하는지 시험을 봤다. 시험 문제와 답을 정리했다.

## 문제 1

### Object배열 objArr을 인스턴스 변수로 갖는 MyVector클래스를 선언하시오.

```java
class MyVector{
	Object[] objArr;
}

public class MyVectorTest{
	public static void main(String[] args){

	}
}
```

## 문제 2

### MyVector클래스에 생성자 MyVector(int capacity)와 기본 생성자(capacity=16)를 추가하시오.

```java
class MyVector{
	Object[] objArr;

	MyVector(int capacity){
		// 객체 초기화
		objArr = Object[capacity];
	}
	MyVector(){
		this(16);
	}
}

public class MyVectorTest{
	public static void main(String[] args){

	}
}
```

## 문제 3

### MyVector클래스에 객체배열에 저장된 객체의 개수를 저장하기 위한 인스턴스 변수 size를 추가하고, 이 변수의 값을 반환하는 size()와 배열 objArr의 길이를 반환하는 capacity(), 그리고 객체배열이 비었는지 확인하는 boolean isEmpty()를 작성하시오.

```java
class MyVector{
	Object[] objArr;
	int size;

	MyVector(int capacity){
		// 객체 초기화
		objArr = Object[capacity];
	}
	MyVector(){
		this(16);
	}

	int size(){
		return size;
	}
	int capacity(){
		return objArr.length;
	}
	boolean isEmpty(){
		return size==0;
	}
}

public class MyVectorTest{
	public static void main(String[] args){

	}
}
```

## 문제 4

### MyVector클래스의 객체배열 objArr에 객체를 추가하는 메서드 void add(Object obj)를 작성하시오.

* 배열은 길이를 조정하지 못하는 큰 단점을 가지고 있다. Vector는 이를 보완해서 배열 안에 객체가 늘어나면 배열의 길이를 자동으로 늘려주는 기능을 가지고 있다. 이를 참고하여 add메서드를 만들어보자.

1. 배열 안 객체의 수가 배열의 길이와 같아지는 순간, 두배크기의 배열을 만든다.
2. 새로운 배열에 기존 값을 복사한다.
3. 기존 배열 이름이 새 배열을 가리키게 한다.
4. 새로 입력 받은 값을 넣는다. (size < capacity인 경우는 바로 넣으면 된다.)

```java
class MyVector{
	Object[] objArr;
	int size;

	MyVector(int capacity){
		// 객체 초기화
		objArr = Object[capacity];
	}
	MyVector(){
		this(16);
	}

	int size(){
		return size;
	}
	int capacity(){
		return objArr.length;
	}
	boolean isEmpty(){
		return size==0;
	}

	void add(Object obj){
		if(size == objArr.length){
			// 1. 배열 2배
			Object[] tmp = new Object[objArr.length * 2];
			// 2. 복사 
			System.arraycopy(objArr, 0, tmp, 0, size);
			// 3. 참조변수 변경
			objArr = tmp;
		}
			// 4. 새로 입력받은 값 넣기
		objArr[size++] = obj;
	}
}

public class MyVectorTest{
	public static void main(String[] args){
		// MyVector 객체 생성
		MyVector v = new MyVector(3); // 3자리의 배열 생성
		v.add(1);
		v.add(2);
		v.add(3);
		v.add(4);
		v.add(5);
		// 입력받은 값이 5개일 때에도 배열길이가 늘어나서 정상적으로 저장된다.
		System.out.println(size); // 5개의 객체 저장되어 있다.
		System.out.println(objArr.length); // 3자리 *2 -> 6자리로 늘어났다.
	}
}
```

## 문제 5

### MyVector클래스의 객체배열 objArr에 저장된 객체를 반환하는 Object get(int index)를 작성하시오.

```java
class MyVector{
	Object[] objArr;
	int size;

	MyVector(int capacity){
		// 객체 초기화
		objArr = Object[capacity];
	}
	MyVector(){
		this(16);
	}

	int size(){
		return size;
	}
	int capacity(){
		return objArr.length;
	}
	boolean isEmpty(){
		return size==0;
	}

	void add(Object obj){
		if(size == objArr.length){
			// 1. 배열 2배
			Object[] tmp = new Object[objArr.length * 2];
			// 2. 복사 
			System.arraycopy(objArr, 0, tmp, 0, size);
			// 3. 참조변수 변경
			objArr = tmp;
		}
			// 4. 새로 입력받은 값 넣기
		objArr[size++] = obj;
	}

	Object get(int index){
		// 사용자가 범위가 아닌 숫자를 넣은 경우 예외처리
		if(index < 0 || index >= size)
			throw new IndexOutOfBoundsException("범위를 벗어났습니다.");

		return objArr[index];
	}
}

public class MyVectorTest{
	public static void main(String[] args){
		// MyVector 객체 생성
		MyVector v = new MyVector(3); // 3자리의 배열 생성
		v.add(1);
		v.add(2);
		v.add(3);
		v.add(4);
		v.add(5);

		System.out.println(v.get(2)); // 3 배열에 2번째 자리에 있는 3출력
	}
}
```



## 문제 6

### MyVector클래스의 객체배열 objArr에 저장된 모든 객체를 문자열로 이어서 반환하도록 toString()을 오버라이딩 하시오.

```java
class MyVector{
	Object[] objArr;
	int size;

	MyVector(int capacity){
		// 객체 초기화
		objArr = Object[capacity];
	}
	MyVector(){
		this(16);
	}

	int size(){
		return size;
	}
	int capacity(){
		return objArr.length;
	}
	boolean isEmpty(){
		return size==0;
	}

	void add(Object obj){
		if(size == objArr.length){
			Object[] tmp = new Object[objArr.length * 2];
			System.arraycopy(objArr, 0, tmp, 0, size);
			objArr = tmp;
		}
		objArr[size++] = obj;
	}

	Object get(int index){
		// 사용자가 범위가 아닌 숫자를 넣은 경우 예외처리
		if(index < 0 || index >= size)
			throw new IndexOutOfBoundsException("범위를 벗어났습니다.");

		return objArr[index];
	}

	public String toString() {
		String tmp = "[";
		for (int i = 0; i < size; i++)
			tmp += objArr[i] + ",";
		return tmp + "]";
	}
}

public class MyVectorTest{
	public static void main(String[] args){
		MyVector v = new MyVector(3);
		v.add(1);
		v.add(2);
		v.add(3);
		v.add(4);
		v.add(5);

		System.out.println(v); // v.toString() 을 줄여 썼다. [1,2,3,4,5,]
	}
}
```

## 문제 7

### MyVector클래스의 객체배열 objArr에서 지정된 객체가 저장되어 있는 위치(index)를 반환하는 int indexOf(Object obj)를 작성하시오.

* 예를들어 Vector 배열에서 5가 몇번째 들어있는지 찾아주는 메서드.
* for문을 돌아 입력받은 값이 일치할때 i값을 반환한다.
* 아무것도 일치하지 않다면 -1을 반환한다.

```java
class MyVector{
	Object[] objArr;
	int size;

	MyVector(int capacity){
		// 객체 초기화
		objArr = Object[capacity];
	}
	MyVector(){
		this(16);
	}

	int size(){
		return size;
	}
	int capacity(){
		return objArr.length;
	}
	boolean isEmpty(){
		return size==0;
	}

	public String toString() {
		String tmp = "[";
		for (int i = 0; i < size ; i++)
			tmp += objArr[i] + ",";
		return tmp + "]";
	}

	void add(Object obj){
		if(size == objArr.length){
			// 1. 배열 2배
			Object[] tmp = new Object[objArr.length * 2];
			// 2. 복사 
			System.arraycopy(objArr, 0, tmp, 0, size);
			// 3. 참조변수 변경
			objArr = tmp;
		}
			// 4. 새로 입력받은 값 넣기
		objArr[size++] = obj;
	}

	Object get(int index){
		// 사용자가 범위가 아닌 숫자를 넣은 경우 예외처리
		if(index < 0 || index >= size)
			throw new IndexOutOfBoundsException("범위를 벗어났습니다.");

		return objArr[index];
	}

	public String toString() {
		String tmp = "[";
		for (int i = 0; i < size; i++)
			tmp += objArr[i] + ",";
		return tmp + "]";
	}
	
	int indexOf(Object obj){
		for(int i = 0; i < size ; i++){
			if(obj.equals(objArr[i]))
				return i;
		}
		return -1;
	}
}

public class MyVectorTest{
	public static void main(String[] args){
		MyVector v = new MyVector(3);
		v.add(1);
		v.add(2);
		v.add(3);
		v.add(4);
		v.add(5);
		System.out.println(v); // [1,2,3,4,5,]
		System.out.println(v.indexOf(5)); // 4 (배열에서 5는 4번째 자리에 있다)
		System.out.println(v.indexOf(9)); // -1 (배열에서 9는 존재하지 않는다)
	}
}
```

## 문제 8

### MyVector클래스의 객체배열 objArr에서 지정된 객체를 삭제하는 Object remove(Object obj)를 작성하시오.

1. indexOf()를 찾는다.
2. 지워지는 위치에 나머지 값들을 덮어쓴다. (책에 그림 참고)
3. 마지막 값을 null로 바꾼다.(마지막 값을 지우는 경우는 덮어쓰기 없이 바로 null로 바꾼다) + `size--;`
4. 지운 객체를 반환한다.

```java
class MyVector{
	Object[] objArr;
	int size;

	MyVector(int capacity){
		// 객체 초기화
		objArr = Object[capacity];
	}
	MyVector(){
		this(16);
	}

	int size(){
		return size;
	}
	int capacity(){
		return objArr.length;
	}
	boolean isEmpty(){
		return size==0;
	}

	public String toString() {
		String tmp = "[";
		for (int i = 0; i < size ; i++)
			tmp += objArr[i] + ",";
		return tmp + "]";
	}

	void add(Object obj){
		if(size == objArr.length){
			Object[] tmp = new Object[objArr.length * 2];
			System.arraycopy(objArr, 0, tmp, 0, size);
			objArr = tmp;
		}
		objArr[size++] = obj;
	}

	Object get(int index){
		if(index < 0 || index >= size)
			throw new IndexOutOfBoundsException("범위를 벗어났습니다.");

		return objArr[index];
	}

	public String toString() {
		String tmp = "[";
		for (int i = 0; i < size; i++)
			tmp += objArr[i] + ",";
		return tmp + "]";
	}
	
	int indexOf(Object obj){
		for(int i = 0; i < size ; i++){
			if(obj.equals(objArr[i]))
				return i;
		}
		return -1;
	}
	
	Object remove(Object obj){
		// 1. indexOf() 값 찾기
		int idx = indexOf(obj);

		// 리턴을 위한 객체 생성

		Object oldObj = objArr[idx];

		// 2. 배열 복사(책 그림 참조)
		if(idx!=size-1)
			System.arraycopy(objArr, idx+1, objArr, idx, obj.length-idx-1);
		// 3. 마지막 값 null
		objArr[--size] = null;
		// objArr[size-1] = null;
		// size--;

		// 지운 객체 반환
		return oldObj;
	}
}

public class MyVectorTest{
	public static void main(String[] args){
		MyVector v = new MyVector(3);
		v.add(1);
		v.add(2);
		v.add(3);
		v.add(4);
		v.add(5);
		System.out.println(v);
		System.out.println(v.indexOf(5));
		System.out.println(v.indexOf(9));

		v.remove(3); // 3이 들어 있는 배열을 지운다
		System.out.println(v); // [1,2,4,5,]
	}
}
```

### 참고자료

* 자바의 정석 11장
* 남궁성 강사님 시험자료
