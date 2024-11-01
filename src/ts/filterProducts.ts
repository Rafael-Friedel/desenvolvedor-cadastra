import { Product, ProductFilters } from "./interfaces";

export const filterProducts = (
  products: Product[],
  filters: ProductFilters
) => {
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
