import { checkSearchParam, updateUrlWithSearchParam } from "./utils";

export const createSizeButton = (label: string): HTMLButtonElement => {
  const button = document.createElement("button");
  button.id = label;
  button.classList.add("option-size");
  checkSearchParam("size", label) && button.classList.add("selected");

  button.textContent = label;
  return button;
};

export const toggleClassSizesElements = () => {
  const parentElement = document.querySelector(`#aside-options-sizes`);
  const parentElementMobile = document.querySelector(".options-filter-sizes");
  const handleClick = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("option-size")) {
      target.classList.toggle("selected");
      updateUrlWithSearchParam(`size=${target.id}`);
    }
  };

  parentElement.addEventListener("click", handleClick);
  parentElementMobile.addEventListener("click", handleClick);
};
