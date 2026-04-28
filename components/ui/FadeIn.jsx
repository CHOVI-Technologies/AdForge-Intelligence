import { useEffect, useRef, useState } from "react";

/**
 * FadeIn — Scroll-triggered reveal animation
 * Uses IntersectionObserver for performance (no scroll event listeners)
 *
 * Props:
 *   delay     {number}  — animation delay in seconds (default: 0)
 *   distance  {number}  — translateY start distance in px (default: 24)
 *   threshold {number}  — visibility threshold 0–1 (default: 0.1)
 *   duration  {number}  — animation duration in seconds (default: 0.65)
 *   className {string}  — additional class names
 *   style     {object}  — additional inline styles
 *   as        {string}  — HTML element to render (default: "div")
 */
export default function FadeIn({
  children,
  delay = 0,
  distance = 24,
  threshold = 0.1,
  duration = 0.65,
  className = "",
  style = {},
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
