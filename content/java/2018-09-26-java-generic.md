---
title: java 지네릭스
date: '2018-09-26 00:00:00'
categories: java
tags: [java, 지네릭스, Generics]
---

## 지네릭?

뜻
* '이름이 붙지않은' -> 변수 타입을 미리 정하지 않은 것

특징
* 변수 타입을 클래스 밖에서 지정하는 것(메타몽 처럼 타입을 마음대로 정할 수 있다)
* 인스턴스 생성할 때 구체적인 타입 정한다(단, 참조타입만 사용가능)

장점
* 타입 안정성(Type safety)제공
* 타입체크 형변환 생략가능

## 사용법

1. 지네릭 클래스 만들기
2. 객체 생성시 타입지정
3. 사용

```java
class Gen<T>{ //1. 지네릭 클래스 만들기(타입변수 T로 지정)
    private T something; // 변수 타입 T로 지정
    
    public void setSomething(T something){ //setter(매개변수 타입 T)
        this.something = something;
    }

    public T getSomething(){ //getter 리턴 타입 T
        return something;
    }
}

public class GenericPrac{
    public static void main(String[] args){
        // String something; // 보통은 이렇게 변수 타입 지정
        Gen<String> gen = new Gen<String>(); // 2. 객체 생성시 구체적인 타입 지정 
        gen.setSomething("지네릭스 연습"); // 3. 사용
        gen.getSomething(); // 결과  지네릭스 연습

        Gen<Integer> gen2 = new Gen<Integer>(); // (원시타입은 래퍼 클래스로 바꿔서 사용. int -> Integer)
        gen2.setSomething(1);
        gen2.getSomething(); // 1

        // -> 객체 생성할 때마다 다른 타입으로 사용 가능
    }
}
```

## 컬렉션 프레임워크 + 지네릭스

* 컬렉션 프레임워크에서 ArrayList를 쓸 때 지네릭스와 함께 자주 사용한다
* ArrayList는 모든 타입의 값을 저장할 수 있게 하기 위해서 Object 타입으로 저장된다. 따라서 출력할 때 매번 원래의 데이터 타입으로 형변환을 해줘야 하는데, 지네릭스를 사용하면 형변환 할 필요 없이 사용가능하다

```java
import java.util.ArrayList; // 1. 지네릭 클래스는 이미 만들어져 있다

public class GenericPrac{
    public static void main(String[] args){ 
        ArrayList<String> arr = new ArrayList<String>(); // 2. 객체 생성시 데이터 타입 지정
        arr.add("apple");
        arr.add("banana");
        arr.add("orange"); // 3. 사용

        System.out.println(array.get(0));
        // apple
    }
}
```

## 와일드 카드

* 매개변수 타입을 지금 정하지 않겠다는 의미

```java
showInfo(arrayNation);
showInfo(arrayCity);
```
* 위 두개의 코드가 모두 실행이 되려면 array 타입이 `<Nation>`이어도, `<City>`여도 안된다. 자유롭게 사용하기 위해 <?> 와일드카드 사용

* 하지만 <?> 만 사용했을 때는 Nation, City가 아니라 어떤 타입이 와도 오류가 발생하지 않는다. Nation의 자손만 사용가능하게 하기 위해서 <? extends Nation> 을 사용
* 주로 <? extends T> Upper Bounded Wildcard 와일드 카드의 상향 제한 형태로 많이 쓴다 T와 그 자손들만 가능

```java
import java.util.ArrayList;

class Nation {
	private String name;
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
}

class City extends Nation{}

public class WhildCard {
	public static void main(String[] args) {
		Nation nation1 = new Nation();
		Nation nation2 = new Nation();
		Nation nation3 = new Nation();
		
		nation1.setName("Korea");
		nation2.setName("Japan");
		nation3.setName("China");
		
		City city1 = new City();
		City city2 = new City();
		City city3 = new City();
		
		city1.setName("Seoul");
		city2.setName("Tokyo");
		city3.setName("Beijing");
		
		ArrayList<Nation> arrayNation = new ArrayList<Nation>();
		arrayNation.add(nation1);
		arrayNation.add(nation2);
		arrayNation.add(nation3);
		
		ArrayList<City> arrayCity = new ArrayList<City>();
		arrayCity.add(city1);
		arrayCity.add(city2);
		arrayCity.add(city3);
		
		showInfo(arrayNation); // 여기 집중
        showInfo(arrayCity);
	}
	
	public static void showInfo(ArrayList<? extends Nation> array) { // 여기 집중
		for(Object temp : array) {
			System.out.println(((Nation)temp).getName());
		}
	}
}
```

### 참고자료

* 자바의 정석 12장
* [생활코딩 제네릭](https://opentutorials.org/course/1223/6237)
* [ProjectRin - 자바 기초 제네릭](https://youtu.be/Qs8-IZ4Gjk8)
* [Onsil's blog - [java]제네릭(Generic)](https://onsil-thegreenhouse.github.io/programming/java/2018/02/17/java_tutorial_1-21/)
