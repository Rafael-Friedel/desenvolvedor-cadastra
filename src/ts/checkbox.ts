import { checkSearchParam, updateUrlWithSearchParam } from "./utils";

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

export const toggleClassCheckBox = (options: string) => {
  const parentElement = document.querySelector(`#aside-options-${options}s`);
  const parentElementMobile = document.querySelector(
    `.options-filter-${options}s`
  );
  const handleClick = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    const labelElement = target.closest("label.custom-checkbox");
    if (labelElement) {
      const checkElement = labelElement.querySelector(`.check`);
      if (checkElement) {
        checkElement.classList.toggle("checked");
        updateUrlWithSearchParam(`${options}=${checkElement.id}`);
      }
    }
  };

  parentElement.addEventListener("click", handleClick);
  parentElementMobile.addEventListener("click", handleClick);
};
