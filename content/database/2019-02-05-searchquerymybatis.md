---
title: MYSQL - 프로젝트 검색 쿼리 마이바티스로 변경
date: '2019-02-05 00:00:00'
categories: database
tags: [database]
---

* SearchCriteria

```java
@Data
@NoArgsConstructor
public class SearchCriteria {
	private String bookingStart;
	private String bookingEnd;
	private String keyword;
	private int bookingNumber;
	private int minprice;
	private int maxprice;
	private List<String> gender;

	private int trip;
	private int gourmet;
	private int shopping;
	private int business;

	private List<Integer> facilities;
}
```

* searchMapper.xml

```sql
<mapper namespace="com.bit.geha.dao.SearchDao">

<select id="searchGeha" parameterType="com.bit.geha.criteria.SearchCriteria" resultType="SearchDto">
select distinct gh.guestHouseCode, gh.guestHouseName, gh.address, gh.avgRating, gr.recommendRating,
	   ghmin.minprice, gh.businessTrip, gh.gourmet, gh.trip, gh.shopping,
	   rvc.reviewCnt, fi.originalName
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
	and fi.isMainImage = 1
	join grade_tb gr
	on gh.avgRating between gr.minRating and gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			<if test="gender != null">
				<if test="gender.size() > 0">
				and rm.gender in
			        <foreach collection="gender" item="gender" open="(" separator="," close=")">
			            #{gender}
			        </foreach>
			    </if>
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
	<if test="facilities != null">
		<if test="facilities.size() > 0">
			join
				(select ghf.guestHouseCode, COUNT(ghf.facilityCode)
				from guesthouse_has_facility_tb ghf
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
where ghmin.minprice between #{minprice} and #{maxprice}
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
order by gh.guestHouseCode
</select>
</mapper>
```

### 참고자료

* [mybatis.org - 동적SQL if, foreach, bind](http://www.mybatis.org/mybatis-3/ko/dynamic-sql.html){:target="_blank"}
