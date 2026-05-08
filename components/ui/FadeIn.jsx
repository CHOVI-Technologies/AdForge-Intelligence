// components/ui/FadeIn.jsx
import { useEffect, useRef, useState } from "react";

export default function FadeIn({ children, delay = 0, distance = 22, duration = 0.65, style = {}, as: Tag = "div" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} style={{
      opacity:    vis ? 1 : 0,
      transform:  vis ? "translateY(0)" : `translateY(${distance}px)`,
      transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </Tag>
  );
}
