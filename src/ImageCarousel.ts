import { Direction } from "./types/enum";
export default class ImageCarousel {
  containerID: string;
  container: HTMLElement | null;
  leftBtn: HTMLButtonElement | undefined;
  rightBtn: HTMLButtonElement | undefined;
  images: HTMLImageElement[] | undefined;
  curIndex: number;
  containerWidth: number;
  indicatorContainer?: HTMLElement;
  transition: number;
  // automaticScroll;
  start?: DOMHighResTimeStamp;
  constructor(containerID: string, transition: number = 1000) {
    //setting up image-carousel-container
    this.containerID = containerID;
    this.container = document.getElementById(this.containerID);
    console.log(this.container);
    this.containerWidth = +getComputedStyle(this.container!).width.slice(0, -2);

    this.transition = transition;
    this.curIndex = 0; // initially set to 0
    if (this.container == null) {
      alert("No element with corresponding id found!!");
      return;
    }
    this.setupImages();
    this.setupButton();
    this.setupIndicators();
    window.addEventListener("resize", () => this.updateContainerWidth());
    //set automatic scroll
    // this.automaticScroll = setInterval(() => {
    //   this.nextImage(Direction.right);
    // }, this.transition * 5);
  }

  updateContainerWidth(): void {
    this.containerWidth = +getComputedStyle(this.container!).width.slice(0, -2);
    console.log(this.containerWidth);
  }

  setupImages(): void {
    let images: NodeListOf<HTMLImageElement> | undefined =
      this.container?.querySelectorAll<HTMLImageElement>("img");

    if (images == undefined) {
      alert("no images found");
      return;
    }
    this.images = Array.from(images);
    // set initial position of each image
    this.images.forEach((image, i) => {
      image.style.top = "0px";
      image.style.left = `${i * this.containerWidth!}px`;
    });
  }

  setupButton(): void {
    //create buttons
    this.leftBtn = document.createElement("button");
    this.rightBtn = document.createElement("button");

    //append buttons
    this.container?.appendChild(this.leftBtn);
    this.container?.appendChild(this.rightBtn);

    //add related classes
    this.leftBtn.classList.add("carousel-btn", "carousel-btn--left");
    this.rightBtn.classList.add("carousel-btn", "carousel-btn--right");

    //add button content
    this.leftBtn.innerHTML = `<i class="fa fa-chevron-left" aria-hidden="true"></i>`;
    this.rightBtn.innerHTML = `<i class="fa fa-chevron-right" aria-hidden="true"></i>`;

    //add event listener
    this.leftBtn.addEventListener("click", () => {
      // clearInterval(this.automaticScroll);
      this.nextImage(Direction.left, false);
    });
    this.rightBtn.addEventListener("click", () => {
      // clearInterval(this.automaticScroll);
      this.nextImage(Direction.right, false);
    });
  }

  setupIndicators() {
    this.indicatorContainer = document.createElement("div");
    this.indicatorContainer.classList.add("indicator-container");
    this.container?.appendChild(this.indicatorContainer);
    let indicator: HTMLElement;

    //set each indicator class and add to indicator container
    for (let i = 0; i < this.images!.length; i++) {
      indicator = document.createElement("div");
      indicator.classList.add(`indicator-${i}`);
      indicator.addEventListener("click", () => this.moveTo(i));
      if (i == this.curIndex) indicator.classList.toggle("indicator--active");
      indicator.classList.add("indicator");
      this.indicatorContainer.appendChild(indicator);
    }
  }

  nextImage(direction: Direction, isAutomatic: boolean = true): void {
    let nextIndex: number;

    //calculate the next index
    if (direction == Direction.left) {
      nextIndex =
        this.curIndex == 0 ? this.images!.length - 1 : this.curIndex - 1;
    } else {
      nextIndex = (this.curIndex + 1) % this.images!.length;
    }

    //store the current and next indicators
    let curIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${this.curIndex}`
    );
    let nextIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${nextIndex}`
    );

    //grab the initial position of next image
    let nextImageLeftPos: number = +this.images![nextIndex].style.left.slice(
      0,
      -2
    );

    //grap how far the next image is
    let offsetX: number = Math.abs(nextImageLeftPos);

    let left: number; //for storing the x position of each images
    // let start: DOMHighResTimeStamp, prevTimeStamp: DOMHighResTimeStamp;
    let dx: number = (offsetX * 20) / this.transition;
    console.log(dx);
    let refId: number;
    const animationCallBack = () => {
      console.log(nextImageLeftPos);
      console.log(nextImageLeftPos <= 0);

      if (
        (nextIndex < this.curIndex && nextImageLeftPos >= 0) ||
        (nextIndex > this.curIndex && nextImageLeftPos <= 0)
      ) {
        this.curIndex = nextIndex;
        curIndicator?.classList.toggle("indicator--active");
        nextIndicator?.classList.toggle("indicator--active");
        console.log("cancel");
        cancelAnimationFrame(refId);
      } else {
        this.images?.forEach((image, i) => {
          left = +image.style.left.slice(0, -2);
          if (i == nextIndex) {
            image.style.left = `${
              this.curIndex < nextIndex
                ? left - dx < 0
                  ? 0
                  : left - dx
                : left + dx > 0
                ? 0
                : left + dx
            }px`;
          } else {
            image.style.left = `${
              this.curIndex < nextIndex ? left - dx : left + dx
            }px`;
          }
        });
        nextImageLeftPos = +this.images![nextIndex].style.left.slice(0, -2);
        refId = requestAnimationFrame(animationCallBack);
      }
    };
    refId = requestAnimationFrame(animationCallBack);
  }

  moveTo(index: number) {
    if (this.curIndex === index) return;
    //clear the ongoing automatic scroll interval

    let nextImageLeftPos: number = +this.images![index].style.left.slice(0, -2);
    let offsetX = Math.abs(nextImageLeftPos);
    let left: number;
    let curIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${this.curIndex}`
    );
    let nextIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${index}`
    );
    let dx: number = (offsetX * 20) / this.transition;
    console.log(dx);
    let refId: number;
    const animationCallBack = () => {
      console.log(nextImageLeftPos);
      console.log(nextImageLeftPos <= 0);

      if (
        (index < this.curIndex && nextImageLeftPos >= 0) ||
        (index > this.curIndex && nextImageLeftPos <= 0)
      ) {
        this.curIndex = index;
        curIndicator?.classList.toggle("indicator--active");
        nextIndicator?.classList.toggle("indicator--active");
        console.log("cancel");
        cancelAnimationFrame(refId);
      } else {
        this.images?.forEach((image, i) => {
          left = +image.style.left.slice(0, -2);
          if (i == index) {
            image.style.left = `${
              this.curIndex < index
                ? left - dx < 0
                  ? 0
                  : left - dx
                : left + dx > 0
                ? 0
                : left + dx
            }px`;
          } else {
            image.style.left = `${
              this.curIndex < index ? left - dx : left + dx
            }px`;
          }
        });
        nextImageLeftPos = +this.images![index].style.left.slice(0, -2);
        refId = requestAnimationFrame(animationCallBack);
      }
    };
    refId = requestAnimationFrame(animationCallBack);
  }
}
