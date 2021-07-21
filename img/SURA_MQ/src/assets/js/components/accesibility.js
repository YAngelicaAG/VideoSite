export default class Accesibility {
  constructor() {
    this.btnMaxSize = document.querySelector(".js-btn-max-size");
    this.btnMinSize = document.querySelector(".js-btn-min-size");
    this.btnContrast = document.querySelector(".js-btn-contrast");
    this.domBody = document.querySelector("body");
    this.dataFontSize = this.domBody.dataset.fontSize;
    this.init();
  }

  init() {
    this.maxFontSize();
    this.minFontSize();
    this.changeContrastOfBody();
  }

  maxFontSize() {
    this.btnMaxSize.addEventListener("click", () => {
      this.addInheritClass();

      let sumSizeFont = this.calculatePx("sum", parseInt(this.dataFontSize));

      this.dataFontSize = sumSizeFont;
      this.domBody.setAttribute("data-font-size", sumSizeFont);

      this.domBody.setAttribute(
        "style",
        "font-size: " + this.calculateRem(sumSizeFont) + "rem"
      );
    });
  }

  minFontSize() {
    this.btnMinSize.addEventListener("click", () => {
      this.addInheritClass();

      let sumSizeFont = this.calculatePx("rest", parseInt(this.dataFontSize));

      this.dataFontSize = sumSizeFont;

      this.domBody.setAttribute("data-font-size", sumSizeFont);

      this.domBody.setAttribute(
        "style",
        "font-size: " + this.calculateRem(sumSizeFont) + "rem"
      );
    });
  }

  calculatePx(operator, dataFontSize) {
    let operation = 0;

    if (operator == "sum") {
      operation = dataFontSize + 4;
    } else {
      operation = dataFontSize - 4;
    }

    if (operation <= 12 || operation >= 32) {
      operation = 16;
      this.domBody.classList.remove("ag-is-inherit-font");
    }
    return operation;
  }

  calculateRem(sumSizeFont) {
    let calculateRem = sumSizeFont / 16;
    if (calculateRem <= 1 || calculateRem >= 2) {
      calculateRem = 1;
      this.domBody.classList.remove("ag-is-inherit-font");
    }
    return calculateRem;
  }

  addInheritClass() {
    this.domBody.classList.add("ag-is-inherit-font");
  }

  changeContrastOfBody() {
    this.btnContrast.addEventListener("click", () => {
      this.domBody.classList.toggle("t-theme-contrast");
    });
  }
}
