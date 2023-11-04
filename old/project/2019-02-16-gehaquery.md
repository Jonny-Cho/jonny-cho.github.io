---
layout: post
title: 프로젝트 - GEHA-검색 쿼리 설명
category: project
tags: [프로젝트]
---

* 프로젝트에서 검색부분을 맡으면서 가장 고생을 많이 하고 시간 투자도 많이 한 부분인 검색쿼리에 대해서 설명해보려고 합니다.

* Input - 날짜, 인원수, 키워드, 가격, 성별, 테마, 편의시설, 정렬기준
* Output - 예약이 가능한 게스트 하우스의 이름, 평균평점, 평점에 따른 텍스트, 리뷰 갯수, 테마 정보, 최저 가격

## 결과화면

![GEHA-방찾기-결과화면]({{site.url}}/assets/post-img/project/search.png)

* 그 중에서 날짜와 인원을 동시에 검색하는 경우는 어떤식으로 접근해야 하는지 전혀 감이 오지 않아서 데이터베이스 커뮤니티인 구루비에 질문을 올려서 힌트를 얻었습니다.

* [MYSQL - 날짜&인원을 동시에 검색하는 경우 문제해결 (게스트하우스 프로젝트)]({{site.url}}/sql/2019/01/11/mysqlquery/){:target="_blank"}

## searchMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.bit.geha.dao.SearchDao">

