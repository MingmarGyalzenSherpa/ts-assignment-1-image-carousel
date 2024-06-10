export default class ImageCarousel {
  containerID: string;
  container: HTMLElement | null;
  leftBtn: HTMLButtonElement | undefined;
  rightBtn: HTMLButtonElement | undefined;
  images: HTMLImageElement[] | undefined;
  curIndex?: number;
  containerWidth?: number;
  constructor(containerID: string) {
    this.containerID = containerID;
    this.container = document.getElementById(this.containerID);
    if (this.container == null) {
      alert("No element with corresponding id found!!");
      return;
    }
    this.setupContainer();
    this.setupImages();
    this.setupButton();

    window.addEventListener("resize", () => this.updateContainerWidth());
  }

  updateContainerWidth(): void {
    this.containerWidth = +getComputedStyle(this.container!).width.slice(0, -2);
    console.log(this.containerWidth);
  }
  setupContainer(): void {
    try {
      if (this.container != null) {
        // this.container.style.maxWidth = 400 + "px";
        // this.container.style.minHeight = 300 + "px";
        // this.container.style.border = "1px solid black";
        // this.container.style.position = "relative";
        console.log(this.container);
      } else {
        throw new Error("container is null");
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  setupImages(): void {
    let images: NodeListOf<HTMLImageElement> | undefined =
      this.container?.querySelectorAll<HTMLImageElement>("img");
    let width: number = +getComputedStyle(this.container!).width.slice(0, -2);
    console.log(width);

    if (images == undefined) {
      alert("no images found");
    } else {
      this.images = Array.from(images);
      this.curIndex = 0;
      //   set position of each image
      this.images.forEach((image, i) => {
        console.log(getComputedStyle(image).width);
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
    this.leftBtn.addEventListener("click", () => this.goLeft());
    this.rightBtn.addEventListener("click", () => this.goRight());
  }

  goLeft(): void {
    console.log(this);
  }

  goRight(): void {}
}
