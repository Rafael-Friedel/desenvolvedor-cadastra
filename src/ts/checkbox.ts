import { checkSearchParam } from "./utils";

export const createCheckbox = (
  label: string,
  value: string,
  type: "color" | "price"
): HTMLLabelElement => {
  const labelElement = document.createElement("label");
  labelElement.classList.add("custom-checkbox");

  const checkboxContainer = document.createElement("div");
  checkboxContainer.classList.add("checkbox");

  const checkElement = document.createElement("div");
  checkElement.classList.add("check");
  checkSearchParam(type, value) && checkElement.classList.add("checked");
  checkElement.id = value;

  const optionText = document.createElement("span");
  optionText.classList.add("option");
  optionText.textContent = label;

  checkboxContainer.appendChild(checkElement);
  labelElement.appendChild(checkboxContainer);
  labelElement.appendChild(optionText);

  return labelElement;
};
