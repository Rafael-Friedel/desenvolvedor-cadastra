import { createProductCardElement } from "./cardProduct";
import { filterProducts } from "./filterProducts";
import { Product } from "./interfaces";
import { getDisplayedProductsCount } from "./utils";

let displayedProductsCount = getDisplayedProductsCount();

const displayNoProductsMessage = () => {
  const shelf = document.querySelector(".shelf-products");
  const messageElement = document.createElement("div");
  messageElement.classList.add("no-products-message");
  messageElement.textContent = "Nenhum produto encontrado com esses filtros.";

  shelf.appendChild(messageElement);
};

export const renderProducts = (
  start: number,
  end: number,
  filteredProducts: Product[]
) => {
  const shelf = document.querySelector(".shelf-products");
  const productsToShow = filteredProducts.slice(start, end);
  shelf.innerHTML = "";

  if (productsToShow.length === 0) {
    displayNoProductsMessage();
  } else {
    productsToShow.forEach((product: Product) => {
      const productCard = createProductCardElement(product);
      shelf.appendChild(productCard);
    });
  }
};

export const handleLoadMore = (filteredProducts: Product[]) => {
  const loadMoreButton = document.querySelector(
    ".load-more-button"
  ) as HTMLButtonElement;

  const increment = getDisplayedProductsCount();
  const newDisplayedCount = displayedProductsCount + increment;

  if (newDisplayedCount < filteredProducts.length) {
    renderProducts(0, newDisplayedCount, filteredProducts);
    displayedProductsCount = newDisplayedCount;
    loadMoreButton.textContent = "Carregar mais";
  } else {
    renderProducts(0, newDisplayedCount, filteredProducts);
    displayedProductsCount = filteredProducts.length;
    loadMoreButton.textContent = "Carregar menos";
  }
};

export const handleLoadLess = (filteredProducts: Product[]) => {
  const loadMoreButton = document.querySelector(
    ".load-more-button"
  ) as HTMLButtonElement;

  const decrement = getDisplayedProductsCount();
  const newDisplayedCount =
    displayedProductsCount - (displayedProductsCount % decrement);

  const finalDisplayedCount = Math.max(newDisplayedCount, 0);

  renderProducts(0, finalDisplayedCount, filteredProducts);
  displayedProductsCount = finalDisplayedCount;

  loadMoreButton.textContent = "Carregar mais";
};

export const addButtonLoadMore = (filteredProducts: Product[]) => {
  if (filteredProducts.length > getDisplayedProductsCount()) {
    const loadMoreButton = document.createElement("button");
    loadMoreButton.classList.add("load-more-button");
    loadMoreButton.textContent = "Carregar mais";

    loadMoreButton.addEventListener("click", () => {
      if (loadMoreButton.textContent === "Carregar mais") {
        handleLoadMore(filteredProducts);
      } else {
        handleLoadLess(filteredProducts);
      }
    });

    document.querySelector(".container-load-more")?.appendChild(loadMoreButton);
  }
};
