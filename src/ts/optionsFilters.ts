import { createCheckbox } from "./checkbox";
import { applyAnimatioArrow } from "./dropDown";
import { priceRanges } from "./mocks";
import { createSizeButton } from "./sizeSelector";

export const renderColors = (colors: string[]) => {
  const optionsColorsDesktop = document.getElementById("aside-options-colors");
  const optionsColorsMobile = document.querySelector(".options-filter-colors");
  colors.forEach((color: string) => {
    const checkboxColorDesktop = createCheckbox(color, color, "color");
    const checkboxColorMobile = createCheckbox(color, color, "color");
    optionsColorsDesktop &&
      optionsColorsDesktop.appendChild(checkboxColorDesktop);
    optionsColorsMobile && optionsColorsMobile.appendChild(checkboxColorMobile);
  });
};

export const renderPriceRanges = () => {
  const pricesContainerDesktop = document.getElementById(
    "aside-options-prices"
  );
  const pricesContainerMobile = document.querySelector(
    ".options-filter-prices"
  );

  priceRanges.forEach((price) => {
    const checkboxPriceDesktop = createCheckbox(
      price.label,
      price.value,
      "price"
    );
    const checkboxPriceMobile = createCheckbox(
      price.label,
      price.value,
      "price"
    );
    pricesContainerDesktop &&
      pricesContainerDesktop.appendChild(checkboxPriceDesktop);
    pricesContainerMobile &&
      pricesContainerMobile.appendChild(checkboxPriceMobile);
  });
};

export const renderSizes = (sizes: string[]) => {
  const optionsGridDesktop = document.getElementById("aside-options-sizes");
  const optionsGridMobile = document.querySelector(".options-filter-sizes");

  sizes.forEach((size: string) => {
    const sizeButtonDesktop = createSizeButton(size);
    const sizeButtonMobile = createSizeButton(size);
    optionsGridDesktop && optionsGridDesktop.appendChild(sizeButtonDesktop);
    optionsGridMobile && optionsGridMobile.appendChild(sizeButtonMobile);
  });
};

export const toggleVisible = (target: string) => {
  const filterSection = document.querySelector(target);
  filterSection.classList.toggle("is-visible");
};

export const toggleBodyScroll = () =>
  document.body.classList.toggle("no-scroll");

export const addAccordionEvent = (
  triggerSelector: string,
  contentSelector: string,
  arrowSelector: string
) => {
  const triggerElement = document.querySelector(triggerSelector);
  if (triggerElement) {
    triggerElement.addEventListener("click", () => {
      toggleVisible(contentSelector);
      applyAnimatioArrow(arrowSelector);
    });
  }
};

export const applyMobileFilterToggleEvents = (
  triggerSelector: string,
  sectionSelector: string,
  closeSelector: string
) => {
  const triggerElement = document.querySelector(triggerSelector);
  const closeElement = document.querySelector(closeSelector);

  if (triggerElement && closeElement) {
    triggerElement.addEventListener("click", () => {
      toggleVisible(sectionSelector);
      toggleBodyScroll();
    });

    closeElement.addEventListener("click", () => {
      toggleVisible(sectionSelector);
      toggleBodyScroll();
    });
  }
};
