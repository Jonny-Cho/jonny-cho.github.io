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
          // 화면 너비가 breakpoint 미만이면 확장 기능 비활성화
          const screenLgMin = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--screen-lg-min'));
          if (window.innerWidth < screenLgMin) return;
          
          // ::after 가상 요소 클릭 감지
          const rect = codeBlock.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          
          // 우측 상단 영역(아이콘 위치) 클릭 감지
          if (clickX > rect.width - 40 && clickY < 40) {
            e.stopPropagation();
            codeBlock.classList.toggle('expanded');
          }
        });
        
        // 중복 이벤트 리스너 방지
        codeBlock.dataset.expandHandlerAdded = 'true';
      });
    };

    // DOM이 로드된 후 실행
    const timer = setTimeout(handleCodeBlockExpand, 100);
    
    return () => clearTimeout(timer);
  }, [html]);

  return (
    <div className="post-content">
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default PostContent;
