import { updateUrlWithSearchParam } from "./utils";

export const initializeDropdown = () => {
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

export const updateDropdownFromUrl = () => {
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

export const applyAnimatioArrow = (target: string) =>
  document.querySelector(target).classList.toggle("rotate");

export const apllyAnimationArrow = () => {
  document.querySelector("#dropdownBtn").addEventListener("click", function () {
    document.querySelector(".arrow").classList.toggle("rotate");
  });
};

export const applyMobileSortOptions = () => {
  const allSortByMobile = document.querySelectorAll(".option-sort-mobile");
  allSortByMobile.forEach((sortBy) => {
    sortBy.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      updateUrlWithSearchParam(`sortBy=${target.title}`);
    });
  });
};
