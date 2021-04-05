import { gsap } from "gsap";
import { getMousePos, getSiblings, lerp } from "./utils";

let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", e => {
  mouse = getMousePos(e);
});

export default class Cursor {
  constructor(element) {
    this.Cursor = element;
    this.Cursor.style.opacity = 0;
    this.Item = document.querySelectorAll(".hero-inner-link-item");
    this.Hero = document.querySelector(".hero-inner");
    this.bounds = this.Cursor.getBoundingClientRect();
    this.cursorConfigs = {
      x: { previous: 0, current: 0, amount: 0.2 },
      y: { previous: 0, current: 0, amount: 0.2 }
    };
    this.onMouseMoveEvent = () => {
      this.cursorConfigs.x.previous = this.cursorConfigs.x.current = mouse.x;
      this.cursorConfigs.y.previous = this.cursorConfigs.y.current = mouse.y;
      gsap.to(this.Cursor, {
        duration: 1,
        ease: "Power3.easeOut",
        opacity: 1
      });
      this.onScaleMouse();

      requestAnimationFrame(() => this.render());

      window.removeEventListener("mousemove", this.onMouseMoveEvent);
    };
    window.addEventListener("mousemove", this.onMouseMoveEvent);
  }

  onScaleMouse() {
    this.Item.forEach(link => {
      if (link.matches(":hover")) {
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      }
      link.addEventListener("mouseenter", () => {
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
      link.addEventListener("mouseleave", () => {
        this.scaleAnimation(this.Cursor.children[0], 0);
      });
      link.children[1].addEventListener("mouseenter", () => {
        this.Cursor.classList.add("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 1.2);
      });
      link.children[1].addEventListener("mouseleave", () => {
        this.Cursor.classList.remove("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
    });
  }
  scaleAnimation(element, amount) {
    gsap.to(element, {
      duration: 0.6,
      scale: amount,
      ease: "Power3.easeOut"
    });
  }

  setVideo(element) {
    let src = element.getAttribute("data-video-src");
    let video = document.querySelector(`#${src}`);
    let siblings = getSiblings(video);

    if (video.id == src) {
      gsap.set(video, { zIndex: 4, opacity: 1 });
      siblings.forEach(i => {
        gsap.set(i, { zIndex: 1, opacity: 0 });
      });
    }
  }

  render() {
    this.cursorConfigs.x.current = mouse.x;
    this.cursorConfigs.y.current = mouse.y;

    for (const key in this.cursorConfigs) {
      this.cursorConfigs[key].previous = lerp(
        this.cursorConfigs[key].previous,
        this.cursorConfigs[key].current,
        this.cursorConfigs[key].amount
      );
    }
    this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px)`;
    requestAnimationFrame(() => this.render());
  }
}
