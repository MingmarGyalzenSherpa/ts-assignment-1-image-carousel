import { Direction } from "./types/enum";
export default class ImageCarousel {
  containerID: string;
  container: HTMLElement | null;
  leftBtn: HTMLButtonElement | undefined;
  rightBtn: HTMLButtonElement | undefined;
  images: HTMLImageElement[] | undefined;
  curIndex: number;
  containerWidth?: number;
  indicatorContainer?: HTMLElement;
  transition: number;

  constructor(containerID: string, transition: number = 1000) {
    this.containerID = containerID;
    this.container = document.getElementById(this.containerID);
    this.containerWidth = +getComputedStyle(this.container!).width.slice(0, -2);
    this.transition = transition;
    this.curIndex = 0;
    if (this.container == null) {
      alert("No element with corresponding id found!!");
      return;
    }
    this.setupImages();
    this.setupButton();
    this.setupIndicators();
    window.addEventListener("resize", () => this.updateContainerWidth());
    //set automatic scroll
    setInterval(() => this.nextImage(Direction.right), this.transition * 5);
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
    } else {
      this.images = Array.from(images);
      //   set position of each image
      this.images.forEach((image, i) => {
        image.style.top = "0px";
        image.style.left = `${i * this.containerWidth!}px`;
      });
    }
  }

  setupButton(): void {
    //create buttons
    this.leftBtn = document.createElement("button");
    this.rightBtn = document.createElement("button");

    //append buttons
    this.container?.appendChild(this.leftBtn);
    this.container?.appendChild(this.rightBtn);

    this.leftBtn.classList.add("carousel-btn", "carousel-btn--left");
    this.rightBtn.classList.add("carousel-btn", "carousel-btn--right");

    this.leftBtn.innerHTML = `<i class="fa fa-chevron-left" aria-hidden="true"></i>`;
    this.rightBtn.innerHTML = `<i class="fa fa-chevron-right" aria-hidden="true"></i>`;

    //add event listener
    this.leftBtn.addEventListener("click", () =>
      this.nextImage(Direction.left)
    );
    this.rightBtn.addEventListener("click", () =>
      this.nextImage(Direction.right)
    );
  }

  setupIndicators() {
    this.indicatorContainer = document.createElement("div");
    this.indicatorContainer.classList.add("indicator-container");
    this.container?.appendChild(this.indicatorContainer);
    let indicator: HTMLElement;
    for (let i = 0; i < this.images!.length; i++) {
      indicator = document.createElement("div");
      indicator.classList.add(`indicator-${i}`);
      if (i == this.curIndex) indicator.classList.toggle("indicator--active");
      indicator.classList.add("indicator");
      this.indicatorContainer.appendChild(indicator);
    }
  }

  goLeft(): void {
    let prevImageLeft: number = +this.images![
      this.curIndex - 1
    ].style.left.slice(0, -2);

    let left: number;

    let interval = setInterval(() => {
      if (prevImageLeft == 0) {
        this.curIndex -= 1;
        clearInterval(interval);
      }
      this.images?.forEach((image) => {
        left = +image.style.left.slice(0, -2);
        image.style.left = `${left + 1}px`;
      });
      prevImageLeft = +this.images![this.curIndex - 1].style.left.slice(0, -2);
    }, 5 / 2);
  }

  goRight(): void {
    let curIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${this.curIndex}`
    );
    let nextIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${this.curIndex + 1}`
    );
    console.log(curIndicator);
    curIndicator?.classList.toggle(`indicator--active`);
    nextIndicator?.classList.toggle(`indicator--active`);

    console.log(curIndicator);

    let nextImageLeft: number = +this.images![
      this.curIndex + 1
    ].style.left.slice(0, -2);
    let left: number;
    console.log(nextImageLeft);

    let interval = setInterval(() => {
      if (nextImageLeft <= 0) {
        this.curIndex += 1;
        clearInterval(interval);
      }
      this.images?.forEach((image) => {
        left = +image.style.left.slice(0, -2);
        image.style.left = `${left - 1}px`;
        console.log(left);
      });
      nextImageLeft = +this.images![this.curIndex + 1].style.left.slice(0, -2);
    }, 5 / 2);
  }

  nextImage(direction: Direction): void {
    let nextIndex: number;
    if (direction == Direction.left) {
      nextIndex =
        this.curIndex == 0 ? this.images!.length - 1 : this.curIndex - 1;
    } else {
      nextIndex = (this.curIndex + 1) % this.images!.length;
    }
    let curIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${this.curIndex}`
    );
    let nextIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${nextIndex}`
    );

    let nextImageLeftPos: number = +this.images![nextIndex].style.left.slice(
      0,
      -2
    );
    let offsetX: number = Math.abs(nextImageLeftPos);
    console.log({
      offsetX,
      transition: this.transition,
      result: this.transition / offsetX,
    });
    let left: number;
    let interval = setInterval(() => {
      if (nextImageLeftPos == 0) {
        this.curIndex = nextIndex;
        console.log(curIndicator);
        console.log(nextIndicator);
        curIndicator?.classList.toggle("indicator--active");
        nextIndicator?.classList.toggle("indicator--active");
        clearInterval(interval);
      }

      this.images?.forEach((image) => {
        left = +image.style.left.slice(0, -2);
        image.style.left = `${
          this.curIndex < nextIndex ? left - 1 : left + 1
        }px`;
      });
      nextImageLeftPos = +this.images![nextIndex].style.left.slice(0, -2);
    }, this.transition / offsetX);
  }

  moveTo(index:number)
  {
    
  }
}
