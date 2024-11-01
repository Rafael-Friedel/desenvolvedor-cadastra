import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

const apllyAnimationArrow = () => {
  document.querySelector("#dropdownBtn").addEventListener("click", function () {
    document.querySelector(".arrow").classList.toggle("rotate");
  });
};

export const formatPrice = (price: number) => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const getProducts = async () => {
  try {
    const response = await fetch(serverUrl + "/products");

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
};

type PriceRange = {
  label: string;
  value: string;
};

type ProductFilters = {
  colors: string[];
  sizes: string[];
  prices: string[];
  sortBy: string;
};

const priceRanges: PriceRange[] = [
  {
    label: "de R$0 até R$50",
    value: "0-50",
  },
  {
    label: "de R$51 até R$150",
    value: "51-150",
  },
  {
    label: "de R$151 até R$300",
    value: "151-300",
  },
  {
    label: "de R$301 até R$500",
    value: "301-500",
  },
  {
    label: "a partir de R$500",
    value: "500",
  },
];

const getDeviceType = () => (window.innerWidth <= 600 ? "mobile" : "desktop");

async function main() {
  const products = await getProducts();
  const getDisplayedProductsCount = () =>
    getDeviceType() === "mobile" ? 4 : 9;

  const parseUrlParams = (): ProductFilters => {
    const urlParams = new URLSearchParams(window.location.search);
    const colors = urlParams.getAll("color");
    const sizes = urlParams.getAll("size");
    const prices = urlParams.getAll("price");
    const sortBy = urlParams.get("sortBy") || "";

    return {
      colors: colors.length ? colors : [],
      sizes: sizes.length ? sizes : [],
      prices: prices.length ? prices : [],
      sortBy,
    };
  };

  const filters = parseUrlParams();
  console.log(filters);

  // const filterProducts = (products: Product[], filters: ProductFilters) => {
  //   return products.filter((product) => {
  //     const colorMatch =
  //       filters.colors.length === 0 || filters.colors.includes(product.color);
  //     const sizeMatch =
  //       filters.sizes.length === 0 ||
  //       product.size.some((size) => filters.sizes.includes(size));
  //     const priceMatch =
  //       filters.prices.length === 0 ||
  //       filters.prices.some((priceRange) => {
  //         if (priceRange.includes("-")) {
  //           const [minPrice, maxPrice] = priceRange.split("-").map(Number);
  //           return product.price >= minPrice && product.price <= maxPrice;
  //         } else {
  //           const minPrice = Number(priceRange);
  //           return product.price >= minPrice;
  //         }
  //       });

  //     return colorMatch && sizeMatch && priceMatch;
  //   });
  // };

  const filterProducts = (products: Product[], filters: ProductFilters) => {
    let filtered = products.filter((product) => {
      const colorMatch =
        filters.colors.length === 0 || filters.colors.includes(product.color);
      const sizeMatch =
        filters.sizes.length === 0 ||
        product.size.some((size) => filters.sizes.includes(size));
      const priceMatch =
        filters.prices.length === 0 ||
        filters.prices.some((priceRange) => {
          if (priceRange.includes("-")) {
            const [minPrice, maxPrice] = priceRange.split("-").map(Number);
            return product.price >= minPrice && product.price <= maxPrice;
          } else {
            const minPrice = Number(priceRange);
            return product.price >= minPrice;
          }
        });

      return colorMatch && sizeMatch && priceMatch;
    });

    if (filters.sortBy === "Menor preço") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "Maior preço") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "Mais recentes") {
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return filtered;
  };

  const filteredProducts = filterProducts(products, filters);

  let displayedProductsCount = getDisplayedProductsCount();

  const handleLoadMore = () => {
    const loadMoreButton = document.querySelector(
      ".load-more-button"
    ) as HTMLButtonElement;

    const increment = getDisplayedProductsCount();
    const newDisplayedCount = displayedProductsCount + increment;

    if (newDisplayedCount < filteredProducts.length) {
      renderProducts(0, newDisplayedCount);
      displayedProductsCount = newDisplayedCount;
      loadMoreButton.textContent = "Carregar mais";
    } else {
      renderProducts(0, newDisplayedCount);
      displayedProductsCount = filteredProducts.length;
      loadMoreButton.textContent = "Carregar menos";
    }
  };

  const handleLoadLess = () => {
    const loadMoreButton = document.querySelector(
      ".load-more-button"
    ) as HTMLButtonElement;

    const decrement = getDisplayedProductsCount();
    const newDisplayedCount =
      displayedProductsCount - (displayedProductsCount % decrement);

    const finalDisplayedCount = Math.max(newDisplayedCount, 0);

    renderProducts(0, finalDisplayedCount);
    displayedProductsCount = finalDisplayedCount;

    loadMoreButton.textContent = "Carregar mais";
  };

  const addButtonLoadMore = () => {
    if (filteredProducts.length > getDisplayedProductsCount()) {
      const loadMoreButton = document.createElement("button");
      loadMoreButton.classList.add("load-more-button");
      loadMoreButton.textContent = "Carregar mais";

      loadMoreButton.addEventListener("click", () => {
        if (loadMoreButton.textContent === "Carregar mais") {
          handleLoadMore();
        } else {
          handleLoadLess();
        }
      });

      document
        .querySelector(".container-load-more")
        ?.appendChild(loadMoreButton);
    }
  };

  const saveCartQuantity = (quantity: string) =>
    localStorage.setItem("cartQuantity", quantity);

  const getCartQuantity = () => {
    const quantity = localStorage.getItem("cartQuantity");
    return quantity ? parseInt(quantity, 10) : 0;
  };

  const addToCart = () => {
    const currentQuantity = getCartQuantity();
    const newQuantity = currentQuantity + 1;

    saveCartQuantity(newQuantity.toString());
    updateProductCount();
  };

  const createProductCardElement = (product: Product): HTMLAnchorElement => {
    const card = document.createElement("a");
    card.classList.add("card-product");

    const containerImage = document.createElement("div");
    containerImage.classList.add("container-product-image");

    const img = document.createElement("img");
    img.classList.add("product-image");
    img.src = product.image;
    img.alt = "imagem do produto";
    img.loading = "lazy";

    const title = document.createElement("h1");
    title.classList.add("product-name");
    title.textContent = product.name;

    const priceContainer = document.createElement("div");
    priceContainer.classList.add("container-prices");

    const price = document.createElement("span");
    price.classList.add("product-price");
    price.textContent = formatPrice(product.price);

    const installments = document.createElement("span");
    installments.classList.add("product-installments");
    installments.textContent = `até ${
      product.parcelamento[0]
    }x de ${formatPrice(product.parcelamento[1])}`;

    const button = document.createElement("button");
    button.classList.add("add-to-cart");
    button.textContent = "comprar";
    button.addEventListener("click", addToCart);

    containerImage.appendChild(img);
    priceContainer.appendChild(price);
    priceContainer.appendChild(installments);
    card.appendChild(containerImage);
    card.appendChild(title);
    card.appendChild(priceContainer);
    card.appendChild(button);

    return card;
  };

  const updateProductCount = () => {
    const countElement = document.querySelector(".count-products");

    const quantity = getCartQuantity();
    if (countElement) {
      countElement.innerHTML = "";
      const quantitySpan = document.createElement("span");
      quantitySpan.textContent = quantity.toString();
      countElement.appendChild(quantitySpan);
    }
  };

  const displayNoProductsMessage = () => {
    const shelf = document.querySelector(".shelf-products");
    const messageElement = document.createElement("div");
    messageElement.classList.add("no-products-message");
    messageElement.textContent = "Nenhum produto encontrado com esses filtros.";

    shelf.appendChild(messageElement);
  };

  const renderProducts = (start: number, end: number) => {
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

  const getColorsAndSizes = (products: Product[]) => {
    const colors = new Set();
    const sizes = new Set();

    products.forEach((product) => {
      colors.add(product.color);
      product.size.forEach((size) => sizes.add(size));
    });

    const sortedSizes = Array.from(sizes).sort(
      (a: string | number, b: string | number) => {
        const sizeOrder = ["P", "M", "G", "GG"];
        const aIndex = sizeOrder.indexOf(a as string);
        const bIndex = sizeOrder.indexOf(b as string);

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }

        if (!isNaN(a as number) && !isNaN(b as number)) {
          return Number(a) - Number(b);
        }

        if (!isNaN(a as number)) return 1;
        if (!isNaN(b as number)) return -1;

        return 0;
      }
    );

    const sortedColors = Array.from(colors).sort();

    return {
      colors: sortedColors as string[],
      sizes: sortedSizes as string[],
    };
  };

  const { colors, sizes } = getColorsAndSizes(products);

  const createSizeButton = (label: string): HTMLButtonElement => {
    const button = document.createElement("button");
    button.id = label;
    button.classList.add("option-size");
    checkSearchParam("size", label) && button.classList.add("selected");

    button.textContent = label;
    return button;
  };

  const renderSizes = (sizes: string[]) => {
    const optionsGridDesktop = document.getElementById("aside-options-sizes");
    const optionsGridMobile = document.querySelector(".options-filter-sizes");

    sizes.forEach((size: string) => {
      const sizeButtonDesktop = createSizeButton(size);
      const sizeButtonMobile = createSizeButton(size);
      optionsGridDesktop && optionsGridDesktop.appendChild(sizeButtonDesktop);
      optionsGridMobile && optionsGridMobile.appendChild(sizeButtonMobile);
    });
  };

  const createCheckbox = (
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

  const checkSearchParam = (key: string, value: string): boolean => {
    const urlParams = new URLSearchParams(window.location.search);
    const values = urlParams.getAll(key);
    return values.includes(value);
  };

  const renderColors = (colors: string[]) => {
    const optionsColorsDesktop = document.getElementById(
      "aside-options-colors"
    );
    const optionsColorsMobile = document.querySelector(
      ".options-filter-colors"
    );
    colors.forEach((color: string) => {
      const checkboxColorDesktop = createCheckbox(color, color, "color");
      const checkboxColorMobile = createCheckbox(color, color, "color");
      optionsColorsDesktop &&
        optionsColorsDesktop.appendChild(checkboxColorDesktop);
      optionsColorsMobile &&
        optionsColorsMobile.appendChild(checkboxColorMobile);
    });
  };

  const renderPriceRanges = () => {
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

  const updateUrlWithSearchParam = (term: string) => {
    let url = window.location.pathname + window.location.search;
    if (term.startsWith("sortBy=")) {
      url = url.replace(/([&?]sortBy=[^&]*)/, "");
      url += url.includes("?") ? `&${term}` : `?${term}`;
    } else {
      if (url.includes(term)) {
        url = url.replace(term, "");
      } else {
        url = url.includes("?") ? `${url}&${term}` : `${url}?${term}`;
      }
    }
    url = url.replace(/[&?]+$/, "");
    window.location.href = url;
  };

  const toggleClassSizesElements = () => {
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

  const toggleClassCheckBox = (options: string) => {
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

  const toggleVisible = (target: string) => {
    const filterSection = document.querySelector(target);
    filterSection.classList.toggle("is-visible");
  };

  const applyAnimatioArrow = (target: string) =>
    document.querySelector(target).classList.toggle("rotate");

  const toggleBodyScroll = () => document.body.classList.toggle("no-scroll");

  document
    .querySelector("#options-colors-mobile")
    .addEventListener("click", () => {
      toggleVisible(".options-filter-colors");
      applyAnimatioArrow(".arrow-colors");
    });

  document
    .querySelector("#options-sizes-mobile")
    .addEventListener("click", () => {
      toggleVisible(".options-filter-sizes");
      applyAnimatioArrow(".arrow-size");
    });

  document
    .querySelector("#options-prices-mobile")
    .addEventListener("click", () => {
      toggleVisible(".options-filter-prices");
      applyAnimatioArrow(".arrow-prices");
    });

  document
    .querySelector(".content-button-sort")
    .addEventListener("click", () => {
      toggleVisible(".section-sortby-mobile");
      toggleBodyScroll();
    });

  document.getElementById("close-sortby").addEventListener("click", () => {
    toggleVisible(".section-sortby-mobile");
    toggleBodyScroll();
  });

  document
    .querySelector(".content-button-filter")
    .addEventListener("click", () => {
      toggleVisible(".section-filters-mobile");
      toggleBodyScroll();
    });

  document.getElementById("close-filters").addEventListener("click", () => {
    toggleVisible(".section-filters-mobile");
    toggleBodyScroll();
  });

  const updateDropdownFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sortBy = urlParams.get("sortBy");

    if (sortBy) {
      const dropdownBtn = document.getElementById("dropdownBtn");
      const dropdownOptions = document.getElementById("dropdownOptions");
      const options = dropdownOptions.querySelectorAll(".dropdown-option");

      if (dropdownBtn) {
        dropdownBtn.textContent = sortBy;
      }

      options.forEach((option) => {
        if (option.textContent === sortBy) {
          option.classList.add("sort-selected");
        } else {
          option.classList.remove("sort-selected");
        }
      });
    }
  };

  const initializeDropdown = () => {
    const dropdownBtn = document.getElementById("dropdownBtn");
    const dropdownOptions = document.getElementById("dropdownOptions");
    const options = dropdownOptions.querySelectorAll(".dropdown-option");
    updateDropdownFromUrl();
    dropdownBtn.addEventListener("click", () => {
      dropdownOptions.style.display =
        dropdownOptions.style.display === "block" ? "none" : "block";
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        dropdownBtn.textContent = option.textContent;
        options.forEach((opt) => opt.classList.remove("sort-selected"));
        option.classList.add("sort-selected");
        updateUrlWithSearchParam(`sortBy=${option.textContent}`);
        dropdownOptions.style.display = "none";
      });
    });

    document.addEventListener("click", (e) => {
      if (
        !dropdownBtn.contains(e.target as Node) &&
        !dropdownOptions.contains(e.target as Node)
      ) {
        dropdownOptions.style.display = "none";
      }
    });
  };

  initializeDropdown();
  updateProductCount();
  toggleClassCheckBox("price");
  toggleClassCheckBox("color");
  toggleClassSizesElements();
  renderPriceRanges();
  renderColors(colors);
  addButtonLoadMore();
  renderProducts(0, getDisplayedProductsCount());
  renderSizes(sizes);
  apllyAnimationArrow();
}

document.addEventListener("DOMContentLoaded", main);
