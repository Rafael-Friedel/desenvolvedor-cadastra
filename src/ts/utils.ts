import { Product, ProductFilters } from "./interfaces";

export const formatPrice = (price: number) => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const saveCartQuantity = (quantity: string) =>
  localStorage.setItem("cartQuantity", quantity);

export const getCartQuantity = () => {
  const quantity = localStorage.getItem("cartQuantity");
  return quantity ? parseInt(quantity, 10) : 0;
};

export const getDeviceType = () =>
  window.innerWidth <= 600 ? "mobile" : "desktop";

export const getDisplayedProductsCount = () =>
  getDeviceType() === "mobile" ? 4 : 9;

export const checkSearchParam = (key: string, value: string): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const values = urlParams.getAll(key);
  return values.includes(value);
};

export const getColorsAndSizes = (products: Product[]) => {
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

export const updateUrlWithSearchParam = (term: string) => {
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

export const parseUrlParams = (): ProductFilters => {
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
