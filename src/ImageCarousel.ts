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
  automaticScroll;
  constructor(containerID: string, transition: number = 1000) {
    //setting up image-carousel-container
    this.containerID = containerID;
    this.container = document.getElementById(this.containerID);
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
    this.automaticScroll = setInterval(() => {
      this.nextImage(Direction.right);
    }, this.transition * 5);
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
      clearInterval(this.automaticScroll);
      this.nextImage(Direction.left, false);
    });
    this.rightBtn.addEventListener("click", () => {
      clearInterval(this.automaticScroll);
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
    let interval = setInterval(() => {
      if (
        (nextIndex < this.curIndex && nextImageLeftPos > 0) ||
        (nextIndex > this.curIndex && nextImageLeftPos < 0)
      ) {
        //clear automatic interval if function being invoked by button click
        if (!isAutomatic) {
          this.automaticScroll = setInterval(() => {
            this.nextImage(Direction.right);
          }, this.transition * 5);
        }
        this.curIndex = nextIndex;
        curIndicator?.classList.toggle("indicator--active");
        nextIndicator?.classList.toggle("indicator--active");
        clearInterval(interval);
      }

      //change the x of each images
      this.images?.forEach((image) => {
        left = +image.style.left.slice(0, -2);
        image.style.left = `${
          this.curIndex < nextIndex ? left - 1 : left + 1
        }px`;
      });
      nextImageLeftPos = +this.images![nextIndex].style.left.slice(0, -2);
    }, this.transition / offsetX);
  }

  moveTo(index: number) {
    if (this.curIndex === index) return;
    //clear the ongoing automatic scroll interval
    clearInterval(this.automaticScroll);

    let nextImageLeftPos: number = +this.images![index].style.left.slice(0, -2);
    let offsetX = Math.abs(nextImageLeftPos);
    let left: number;
    let curIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${this.curIndex}`
    );
    let nextIndicator = this.indicatorContainer?.querySelector(
      `.indicator-${index}`
    );
    let interval = setInterval(() => {
      if (
        (index < this.curIndex && nextImageLeftPos > 0) ||
        (index > this.curIndex && nextImageLeftPos < 0)
      ) {
        curIndicator?.classList.toggle("indicator--active");
        nextIndicator?.classList.toggle("indicator--active");
        this.curIndex = index;
        this.automaticScroll = setInterval(() => {
          this.nextImage(Direction.right);
        }, this.transition * 5);
        clearInterval(interval);
      }
      
      this.images?.forEach((image) => {
        left = +image.style.left.slice(0, -2);
        image.style.left = `${this.curIndex < index ? left - 1 : left + 1}px`;
      });
      nextImageLeftPos = +this.images![index].style.left.slice(0, -2);
    }, this.transition / offsetX);
  }
}