<select id="searchGeha" parameterType="com.bit.geha.criteria.SearchCriteria" resultType="SearchDto">
select distinct gh.guestHouseCode, gh.guestHouseName, gh.address, gh.avgRating, gr.recommendRating,
	   ghmin.minprice, gh.businessTrip, gh.gourmet, gh.trip, gh.shopping,
	   rvc.reviewCnt, fi.savedName
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
	and fi.isMainImage = 1
	and fi.roomCode = 0
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			<if test="gender != null and gender.size() > 0">
				and rm.gender in
		        <foreach collection="gender" item="gender" open="(" separator="," close=")">
		            #{gender}
		        </foreach>
			</if>
		group by gh.guestHouseCode
		) ghmin
	on ghmin.guestHouseCode = gh.guestHouseCode
	left join
		(
		select gh.guestHouseCode, count(rv.reviewNo) "reviewCnt"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			left join booking_tb bk
			on bk.roomCode = rm.roomCode
			left join review_tb rv
			on rv.bookingCode = bk.bookingCode
		group by gh.guestHouseCode
		) rvc
	on rvc.guestHouseCode = gh.guestHouseCode
	join guestHouse_has_facility_tb ghf
	on gh.guestHouseCode = ghf.guestHouseCode
	<if test="facilities != null and facilities.size() > 0">
		join
			(select ghf.guestHouseCode, COUNT(ghf.facilityCode)
			from guestHouse_has_facility_tb ghf
			where ghf.facilityCode in
		        <foreach collection="facilities" item="fa" open="(" separator="," close=")">
		            #{fa}
		        </foreach>
			group by ghf.guestHouseCode
			<bind name="fasize" value="facilities.size()" />
			having COUNT(ghf.facilityCode) = #{fasize}
			) fa
		on fa.guestHouseCode = gh.guestHouseCode
	</if>
	join room_tb rm
	on rm.guestHouseCode = gh.guestHouseCode
	join
		(select t.roomCode, count(t.d) "countdate"
		from
		(select b.roomCode, a.d
		from
			(select d
			from date_t
			where d between #{bookingStart} and #{bookingEnd}
			) a
			cross join
			room_tb b
			left join booking_tb c
				on b.roomCode = c.roomCode
				and a.d between c.bookingStart and c.bookingEnd
		group by b.roomCode, b.roomName, b.capacity, a.d
		<![CDATA[
		having b.capacity - ifnull(sum(c.bookingNumber), 0) >= #{bookingNumber}
		]]>
		) t
		group by t.roomCode
		having count(t.d) = TIMESTAMPDIFF(DAY, #{bookingStart}, #{bookingEnd}) + 1
		) dp
	on rm.roomCode = dp.roomCode
where gh.approvalDate is not NULL
	and ghmin.minprice between #{minprice} and #{maxprice}
<if test='keyword != null and keyword != "" '>
	and (gh.guestHouseName like CONCAT('%',#{keyword},'%') or gh.address like CONCAT('%',#{keyword},'%'))
</if>
<if test="trip == 1">
	and gh.trip = 1
</if>
<if test="gourmet == 1">
	and gh.gourmet = 1
</if>
<if test="shopping == 1">
	and gh.shopping = 1
</if>
<if test="business == 1">
	and gh.businessTrip = 1
</if>

<if test='sort == "rating"'>
	order by gh.avgRating desc, ghmin.minprice asc
</if>
<if test='sort == "review"'>
	order by rvc.reviewCnt desc, ghmin.minprice asc
</if>
<if test='sort == "lowprice"'>
	order by ghmin.minprice asc, gh.avgRating desc
</if>
<if test='sort == "highprice"'>
	order by ghmin.minprice desc, gh.avgRating desc
</if>

</select>
</mapper>
```

## 코드 설명

* 게스트하우스 대표 이미지를 출력 하기 위한 코드입니다
	* fi.isMainImage = 1 은 대표이미지를 뜻하고
	* fi.roomCode = 0 은 방이 아니라 게스트하우스에 대한 이미지임을 뜻합니다. (게스트하우스 전경 or 로비 사진)
	* left (outer) join 은 이미지가 null 인 게스트하우스도 표시하게 하는 코드입니다. 테스트상에서는 이미지가 없는 게스트하우스도 출력 시킬 필요가 있었는데, 실제로 서비스 할 때는 이미지가 없는 게스트하우스는 출력이 되지 않도록 (inner) join으로 바꿔도 좋을 것 같습니다.

```sql
select gh.guestHouseCode, gh.guestHouseName, fi.savedName
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
	and fi.isMainImage = 1
	and fi.roomCode = 0
order by gh.guestHouseCode;
```

---

* 게스트하우스의 평균평점에 따라 텍스트를 출력하는 코드를 추가합니다
	* 9.5 ~ 10점 최고에요
	* 9 ~ 9.4점  추천해요
	* 7 ~ 8.9점  만족해요
	* 5 ~ 6.9점  좋아요
	* 0 ~ 4.9점  아쉬워요

```sql
select gh.guestHouseCode, gh.guestHouseName, fi.savedName, gh.avgRating, gr.recommendRating
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
		and fi.isMainImage = 1
		and fi.roomCode = 0
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
order by gh.guestHouseCode;
```

---

* 게스트하우스가 가지고 있는 방 중에 최저가격을 찾는 코드를 추가합니다.
* 여성전용, 남성전용, 남녀무관한 방을 찾기 위해 and rm.gender 부분에 MyBatis 코드도 추가 되어 있습니다

```sql
select gh.guestHouseCode, gh.guestHouseName, fi.savedName, gh.avgRating, gr.recommendRating,
	ghmin.minprice
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
		and fi.isMainImage = 1
		and fi.roomCode = 0
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			<if test="gender != null and gender.size() > 0">
				and rm.gender in
		        <foreach collection="gender" item="gender" open="(" separator="," close=")">
		            #{gender}
		        </foreach>
			</if>
		group by gh.guestHouseCode
		) ghmin
	on ghmin.guestHouseCode = gh.guestHouseCode
order by gh.guestHouseCode;
```

---

* 게스트 하우스에 달린 리뷰 갯수를 출력하는 코드를 추가합니다
	* guestHouseCode 와 reviewCnt를 보여주는 테이블을 먼저 만들고 원래 있던 테이블과 join했습니다
	* reviewCnt가 Null 이어도 게스트하우스가 출력될 수 있도록 left join을 사용했습니다. 기본값을 0으로 둔다면 join으로 바꿔도 무방합니다

```sql
select gh.guestHouseCode, gh.guestHouseName, fi.savedName, gh.avgRating, gr.recommendRating,
	ghmin.minprice, rvc.reviewCnt
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
		and fi.isMainImage = 1
		and fi.roomCode = 0
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			<if test="gender != null and gender.size() > 0">
				and rm.gender in
		        <foreach collection="gender" item="gender" open="(" separator="," close=")">
		            #{gender}
		        </foreach>
			</if>
		group by gh.guestHouseCode
		) ghmin
	on ghmin.guestHouseCode = gh.guestHouseCode
	left join
		(
		select gh.guestHouseCode, count(rv.reviewNo) "reviewCnt"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			left join booking_tb bk
			on bk.roomCode = rm.roomCode
			left join review_tb rv
			on rv.bookingCode = bk.bookingCode
		group by gh.guestHouseCode
		) rvc
	on rvc.guestHouseCode = gh.guestHouseCode
order by gh.guestHouseCode;
```

---

* 편의시설 검색조건을 판별하는 코드를 추가합니다
	* 사용자가 편의시설 조건을 클릭하지 않았을 경우에는 쿼리문을 실행하지 않도록 하는 예외처리 코드가 있습니다.
	* 컨트롤러에서 facilities가 Null 일때 빈 배열로 만들어주는 코드를 추가 했기 때문에 논리적으로 Mapper에서 Null일 수는 없지만, Mapper에서 Null에대한 예외처리를 삭제하지는 않았습니다.
	* 지금 보면서 생각난 건 if 문을 guestHouse_has_facility_tb 위로 올려서 guestHouse_has_facility_tb 테이블도 거치지 않도록 하는 것입니다. 테스트 후 동작이 잘 되면 수정해야겠습니다.

```sql
select gh.guestHouseCode, gh.guestHouseName, fi.savedName, gh.avgRating, gr.recommendRating,
	ghmin.minprice, rvc.reviewCnt
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
		and fi.isMainImage = 1
		and fi.roomCode = 0
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			<if test="gender != null and gender.size() > 0">
				and rm.gender in
		        <foreach collection="gender" item="gender" open="(" separator="," close=")">
		            #{gender}
		        </foreach>
			</if>
		group by gh.guestHouseCode
		) ghmin
	on ghmin.guestHouseCode = gh.guestHouseCode
	left join
		(
		select gh.guestHouseCode, count(rv.reviewNo) "reviewCnt"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			left join booking_tb bk
			on bk.roomCode = rm.roomCode
			left join review_tb rv
			on rv.bookingCode = bk.bookingCode
		group by gh.guestHouseCode
		) rvc
	on rvc.guestHouseCode = gh.guestHouseCode
	join guestHouse_has_facility_tb ghf
	on gh.guestHouseCode = ghf.guestHouseCode
	<if test="facilities != null and facilities.size() > 0">
		join
			(select ghf.guestHouseCode, COUNT(ghf.facilityCode)
			from guestHouse_has_facility_tb ghf
			where ghf.facilityCode in
		        <foreach collection="facilities" item="fa" open="(" separator="," close=")">
		            #{fa}
		        </foreach>
			group by ghf.guestHouseCode
			<bind name="fasize" value="facilities.size()" />
			having COUNT(ghf.facilityCode) = #{fasize}
			) fa
		on fa.guestHouseCode = gh.guestHouseCode
	</if>
