import { FilterType } from "./interfaces";
import {
  getDeviceType,
  parseUrlParams,
  updateUrlWithSearchParam,
} from "./utils";

const filters = parseUrlParams();
const isMobile = getDeviceType() === "mobile";

console.log(filters, "xablau");

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
        console.log(checkElement);

        !isMobile
          ? updateUrlWithSearchParam(`${options}=${checkElement.id}`)
          : updateFilters(`${checkElement.id}`, `${options}s` as FilterType);
      }
    }
  };

  parentElement.addEventListener("click", handleClick);
  parentElementMobile.addEventListener("click", handleClick);
};

const updateFilters = (term: string, type: FilterType) => {
  const itemIndex = filters[type].indexOf(term);
  if (itemIndex !== -1) {
    filters[type].splice(itemIndex, 1);
  } else filters[type].push(term);
};

export const toggleClassSizesElements = () => {
  const parentElement = document.querySelector(`#aside-options-sizes`);
  const parentElementMobile = document.querySelector(".options-filter-sizes");
  const handleClick = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("option-size")) {
      target.classList.toggle("selected");
      !isMobile
        ? updateUrlWithSearchParam(`size=${target.id}`)
        : updateFilters(`${target.id}`, "sizes" as FilterType);
    }
  };

  parentElement.addEventListener("click", handleClick);
  parentElementMobile.addEventListener("click", handleClick);
};

export const applyFiltersMobile = () => {
  const btnApply = document.querySelector(".apply-filters");
  btnApply.addEventListener("click", () => {
    const urlParams = new URLSearchParams();

    filters.colors.forEach((color) => {
      urlParams.append("color", color);
    });
    filters.sizes.forEach((size) => {
      urlParams.append("size", size);
    });
    filters.prices.forEach((price) => {
      urlParams.append("price", price);
    });

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.location.href = newUrl;
  });
};
