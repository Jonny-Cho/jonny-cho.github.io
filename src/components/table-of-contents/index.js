import React, { useEffect, useState } from 'react';
import './style.scss';

const TableOfContents = ({ html }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Parse HTML to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4');
    
    const headingData = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      const level = parseInt(heading.tagName.substring(1));
      return {
        id,
        text: heading.textContent,
        level,
      };
    });

    setHeadings(headingData);
  }, [html]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Find all heading elements in the actual rendered page
      const headingElements = document.querySelectorAll('h1, h2, h3, h4');
      
      let currentActiveId = '';
      
      headingElements.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        
        if (absoluteTop <= scrollPosition) {
          currentActiveId = heading.id;
        }
      });
      
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  const minLevel = Math.min(...headings.map(h => h.level));

  return (
    <nav className="table-of-contents">
      <ul className="table-of-contents__list">
        {headings.map((heading) => {
          const indent = (heading.level - minLevel) * 16;
          return (
            <li
              key={heading.id}
              className={`table-of-contents__item ${activeId === heading.id ? 'active' : ''}`}
              style={{ paddingLeft: `${indent}px` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className="table-of-contents__link"
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;