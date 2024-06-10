export default class ImageCarousel {
  containerID: string;
  container: HTMLElement | null;
  leftBtn: HTMLButtonElement | undefined;
  rightBtn: HTMLButtonElement | undefined;
  images: HTMLImageElement[] | undefined;
  curIndex: number;
  containerWidth?: number;
  constructor(containerID: string) {
    this.containerID = containerID;
    this.container = document.getElementById(this.containerID);
    this.containerWidth = +getComputedStyle(this.container!).width.slice(0, -2);
    this.curIndex = 0;
    if (this.container == null) {
      alert("No element with corresponding id found!!");
      return;
    }
    this.setupImages();
    this.setupButton();
    window.addEventListener("resize", () => this.updateContainerWidth());
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
    this.leftBtn.addEventListener("click", () => this.goLeft());
    this.rightBtn.addEventListener("click", () => this.goRight());
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
}
