// Pagina prodotto

document.addEventListener("DOMContentLoaded", function () {
  const id = getIdFromUrl();

  if (id) {
    fetchProductDetails(id);
  }
});

function getIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function fetchProductDetails(id) {
  try {
    const response = await fetch(
      `https://striveschool-api.herokuapp.com/api/product/${id}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI1MWRhMjM4MjY2NTAwMTljNzEwYmUiLCJpYXQiOjE3MDYzNjg0MTgsImV4cCI6MTcwNzU3ODAxOH0.ilII12W8UYei8M7_dssY7TYuC8ZGFHsy3Ho9-9deAAk",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Couldn't fetch product details");
    }

    const product = await response.json();
    displayProductDetails(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

function displayProductDetails(product) {
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-description").textContent =
    product.description;
  document.getElementById("product-brand").textContent = product.brand;
  document.getElementById("product-price").textContent = product.price + "€";
  const imgElements = document.querySelectorAll(".product-image");
  imgElements.forEach((img) => {
    img.src = product.imageUrl;
    img.alt = product.name;
  });
}
