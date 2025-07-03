import React, { useEffect } from 'react';
import './style.scss';

function PostContent({ html }) {
  useEffect(() => {
    const handleCodeBlockExpand = () => {
      const codeBlocks = document.querySelectorAll('.markdown .highlight pre, .markdown pre');
      
      codeBlocks.forEach(codeBlock => {
        // 이미 이벤트 리스너가 추가되었는지 확인
        if (codeBlock.dataset.expandHandlerAdded) return;
        
        codeBlock.addEventListener('click', (e) => {
          // CSS 변수에서 breakpoint 값 읽기 (기본값: 1024px)
          const screenLgMin = parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--screen-lg-min') || '1024'
          );
          
          // 모바일/태블릿에서는 완전히 기능 비활성화
          if (window.innerWidth < screenLgMin) {
            return;
          }
          
          // 우측 상단 아이콘 클릭 감지
          const rect = codeBlock.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          
          if (clickX > rect.width - 40 && clickY < 40) {
            e.stopPropagation();
            codeBlock.classList.toggle('expanded');
          }
        });
        
        // 리사이즈 이벤트 추가
        const handleResize = () => {
          const screenLgMin = parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--screen-lg-min') || '1024'
          );
          
          // 모바일로 전환 시 확장 상태 해제
          if (window.innerWidth < screenLgMin) {
            codeBlock.classList.remove('expanded');
          }
        };
        
        window.addEventListener('resize', handleResize);
        codeBlock.dataset.expandHandlerAdded = 'true';
        
        // 컴포넌트 언마운트 시 리사이즈 이벤트 제거
        codeBlock.dataset.resizeHandler = handleResize;
      });
    };

    // DOM이 로드된 후 실행
    const timer = setTimeout(handleCodeBlockExpand, 100);
    
    return () => {
      clearTimeout(timer);
      
      // 리사이즈 이벤트 리스너 정리
      const codeBlocks = document.querySelectorAll('.markdown .highlight pre, .markdown pre');
      codeBlocks.forEach(codeBlock => {
        if (codeBlock.dataset.resizeHandler) {
          window.removeEventListener('resize', codeBlock.dataset.resizeHandler);
        }
      });
    };
  }, [html]);

  return (
    <div className="post-content">
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default PostContent;
