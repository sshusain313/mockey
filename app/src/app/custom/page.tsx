'use client'

import React, { useEffect, useState } from 'react'
import MobileWarning from './components/MobileWarning'
import Showcase from './components/Showcase'

const page = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MobileWarning />
      {!isMobile && <Showcase />}
    </div>
  )
}

export default page
