import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    // Bắt đầu chuyển trang
    setIsTransitioning(true);

    // Ẩn loading sau 200ms
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Loading Overlay - hiện rồi ẩn nhanh */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
