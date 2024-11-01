import { updateProductCount } from "./cardProduct";
import { toggleClassCheckBox } from "./checkbox";
import {
  apllyAnimationArrow,
  applyMobileSortOptions,
  initializeDropdown,
} from "./dropDown";
import { filterProducts } from "./filterProducts";
import {
  addAccordionEvent,
  applyMobileFilterToggleEvents,
  renderColors,
  renderPriceRanges,
  renderSizes,
} from "./optionsFilters";
import { getProducts } from "./service";
import { addButtonLoadMore, renderProducts } from "./shelf";
import { toggleClassSizesElements } from "./sizeSelector";
import {
  getColorsAndSizes,
  getDisplayedProductsCount,
  parseUrlParams,
} from "./utils";

async function main() {
  const products = await getProducts();
  const filters = parseUrlParams();
  const filteredProducts = filterProducts(products, filters);
  const { colors, sizes } = getColorsAndSizes(products);

  applyMobileSortOptions();

  applyMobileFilterToggleEvents(
    ".content-button-sort",
    ".section-sortby-mobile",
    "#close-sortby"
  );
  applyMobileFilterToggleEvents(
    ".content-button-filter",
    ".section-filters-mobile",
    "#close-filters"
  );

  addAccordionEvent(
    "#options-colors-mobile",
    ".options-filter-colors",
    ".arrow-colors"
  );
  addAccordionEvent(
    "#options-sizes-mobile",
    ".options-filter-sizes",
    ".arrow-size"
  );
  addAccordionEvent(
    "#options-prices-mobile",
    ".options-filter-prices",
    ".arrow-prices"
  );
  initializeDropdown();
  updateProductCount();
  toggleClassCheckBox("price");
  toggleClassCheckBox("color");
  toggleClassSizesElements();
  renderPriceRanges();
  renderColors(colors);
  addButtonLoadMore(filteredProducts);
  renderProducts(0, getDisplayedProductsCount(), filteredProducts);
  renderSizes(sizes);
  apllyAnimationArrow();
}

document.addEventListener("DOMContentLoaded", main);
