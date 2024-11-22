import React, { useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement>;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ contentRef }) => {
  const { darkMode } = React.useContext(ThemeContext);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    // Get all headings from the content
    const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const items: TOCItem[] = headings.map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));

    setToc(items);

    // Add IDs to headings if they don't have one
    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      }
    });

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [contentRef]);

  if (toc.length === 0) return null;

  return (
    <nav
      className={`sticky top-24 w-64 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between font-semibold mb-4"
      >
        <span>Table of Contents</span>
        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>

      {!isCollapsed && (
        <ul className="space-y-2">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
                className={`block py-1 text-sm transition-colors ${
                  activeId === item.id
                    ? 'text-blue-500 font-medium'
                    : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default TableOfContents;
