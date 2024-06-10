export default class ImageCarousel {
  containerID: string;
  container: HTMLElement | null;
  leftBtn: HTMLButtonElement | undefined;
  rightBtn: HTMLButtonElement | undefined;
  constructor(containerID: string) {
    this.containerID = containerID;
    this.container = document.getElementById(this.containerID);
    if (this.container == null) {
      alert("No element with corresponding id found!!");
      return;
    }
    this.setupContainer();
    this.setupButton();
  }

  setupContainer(): void {
    try {
      if (this.container != null) {
        this.container.style.maxWidth = 400 + "px";
        this.container.style.minHeight = 300 + "px";
        this.container.style.border = "1px solid black";
        this.container.style.position = "relative";
      } else {
        throw new Error("container is null");
      }
    } catch (e: any) {
      console.log(e);
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

    //add css properties
    // this.leftBtn.style.position = "absolute";
    // this.rightBtn.style.position = "absolute";

    // this.leftBtn.style.top = "40%";
    // this.rightBtn.style.top = "40%";

    // this.leftBtn.style.left = "0";
    // this.rightBtn.style.right = "0";

    // this.leftBtn.style.width = "20px";
    // this.rightBtn.style.width = "20px";

    // this.leftBtn.style.height = "30px";
    // this.rightBtn.style.height = "30px";

    // this.leftBtn.style.background = "transparent";
    // this.rightBtn.style.background = "transparent";

    // this.leftBtn.style.border = "none";
    // this.rightBtn.style.border = "none";

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
