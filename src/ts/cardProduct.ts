import { Product } from "./interfaces";
import { formatPrice, getCartQuantity, saveCartQuantity } from "./utils";

export const updateProductCount = () => {
  const countElement = document.querySelector(".count-products");

  const quantity = getCartQuantity();
  if (countElement) {
    countElement.innerHTML = "";
    const quantitySpan = document.createElement("span");
    quantitySpan.textContent = quantity.toString();
    countElement.appendChild(quantitySpan);
  }
};

export const addToCart = () => {
  const currentQuantity = getCartQuantity();
  const newQuantity = currentQuantity + 1;

  saveCartQuantity(newQuantity.toString());
  updateProductCount();
};

export const createProductCardElement = (
  product: Product
): HTMLAnchorElement => {
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
  installments.textContent = `até ${product.parcelamento[0]}x de ${formatPrice(
    product.parcelamento[1]
  )}`;

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
