import { useState, useEffect } from "react";

export const useResponsive = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 480;
  const isTablet = width <= 768 && width > 480;
  const isDesktop = !(isMobile || isTablet);

  return { isMobile, isTablet, isDesktop };
};