order by gh.guestHouseCode;
```

---

* 가장 어려웠던 부분인 날짜와 인원 검색 부분을 추가합니다
* 구루비에서 받은 답변을 응용해서 쿼리에 추가했습니다
* 달력 테이블과 방 테이블을 cross join 하고 방의 수용인원에서 예약된 인원을 계산하는 것이 핵심입니다.
* 이때 사용자가 입력한 기간 모두 예약이 가능한지 체크하기 위해 서브쿼리로 감싸고 having절을 추가 했습니다
* 중복되는 데이터를 제거하기 위해서 select distinct 로 수정했습니다

```sql
select distinct gh.guestHouseCode, gh.guestHouseName, fi.savedName, gh.avgRating, gr.recommendRating,
	ghmin.minprice, rvc.reviewCnt
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
		and fi.isMainImage = 1
		and fi.roomCode = 0
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			<if test="gender != null and gender.size() > 0">
				and rm.gender in
		        <foreach collection="gender" item="gender" open="(" separator="," close=")">
		            #{gender}
		        </foreach>
			</if>
		group by gh.guestHouseCode
		) ghmin
	on ghmin.guestHouseCode = gh.guestHouseCode
	left join
		(
		select gh.guestHouseCode, count(rv.reviewNo) "reviewCnt"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			left join booking_tb bk
			on bk.roomCode = rm.roomCode
			left join review_tb rv
			on rv.bookingCode = bk.bookingCode
		group by gh.guestHouseCode
		) rvc
	on rvc.guestHouseCode = gh.guestHouseCode
	join guestHouse_has_facility_tb ghf
	on gh.guestHouseCode = ghf.guestHouseCode
	<if test="facilities != null and facilities.size() > 0">
		join
			(select ghf.guestHouseCode, COUNT(ghf.facilityCode)
			from guestHouse_has_facility_tb ghf
			where ghf.facilityCode in
		        <foreach collection="facilities" item="fa" open="(" separator="," close=")">
		            #{fa}
		        </foreach>
			group by ghf.guestHouseCode
			<bind name="fasize" value="facilities.size()" />
			having COUNT(ghf.facilityCode) = #{fasize}
			) fa
		on fa.guestHouseCode = gh.guestHouseCode
	</if>
	join room_tb rm
	on rm.guestHouseCode = gh.guestHouseCode
	join
		(select t.roomCode, count(t.d) "countdate"
		from
		(select b.roomCode, a.d
		from
			(select d
			from date_t
			where d between #{bookingStart} and #{bookingEnd}
			) a
			cross join
			room_tb b
			left join booking_tb c
				on b.roomCode = c.roomCode
				and a.d between c.bookingStart and c.bookingEnd
		group by b.roomCode, b.roomName, b.capacity, a.d
		<![CDATA[
		having b.capacity - ifnull(sum(c.bookingNumber), 0) >= #{bookingNumber}
		]]>
		) t
		group by t.roomCode
		having count(t.d) = TIMESTAMPDIFF(DAY, #{bookingStart}, #{bookingEnd}) + 1
		) dp
	on rm.roomCode = dp.roomCode
order by gh.guestHouseCode;
```

---

* 기타 부분을 추가하고 마무리합니다
	* 승인된 게스트하우스만 출력하는 부분
	* 위에서 계산한 minprice가 사용자가 입력한 가격 사이에 있는 데이터만 출력하는 부분
	* 테마 부분
	* 정렬 부분

* 완성된 쿼리문 입니다

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.bit.geha.dao.SearchDao">

<select id="searchGeha" parameterType="com.bit.geha.criteria.SearchCriteria" resultType="SearchDto">
select distinct gh.guestHouseCode, gh.guestHouseName, gh.address, gh.avgRating, gr.recommendRating,
	   ghmin.minprice, gh.businessTrip, gh.gourmet, gh.trip, gh.shopping,
	   rvc.reviewCnt, fi.savedName
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
	and fi.isMainImage = 1
	and fi.roomCode = 0
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			<if test="gender != null and gender.size() > 0">
				and rm.gender in
		        <foreach collection="gender" item="gender" open="(" separator="," close=")">
		            #{gender}
		        </foreach>
			</if>
		group by gh.guestHouseCode
		) ghmin
	on ghmin.guestHouseCode = gh.guestHouseCode
	left join
		(
		select gh.guestHouseCode, count(rv.reviewNo) "reviewCnt"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			left join booking_tb bk
			on bk.roomCode = rm.roomCode
			left join review_tb rv
			on rv.bookingCode = bk.bookingCode
		group by gh.guestHouseCode
		) rvc
	on rvc.guestHouseCode = gh.guestHouseCode
	join guestHouse_has_facility_tb ghf
	on gh.guestHouseCode = ghf.guestHouseCode
	<if test="facilities != null and facilities.size() > 0">
		join
			(select ghf.guestHouseCode, COUNT(ghf.facilityCode)
			from guestHouse_has_facility_tb ghf
			where ghf.facilityCode in
		        <foreach collection="facilities" item="fa" open="(" separator="," close=")">
		            #{fa}
		        </foreach>
			group by ghf.guestHouseCode
			<bind name="fasize" value="facilities.size()" />
			having COUNT(ghf.facilityCode) = #{fasize}
			) fa
		on fa.guestHouseCode = gh.guestHouseCode
	</if>
	join room_tb rm
	on rm.guestHouseCode = gh.guestHouseCode
	join
		(select t.roomCode, count(t.d) "countdate"
		from
		(select b.roomCode, a.d
		from
			(select d
			from date_t
			where d between #{bookingStart} and #{bookingEnd}
			) a
			cross join
			room_tb b
			left join booking_tb c
				on b.roomCode = c.roomCode
				and a.d between c.bookingStart and c.bookingEnd
		group by b.roomCode, b.roomName, b.capacity, a.d
		<![CDATA[
		having b.capacity - ifnull(sum(c.bookingNumber), 0) >= #{bookingNumber}
		]]>
		) t
		group by t.roomCode
		having count(t.d) = TIMESTAMPDIFF(DAY, #{bookingStart}, #{bookingEnd}) + 1
		) dp
	on rm.roomCode = dp.roomCode
where gh.approvalDate is not NULL
	and ghmin.minprice between #{minprice} and #{maxprice}
<if test='keyword != null and keyword != "" '>
	and (gh.guestHouseName like CONCAT('%',#{keyword},'%') or gh.address like CONCAT('%',#{keyword},'%'))
</if>
<if test="trip == 1">
	and gh.trip = 1
</if>
<if test="gourmet == 1">
	and gh.gourmet = 1
</if>
<if test="shopping == 1">
	and gh.shopping = 1
</if>
<if test="business == 1">
	and gh.businessTrip = 1
</if>

<if test='sort == "rating"'>
	order by gh.avgRating desc, ghmin.minprice asc
</if>
<if test='sort == "review"'>
	order by rvc.reviewCnt desc, ghmin.minprice asc
</if>
<if test='sort == "lowprice"'>
	order by ghmin.minprice asc, gh.avgRating desc
</if>
<if test='sort == "highprice"'>
	order by ghmin.minprice desc, gh.avgRating desc
</if>

</select>
</mapper>
```

> 예상은 했지만 쿼리문 설명하는 것은 정말 어렵습니다. 처음에는 sql문으로 데이터가 출력되는 것도 스크린샷으로 넣으려고 했는데, 마이바티스가 아니면 설명할 수 없는 것도 있어서 일단 쿼리 순서대로만 나열했습니다. 충분한 설명은 아니지만 대략적으로나마 어떤 과정을 거쳐서 작성했는지 참고가 된다면 좋겠습니다.
