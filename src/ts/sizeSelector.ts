import { checkSearchParam } from "./utils";

export const createSizeButton = (label: string): HTMLButtonElement => {
  const button = document.createElement("button");
  button.id = label;
  button.classList.add("option-size");
  checkSearchParam("size", label) && button.classList.add("selected");

  button.textContent = label;
  return button;
};
