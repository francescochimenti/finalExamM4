const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzMmIzNDFmMTc1YzAwMTRjNTU4ZTMiLCJpYXQiOjE2OTI2MDkzMzIsImV4cCI6MTY5MzgxODkzMn0.c1MdP1IeLb0Yanv8ohow21xWWRwEYiX1HOBD0U57Ckk";

const defURL =  "https://striveschool-api.herokuapp.com/api/product/"

// Raccolgo i dati del prodotto
function getProductDetails() {
  return {
    name: document.getElementById("productName").value,
    description: document.getElementById("productDescription").value,
    brand: document.getElementById("productBrand").value,
    price: Number(document.getElementById("productPrice").value),
    imageUrl: document.getElementById("productImageUrl").value,
  };
}
//Gestisco del Form di Invio:
async function formSubmit(event) {
  try {
    event.preventDefault();

    const spinner = document.querySelector(".spinner");
          spinner.style.display = "block";

    const productDetails = getProductDetails();

    const productId = document.getElementById("productId").value;
  
    const method = productId ? "PUT" : "POST";

    const url = productId ? `${defURL}${productId}` : `${defURL}`;

    const success = await sendProductData(url, method, productDetails);

    spinner.style.display = "none";

    if (success) {
      const message =
        method === "PUT" ? "Prodotto aggiornato con successo!" : "Prodotto aggiunto con successo!";
        
      alert(message);
      document.getElementById("product-form").reset();
      document.getElementById("submitButton").value = "Aggiungi";
      document.getElementById("backoffice").textContent = "Aggiungi prodotto";

      fetchAndDisplayProducts();
    } else {
      alert("Si è verificato un errore. Riprova!");
    }
  } catch (err) {
    const spinner = document.querySelector(".spinner");
          spinner.style.display = "none";

    console.error(err);
    alert("Errore inaspettato.");
  }
}

document.getElementById("product-form").addEventListener("submit", formSubmit);

//Invio i dati
async function sendProductData(url, method, productDetails) {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(productDetails),
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

//Pulsante elimina
async function handleDelete(product) {
  const response = await fetch(
    `${defURL}${product._id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: TOKEN,
      },
    }
  );

  if (response.ok) {
    alert("Prodotto cancellato con successo!");
    fetchAndDisplayProducts();
  } else {
    alert("Errore, impossibile cancellare il prodotto");
  }
}

//Aggiungo prodotti alla tabella
async function fetchAndDisplayProducts() {
  const response = await fetch(
    `${defURL}`,
    {
      headers: {
        Authorization: TOKEN,
      },
    }
  );

  const products = await response.json();
  populateTable(products);
}

//Riempio la tabella
function populateTable(products) {
  const tableBody = document.querySelector("#productsTable tbody");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    const newRow = tableBody.insertRow();

    newRow.insertCell().textContent = product._id;
    newRow.insertCell().textContent = product.name;
    newRow.insertCell().textContent = product.description;
    newRow.insertCell().textContent = product.brand;
    newRow.insertCell().textContent = product.price;
    newRow.insertCell().textContent = product.imageUrl;

    const actionsCell = newRow.insertCell();
    const editButton = createEditButton(product);
    const deleteButton = createDeleteButton(product);

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
  });
}

// Creo il bottone per modificare i prodotti
function createEditButton(product) {
  const editButton = document.createElement("button");
  editButton.classList.add("btn", "btn-warning");
  editButton.textContent = "Modifica";
  editButton.onclick = function () {
    document.getElementById("productId").value = product._id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productBrand").value = product.brand;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productImageUrl").value = product.imageUrl;
    document.getElementById("submitButton").value = "Salva";
    document.getElementById("backoffice").textContent = "Modifica prodotto";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  return editButton;
}

// Creo il bottone per eliminare il prodotto
function createDeleteButton(product) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.textContent = "Elimina";
  deleteButton.onclick = function () {
    const isConfirmed = confirm(
      "Sei sicuro di voler eliminare questo prodotto?"
    );
    if (isConfirmed) {
      handleDelete(product);
    }
  };
  return deleteButton;
}

fetchAndDisplayProducts();
