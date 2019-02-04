---
layout: post
title: MYSQL - 프로젝트 검색 쿼리 완성
category: sql
tags: [SQL, 프로젝트]
comments: true
---

* 감격스럽다

```sql
-- 검색 쿼리 완성 --
-- 날짜 19-01-01 ~ 19-01-03
-- 인원 4명
-- 가격 10000 ~ 80000
-- 성별 여성전용, 남성전용, 무관
-- 테마 맛집
-- 편의시설 1,3,5,7 (세탁기, 주방/식당, 취사가능, 와이파이)
select gh.guestHouseCode, gh.guestHouseName, gh.address, gh.avgRating, gr.recommendRating,
	   ghmin.minprice, gh.businessTrip, gh.gourmet, gh.trip, gh.shopping,
	   rvc.reviewCnt, fi.originalName
from guestHouse_tb gh
	left join file_tb fi
	on fi.guestHouseCode = gh.guestHouseCode
	and fi.isMainImage = 1
	join grade_tb gr
	on gr.minRating <= gh.avgRating and gh.avgRating <= gr.maxRating
	join
		(
		select gh.guestHouseCode, MIN(rm.charge) "minprice"
		from guestHouse_tb gh
			join room_tb rm
			on rm.guestHouseCode = gh.guestHouseCode
			and rm.gender in ('F', 'M', 'N')
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
	join
		(select ghf.guestHouseCode, COUNT(ghf.facilityCode)
		from guesthouse_has_facility_tb ghf
		where ghf.facilityCode in (1, 3, 5, 7)
		group by ghf.guestHouseCode
		having COUNT(ghf.facilityCode) = 4 -- 편의시설 선택 갯수 html에서 가져올 수 있는지 확인
		) fa
	on fa.guestHouseCode = gh.guestHouseCode
	join room_tb rm
	on rm.guestHouseCode = gh.guestHouseCode
	join
		(select t.roomCode, count(t.d) "countdate"
		from
		(select b.roomCode, a.d
		from 
			(select d
			from date_t
			where d between '2019-01-01' and '2019-01-03'
			) a
			cross join
			room_tb b
			left join booking_tb c
				on b.roomCode = c.roomCode
				and a.d between c.bookingStart and c.bookingEnd
		group by b.roomCode, b.roomName, b.capacity, a.d
		having b.capacity - ifnull(sum(c.bookingNumber), 0) >= 4
		) t
		group by t.roomCode
		having count(t.d) = TIMESTAMPDIFF(DAY, '2019-01-01', '2019-01-03') + 1
		) dp
	on rm.roomCode = dp.roomCode
where ghmin.minprice between 10000 and 80000
and gh.gourmet = 1
order by gh.guestHouseCode
;
```