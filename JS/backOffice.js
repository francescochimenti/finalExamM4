const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI1MWRhMjM4MjY2NTAwMTljNzEwYmUiLCJpYXQiOjE3MDYzNjg0MTgsImV4cCI6MTcwNzU3ODAxOH0.ilII12W8UYei8M7_dssY7TYuC8ZGFHsy3Ho9-9deAAk";

const defURL = "https://striveschool-api.herokuapp.com/api/product/";

// Controllo che tutti i campi del form siano compilati
function areAllFieldsFilled(productDetails) {
  for (let key in productDetails) {
    if (!productDetails[key]) {
      return false;
    }
  }
  return true;
}

// Controllo che ci sia del contenuto all'interno degli input
function checkInput() {
  let inputs = document.querySelectorAll(".input-data input");

  inputs.forEach((input) => {
    // Controllo se quando chiamo la funzione c'è un valore
    if (input.value) {
      input.classList.add("has-content");
    } else {
      input.classList.remove("has-content");
    }

    // Verifica se l'ascoltatore di eventi è già stato aggiunto, nel caso lo raggiungere per stare sempre dietro alle modifiche degli input
    if (!input.hasInputEvent) {
      input.addEventListener("input", function () {
        if (this.value) {
          this.classList.add("has-content");
        } else {
          this.classList.remove("has-content");
        }
      });
      // L'input ha un ascoltatore di eventi
      input.hasInputEvent = true;
    }
  });
}

checkInput();

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

    const productDetails = getProductDetails();

    // Controlla se tutti i campi sono stati riempiti
    if (!areAllFieldsFilled(productDetails)) {
      document.getElementById("backoffice").textContent = "Compila tutto!";
      document.getElementById("backoffice").classList.add("text-danger");
      return; // Se qualcosa non è stato riempito termina la funzione e mostra il messaggio
    }

    const spinner = document.querySelector(".spinner");
    spinner.style.display = "block";

    const productId = document.getElementById("productId").value;

    const method = productId ? "PUT" : "POST";

    const url = productId ? `${defURL}${productId}` : `${defURL}`;

    const success = await sendProductData(url, method, productDetails);

    spinner.style.display = "none";

    if (success) {
      const message =
        method === "PUT"
          ? "Prodotto aggiornato con successo!"
          : "Prodotto aggiunto con successo!";

      alert(message);
      document.getElementById("product-form").reset();
      document.getElementById("submitButton").value = "Aggiungi";
      document.getElementById("backoffice").textContent = "Aggiungi prodotto";
      document.getElementById("backoffice").classList.remove("text-danger");
      checkInput();

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
  const response = await fetch(`${defURL}${product._id}`, {
    method: "DELETE",
    headers: {
      Authorization: TOKEN,
    },
  });

  if (response.ok) {
    alert("Prodotto cancellato con successo!");
    fetchAndDisplayProducts();
  } else {
    alert("Errore, impossibile cancellare il prodotto");
  }
}

//Aggiungo prodotti alla tabella
async function fetchAndDisplayProducts() {
  const response = await fetch(`${defURL}`, {
    headers: {
      Authorization: TOKEN,
    },
  });

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
    /* Richiamo la funzione di controllo input, per controllare anche i valori già inseriti dal "modifica" */
    checkInput();
    document.getElementById("submitButton").value = "Salva";
    document.getElementById("backoffice").textContent = "Modifica prodotto";
    window.scrollTo({ top: 0, behavior: "smooth" });
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
