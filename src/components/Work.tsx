import { useCallback, useLayoutEffect, useRef, useState } from "react";
import "./styles/Work.css";

const projects = [
  {
    title: "LLM Safety Alignment using RL",
    category: "NLP & LLMs",
    tools: "FLAN-T5, BERT, PPO (TRL)",
    description:
      "Developed a robust NLP pipeline to align Language Models via Reinforcement Learning from Human Feedback (RLHF), improving safety and significantly reducing harmful outputs.",
    link: "#",
  },
  {
    title: "Flight Booking Chatbot",
    category: "Conversational AI",
    tools: "RAG, Google Vertex AI, AlloyDB",
    description:
      "Engineered an intelligent conversational AI agent using Retrieval-Augmented Generation (RAG) and Google Vertex AI to seamlessly streamline flight bookings and answer user queries.",
    link: "#",
  },
  {
    title: "GNN Drug Solubility Predictor",
    category: "Bioinformatics",
    tools: "Graph Neural Networks, PyTorch Geometric, RDKit, FastAPI",
    description:
      "Created a bioinformatics tool leveraging Graph Neural Networks framework to accurately predict drug solubility for accelerated pharmaceutical research.",
    link: "#",
  },
  {
    title: "NEO Risk Analysis Platform",
    category: "Machine Learning",
    tools: "Logistic Regression, Ridge Regression, PCA, K-Means",
    description:
      "Built a machine learning platform for assessing risk through comprehensive data analysis, employing predictive modeling techniques to inform strategic decisions.",
    link: "#",
  },
];

const Work = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [canScrollX, setCanScrollX] = useState(false);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!el || !track || !thumb) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    setCanScrollX((prev) => {
      const next = maxScroll > 0;
      return prev === next ? prev : next;
    });
    const pad = 6;
    const trackInner = Math.max(0, track.clientWidth - pad * 2);

    if (maxScroll === 0 || trackInner === 0) {
      thumb.style.width = `${Math.max(48, trackInner)}px`;
      thumb.style.transform = `translateX(${pad}px)`;
      thumb.classList.add("projects-scroll-custom-thumb--idle");
      return;
    }

    thumb.classList.remove("projects-scroll-custom-thumb--idle");
    const ratio = clientWidth / scrollWidth;
    const thumbW = Math.max(Math.round(ratio * trackInner), 40);
    const maxThumbTravel = Math.max(0, trackInner - thumbW);
    const x = pad + (maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbTravel : 0);
    thumb.style.width = `${thumbW}px`;
    thumb.style.transform = `translateX(${x}px)`;
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateThumb();
    el.addEventListener("scroll", updateThumb, { passive: true });
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    const track = trackRef.current;
    if (track) ro.observe(track);

    window.addEventListener("resize", updateThumb);
    return () => {
      el.removeEventListener("scroll", updateThumb);
      ro.disconnect();
      window.removeEventListener("resize", updateThumb);
    };
  }, [updateThumb]);

  useLayoutEffect(() => {
    const thumb = thumbRef.current;
    const track = trackRef.current;
    const el = scrollRef.current;
    if (!thumb || !track || !el) return;

    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onThumbDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
    };

    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const pad = 6;
      const trackInner = Math.max(0, track.clientWidth - pad * 2);
      const ratio = el.clientWidth / el.scrollWidth;
      const thumbW = Math.max(Math.round(ratio * trackInner), 40);
      const maxThumbTravel = Math.max(0.0001, trackInner - thumbW);
      const dx = e.clientX - startX;
      el.scrollLeft = Math.max(
        0,
        Math.min(maxScroll, startScrollLeft + (dx / maxThumbTravel) * maxScroll)
      );
    };

    const onUp = () => {
      dragging = false;
    };

    const onTrackClick = (e: MouseEvent) => {
      if (e.target === thumb || thumb.contains(e.target as Node)) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const rect = track.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pad = 6;
      const trackInner = Math.max(0, track.clientWidth - pad * 2);
      const ratio = el.clientWidth / el.scrollWidth;
      const thumbW = Math.max(Math.round(ratio * trackInner), 40);
      const maxThumbTravel = Math.max(0.0001, trackInner - thumbW);
      const targetCenter = clickX - pad - thumbW / 2;
      el.scrollLeft = Math.max(
        0,
        Math.min(maxScroll, (targetCenter / maxThumbTravel) * maxScroll)
      );
    };

    thumb.addEventListener("mousedown", onThumbDown);
    track.addEventListener("mousedown", onTrackClick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      thumb.removeEventListener("mousedown", onThumbDown);
      track.removeEventListener("mousedown", onTrackClick);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="projects-scroll-wrap">
          <div ref={scrollRef} className="projects-scroll-container">
            <div className="projects-track">
              {projects.map((project, index) => (
                <div className="project-card" key={index}>
                  <div className="project-number">
                    <h3>0{index + 1}</h3>
                  </div>
                  <div className="project-details">
                    <h4>{project.title}</h4>
                    <p className="project-category">{project.category}</p>

                    <p className="project-description">{project.description}</p>

                    <div className="project-tools">
                      <span className="tools-label">Tools & Features</span>
                      <p>{project.tools}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="projects-scroll-custom"
            aria-hidden="true"
          >
            <div ref={trackRef} className="projects-scroll-custom-track">
              <div ref={thumbRef} className="projects-scroll-custom-thumb" />
            </div>
            {canScrollX ? (
              <p className="projects-scroll-hint">
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
