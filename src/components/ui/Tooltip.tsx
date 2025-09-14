import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  maxWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  maxWidth = 320
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (trigger === 'hover') {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        calculatePosition();
      }, delay);
    } else {
      setIsVisible(true);
      calculatePosition();
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (trigger !== 'click') {
      setIsVisible(false);
    }
  };

  const toggleTooltip = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
      if (!isVisible) {
        calculatePosition();
      }
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = rect.left + scrollLeft + rect.width / 2;
        y = rect.top + scrollTop - 10;
        break;
      case 'bottom':
        x = rect.left + scrollLeft + rect.width / 2;
        y = rect.bottom + scrollTop + 10;
        break;
      case 'left':
        x = rect.left + scrollLeft - 10;
        y = rect.top + scrollTop + rect.height / 2;
        break;
      case 'right':
        x = rect.right + scrollLeft + 10;
        y = rect.top + scrollTop + rect.height / 2;
        break;
    }

    setTooltipPosition({ x, y });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trigger === 'click' && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, trigger]);

  const getTooltipClasses = () => {
    const baseClasses = `
      absolute z-50 px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-xl
      transition-all duration-200 pointer-events-none
      before:content-[''] before:absolute before:w-0 before:h-0 before:border-solid
    `;

    const positionClasses = {
      top: `
        transform -translate-x-1/2 -translate-y-full
        before:top-full before:left-1/2 before:-translate-x-1/2
        before:border-l-[6px] before:border-r-[6px] before:border-t-[6px]
        before:border-l-transparent before:border-r-transparent before:border-t-gray-900
      `,
      bottom: `
        transform -translate-x-1/2
        before:bottom-full before:left-1/2 before:-translate-x-1/2
        before:border-l-[6px] before:border-r-[6px] before:border-b-[6px]
        before:border-l-transparent before:border-r-transparent before:border-b-gray-900
      `,
      left: `
        transform -translate-x-full -translate-y-1/2
        before:left-full before:top-1/2 before:-translate-y-1/2
        before:border-t-[6px] before:border-b-[6px] before:border-l-[6px]
        before:border-t-transparent before:border-b-transparent before:border-l-gray-900
      `,
      right: `
        transform -translate-y-1/2
        before:right-full before:top-1/2 before:-translate-y-1/2
        before:border-t-[6px] before:border-b-[6px] before:border-r-[6px]
        before:border-t-transparent before:border-b-transparent before:border-r-gray-900
      `
    };

    return `${baseClasses} ${positionClasses[position]}`;
  };

  if (!content.trim()) {
    return <>{children}</>;
  }

  const eventHandlers = {
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === 'focus' && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
    }),
    ...(trigger === 'click' && {
      onClick: toggleTooltip,
    }),
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block cursor-pointer"
        {...eventHandlers}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            className={getTooltipClasses()}
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              maxWidth: `${maxWidth}px`,
              opacity: isVisible ? 1 : 0,
              whiteSpace: 'normal',
              textAlign: 'left',
            }}
            role="tooltip"
            dangerouslySetInnerHTML={{ __html: content }}
          />,
          document.body
        )}
    </>
  );
};

export default Tooltip;