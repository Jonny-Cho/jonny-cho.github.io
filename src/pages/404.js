import React, { useEffect, useState } from 'react';

import Layout from '../layout';
import Seo from '../components/seo';

function NotFoundPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 실행 (SSR 방지)
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    
    // 구 URL 패턴 체크: /category/YYYY/MM/DD/title/
    const legacyPattern = /^\/(\w+)\/(\d{4})\/(\d{2})\/(\d{2})\/(.+?)\/$/;
    const match = path.match(legacyPattern);
    
    if (match) {
      const [, category, year, month, day, title] = match;
      const newPath = `/${category}/${year}-${month}-${day}-${title}/`;
      
      setIsRedirecting(true);
      
      // 새 URL로 리디렉션
      window.location.replace(newPath);
    }
  }, []);

  if (isRedirecting) {
    return (
      <Layout>
        <Seo title="페이지 이동 중..." />
        <h1>페이지 이동 중...</h1>
        <p>새로운 URL로 이동하고 있습니다. 잠시만 기다려주세요.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo title="404: Not found" />
      <h1>404: Not Found</h1>
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <p>
        <a href="/">홈페이지로 돌아가기</a>
      </p>
    </Layout>
  );
}

export default NotFoundPage;
