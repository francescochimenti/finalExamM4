// HOMEPAGE JS fetch dei prodotti nella pagina principale
async function loadProducts() {
  const response = await fetch(
    "https://striveschool-api.herokuapp.com/api/product/",
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzMmIzNDFmMTc1YzAwMTRjNTU4ZTMiLCJpYXQiOjE2OTI2MDkzMzIsImV4cCI6MTY5MzgxODkzMn0.c1MdP1IeLb0Yanv8ohow21xWWRwEYiX1HOBD0U57Ckk",
      },
    }
  );
  const products = await response.json();
  const productList = document.getElementById("product-list");
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-12", "col-sm-6", "col-md-4", "col-xl-3");
    productDiv.innerHTML = `
          <div class="card border-0 bg-transparent">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" />
          <h3 class="fw-bold text-center">${product.name}</h3>
    <div class="card-body bg-transparent">
        <p class="card-text fw-bold">${product.description}</p>
        <p class="card-text">Brand: ${product.brand}</p>
        <p class="card-text">Price: ${product.price}€</p>
        <a href="productPage.html?id=${product._id}" class="btn btn-light">View More</a>
    </div>
</div>
        `;
    productList.appendChild(productDiv);
  });
}

loadProducts();
