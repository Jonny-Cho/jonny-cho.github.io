---
layout: post
title: 프로젝트 - GEHA-검색 쿼리 설명
category: project
tags: [프로젝트]
comments: true
---

* 결과화면

![GEHA-방찾기-결과화면]({{site.url}}/assets/post-img/project/search.png)


* [MYSQL - 날짜&인원을 동시에 검색하는 경우 문제해결 (게스트하우스 프로젝트)]({{site.url}}/sql/2019/01/11/mysqlquery/){:target="_blank"}

* searchMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.bit.geha.dao.SearchDao">

<select id="listGeha" resultType="SearchDto">
	select * from searchview
</select>

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