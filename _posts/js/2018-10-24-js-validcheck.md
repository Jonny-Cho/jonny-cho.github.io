---
layout: post
title: 자바스크립트로 form 유효성검사하기
category: javascript
tags: [javascript, js]
comments: true
---

```html
<form onsubmit="return validCheck()">
	id: <input type="text" id="userId">
	<input type="submit" value="확인">
</form>

<script>
function validCheck() {
	var userId = document.getElementById('userId').value;

	if(userId.length < 8){
		alert('id는 8글자 이상이어야 합니다.');
		return false;
	}
	return true;
}
</script>
```