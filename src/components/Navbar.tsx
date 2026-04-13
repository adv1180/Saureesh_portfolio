import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    const instance = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });
    smoother = instance;

    instance.scrollTop(0);
    instance.paused(true);

    const links = document.querySelectorAll(".header ul a");
    const onNavClick = (e: Event) => {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        const elem = e.currentTarget as HTMLAnchorElement;
        const section = elem.getAttribute("data-href");
        instance.scrollTo(section, true, "top top");
      }
    };
    links.forEach((elem) => {
      elem.addEventListener("click", onNavClick);
    });
    const onResize = () => {
      ScrollSmoother.refresh(true);
    };
    window.addEventListener("resize", onResize);

    return () => {
      links.forEach((elem) => {
        elem.removeEventListener("click", onNavClick);
      });
      window.removeEventListener("resize", onResize);
      instance.kill();
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          SP
        </a>
        <a
          href="https://www.linkedin.com/in/saureesh-pamidipati/"
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          linkedin.com/in/saureesh-pamidipati
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
