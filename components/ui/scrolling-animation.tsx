"use client";

import React, { useEffect, useState, useRef } from "react";

export interface ExpandingCircleImage {
  src: string;
  alt: string;
  label?: string;
}

export interface ScrollingAnimationProps {
  title?: string;
  subtitle?: string;
  description?: string;
  images?: (string | ExpandingCircleImage)[];
  className?: string;
  accentGradient?: string;
}

const DEFAULT_IMAGES: ExpandingCircleImage[] = [
  {
    src: "/images/about-profile.png",
    alt: "Biswajit Panda - Full Stack Developer",
    label: "Biswajit Panda",
  },
  {
    src: "/images/project_saas.jpg",
    alt: "GIET University - B.Tech CSE",
    label: "GIET University (B.Tech)",
  },
  {
    src: "/images/project_crm.jpg",
    alt: "Tech Mahindra - Trainee Engineer",
    label: "Tech Mahindra",
  },
  {
    src: "/images/project_matrimony.jpg",
    alt: "Triptales Commercials - Junior Dev",
    label: "Triptales Commercials",
  },
  {
    src: "/images/project_chat.jpg",
    alt: "Full Stack & Real-time Systems",
    label: "Real-time Architecture",
  },
  {
    src: "/images/project_ai_assistant.jpg",
    alt: "Applied AI & Next.js",
    label: "Applied AI",
  },
  {
    src: "/images/project_ai_voice.jpg",
    alt: "Voice & Speech AI",
    label: "Voice AI & Cloud",
  },
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80",
    alt: "Academic Research & Publications",
    label: "Academic Honors",
  },
];

export function HomePage({
  title = "Empowering",
  subtitle = "Career Trajectory",
  description = "From academic foundations at GIET University to enterprise engineering at Tech Mahindra & Triptales.",
  images = DEFAULT_IMAGES,
  className = "",
  accentGradient = "from-blue-500 via-indigo-500 to-cyan-400",
}: ScrollingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
      if (!node) return window;
      let parent = node.parentElement;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    const target = getScrollParent(containerRef.current);

    const handleScroll = () => {
      if (!containerRef.current) return;

      if (target === window) {
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
        const currentScroll = -rect.top;
        const p = totalScrollable > 0 ? Math.max(0, Math.min(1, currentScroll / totalScrollable)) : Math.min(window.scrollY / 500, 1);
        setProgress(p);
      } else {
        const el = target as HTMLElement;
        const totalScrollable = containerRef.current.offsetHeight - el.clientHeight;
        const currentScroll = el.scrollTop;
        const p = totalScrollable > 0 ? Math.max(0, Math.min(1, currentScroll / totalScrollable)) : Math.min(el.scrollTop / 500, 1);
        setProgress(p);
      }
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      target.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const expandRadius = 130 + progress * 140;

  // Normalize image data
  const normalizedImages: ExpandingCircleImage[] = images.map((item, idx) => {
    if (typeof item === "string") {
      return {
        src: item.replace(/^\[(.*)\]\(.*\)$/, "$1"),
        alt: `Profile ${idx + 1}`,
      };
    }
    return {
      ...item,
      src: item.src.replace(/^\[(.*)\]\(.*\)$/, "$1"),
    };
  });

  const angles = [
    0,
    Math.PI / 4,
    Math.PI / 2,
    (3 * Math.PI) / 4,
    Math.PI,
    (5 * Math.PI) / 4,
    (3 * Math.PI) / 2,
    (7 * Math.PI) / 4,
  ];

  return (
    <div
      ref={containerRef}
      className={`min-h-[220vh] bg-transparent text-white relative w-full ${className}`}
      style={{ minHeight: "220vh" }}
    >
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "600px",
            height: "600px",
            maxWidth: "92vw",
            maxHeight: "92vw",
          }}
        >
          {/* Outer Ring 1 (600px) */}
          <div
            className={`rounded-full flex items-center justify-center transition-all duration-500 ${
              progress > 0.4
                ? "border border-cyan-500/40 shadow-[0_0_50px_rgba(56,189,248,0.2)]"
                : "border border-white/10"
            }`}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.5s ease",
            }}
          >
            {/* Outer Ring 2 (500px) */}
            <div
              className={`rounded-full flex items-center justify-center relative transition-all duration-500 ${
                progress > 0.15
                  ? "border border-indigo-500/40 shadow-[0_0_35px_rgba(99,102,241,0.2)]"
                  : "border border-white/10"
              }`}
              style={{
                width: "84%",
                height: "84%",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all 0.5s ease",
              }}
            >
              {/* Central Glowing Orb (400px) */}
              <div
                className={`rounded-full bg-gradient-to-r ${accentGradient} p-0.5 flex items-center justify-center relative shadow-[0_0_60px_rgba(59,130,246,0.35)]`}
                style={{
                  width: "76%",
                  height: "76%",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  background: "linear-gradient(135deg, #38bdf8, #6366f1, #a855f7)",
                  padding: "2px",
                }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center relative"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "#06040a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {/* Expanding Orbit Image Nodes */}
                  {normalizedImages.slice(0, 8).map((img, idx) => {
                    const angle = angles[idx % angles.length];
                    const x = expandRadius * Math.cos(angle);
                    const y = expandRadius * Math.sin(angle);

                    return (
                      <div
                        key={idx}
                        className="group transition-transform duration-200 ease-out"
                        style={{
                          position: "absolute",
                          left: "calc(50% - 38px)",
                          top: "calc(50% - 38px)",
                          width: "76px",
                          height: "76px",
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: "2px solid rgba(56, 189, 248, 0.65)",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.9), 0 0 16px rgba(56, 189, 248, 0.3)",
                          transform: `translate3d(${x}px, ${y}px, 0)`,
                          zIndex: 20,
                          backgroundColor: "#0c0a18",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        {img.label && (
                          <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                              display: "flex",
                              alignItems: "flex-end",
                              padding: "5px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "9px",
                                fontFamily: "monospace",
                                color: "#38bdf8",
                                fontWeight: 700,
                                lineHeight: 1.15,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {img.label}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Center Content Text */}
                  <div
                    className="flex flex-col items-center justify-center text-center px-3"
                    style={{
                      position: "relative",
                      zIndex: 30,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "0 16px",
                      maxWidth: "200px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "monospace",
                        letterSpacing: "0.12em",
                        color: "#38bdf8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Academic & Career
                    </span>
                    <h2
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "#ffffff",
                        letterSpacing: "-0.02em",
                        margin: "0 0 2px 0",
                        lineHeight: 1.15,
                      }}
                    >
                      {title}
                    </h2>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        background: "linear-gradient(to right, #38bdf8, #818cf8, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        margin: "0 0 6px 0",
                        lineHeight: 1.15,
                      }}
                    >
                      {subtitle}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "#94a3b8",
                        maxWidth: "180px",
                        lineHeight: 1.35,
                        margin: 0,
                      }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
