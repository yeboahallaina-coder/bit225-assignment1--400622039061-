/* ==========================================================
   app.js - the functions for BlueLib Catalogue
   The data (booksData, categoriesData, loanPeriodDays)
   comes from data.js, which is loaded first.
   ========================================================== */
// Note on AI Collaboration:
//    Claude AI was used as a coding assistant.
//    The final implementation was reviewed, adapted, and thoroughly tested by the author.  
/* ---------- 1. Get the elements from the page ---------- */
const bookGrid = document.getElementById("book-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const chipBox = document.getElementById("chips");
const availableOnly = document.getElementById("available-only");
const showing = document.getElementById("showing");
const loanPeriod = document.getElementById("loan-period");

const addForm = document.getElementById("add-book-form");
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const categoryInput = document.getElementById("book-category");
const copiesInput = document.getElementById("book-copies");
const formMessage = document.getElementById("form-message");
const resetBtn = document.getElementById("reset-btn");

const toast = document.getElementById("toast");
const toastIcon = document.getElementById("toast-icon");
const toastText = document.getElementById("toast-text");
const navLinks = document.querySelectorAll(".nav-link");

/* ---------- 2. Variables ---------- */
let chosenCategory = "all"; // the category button that is selected
let toastTimer; // used to hide the notification after a few seconds


/* ---------- 3. Make typed text safe ----------
   If someone types HTML tags in the form, this turns them into
   plain text so they cannot break the page. */
function makeSafe(text) {
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");
    return text;
}


/* ---------- 4. Notification (top right corner) ----------
   type can be "success", "info", "warning" or "error".
   Each type has its own colour and symbol. */
function showToast(message, type) {
    let symbol = "!";
    if (type === "success") {
        symbol = "\u2713"; // a tick
    }
    if (type === "info") {
        symbol = "i";
    }

    toastIcon.textContent = symbol;
    toastText.textContent = message;
    toast.className = "toast toast-" + type;
    toast.hidden = false;

    // Hide it after 4 seconds (clearTimeout stops the old timer first)
    clearTimeout(toastTimer);
    toastTimer = setTimeout(closeToast, 4000);
}

/* The X button on the notification */
function closeToast() {
    toast.hidden = true;
}


/* ---------- 5. Category buttons (All, IT, Business...) ---------- */
function drawChips() {
    // The "All" button first
    let allClass = "chip";
    if (chosenCategory === "all") {
        allClass = "chip is-active";
    }
    let html = '<button type="button" class="' + allClass + '" onclick="chooseCategory(\'all\')">All</button>';

    // One button for each category in the Map
    categoriesData.forEach(function(label, name) {
        let chipClass = "chip";
        if (chosenCategory === name) {
            chipClass = "chip is-active";
        }
        html += '<button type="button" class="' + chipClass + '" onclick="chooseCategory(\'' + name + '\')">' + label + "</button>";
    });

    chipBox.innerHTML = html;
}

function chooseCategory(name) {
    chosenCategory = name;
    drawChips(); // redraw the buttons so the right one is dark
    showBooks(); // redraw the books
}


/* ---------- 6. Fill the category dropdown in the form ---------- */
function fillCategories() {
    categoriesData.forEach(function(label, name) {
        categoryInput.innerHTML += '<option value="' + name + '">' + label + "</option>";
    });
}


/* ---------- 7. Build one book card ---------- */
function makeCard(book) {
    // Text, colour and button depend on how many copies are left
    let stockText = book.copies + " copies available";
    let stockClass = "stock-ok";
    let buttonText = "Borrow";
    let disabled = "";

    if (book.copies === 1) {
        stockText = "1 copy available";
    }
    if (book.copies <= 2) {
        stockClass = "stock-low"; // running low
    }
    if (book.copies === 0) {
        stockClass = "stock-out"; // none left
        buttonText = "Out of stock";
        disabled = "disabled";
    }

    // Add the picture only if the book has one.
    // If the picture cannot load, onerror hides it (the title shows instead).
    let picture = "";
    if (book.cover) {
        picture = '<img src="' + book.cover + '" alt="Cover of ' + makeSafe(book.title) + '" onerror="this.classList.add(\'hidden\')">';
    }

    // Put the card together piece by piece
    let card = '<article class="book-card">';
    card += '<div class="book-top">';
    card += '<span class="tag">' + book.category + "</span>";
    card += '<span class="stock ' + stockClass + '">' + stockText + "</span>";
    card += "</div>";
    card += '<div class="cover-box">' + picture + '<span class="cover-text">' + makeSafe(book.title) + "</span></div>";
    card += '<h4 class="book-title">' + makeSafe(book.title) + "</h4>";
    card += '<p class="book-author">' + makeSafe(book.author) + "</p>";
    card += '<div class="book-footer">';
    card += '<span class="call-number">Call: ' + makeSafe(book.callNumber) + "</span>";
    card += '<button type="button" class="btn btn-borrow" onclick="borrowBook(' + book.id + ')" ' + disabled + ">" + buttonText + "</button>";
    card += "</div>";
    card += "</article>";

    return card;
}


/* ---------- 8. Show the books on the page ---------- */
function showBooks() {
    const searchText = searchInput.value.toLowerCase().trim();

    let allCards = "";
    let count = 0;

    // Go through every book in the Map
    booksData.forEach(function(book) {
        // Does the book match the search, the category and "Available only"?
        const inTitle = book.title.toLowerCase().includes(searchText);
        const inAuthor = book.author.toLowerCase().includes(searchText);
        const matchesSearch = inTitle || inAuthor;
        const matchesCategory = chosenCategory === "all" || book.category === chosenCategory;
        const matchesStock = availableOnly.checked === false || book.copies > 0;

        if (matchesSearch && matchesCategory && matchesStock) {
            allCards += makeCard(book);
            count = count + 1;
        }
    });

    // Show the cards and the "Showing 6 volumes" text
    bookGrid.innerHTML = allCards;
    emptyState.hidden = count > 0; // the "no books" message shows only when nothing matches

    let word = "volumes";
    if (count === 1) {
        word = "volume";
    }
    showing.innerHTML = 'Showing <span class="count">' + count + "</span> " + word;
}


/* ---------- 9. Borrow a book: take away 1 copy ---------- */
function borrowBook(id) {
    const book = booksData.get(id);

    if (book.copies > 0) {
        book.copies = book.copies - 1;
        showBooks(); // draw the cards again with the new number

        if (book.copies === 0) {
            showToast('You borrowed "' + book.title + '". That was the last copy!', "warning");
        } else {
            showToast('You borrowed "' + book.title + '". Return it within ' + loanPeriodDays + " days.", "success");
        }
    }
}


/* ---------- 10. Messages under the form ---------- */
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "form-message is-" + type; // is-error or is-success
    formMessage.hidden = false;
}

function clearMessage() {
    formMessage.hidden = true;

    // Take the red border off every field
    titleInput.classList.remove("has-error");
    authorInput.classList.remove("has-error");
    categoryInput.classList.remove("has-error");
    copiesInput.classList.remove("has-error");
}


/* ---------- 11. Add a new book ---------- */
function addBook(event) {
    event.preventDefault(); // stop the page from reloading
    clearMessage();

    // Check each field. Every problem is added to the errors list.
    const errors = [];
    const copies = Number(copiesInput.value);

    if (titleInput.value.trim() === "") {
        errors.push("Book title is required.");
        titleInput.classList.add("has-error");
    }
    if (authorInput.value.trim() === "") {
        errors.push("Author is required.");
        authorInput.classList.add("has-error");
    }
    if (categoryInput.value === "") {
        errors.push("Please select a category.");
        categoryInput.classList.add("has-error");
    }
    if (copiesInput.value.trim() === "") {
        errors.push("Copies available is required.");
        copiesInput.classList.add("has-error");
    } else if (!Number.isInteger(copies) || copies < 0) {
        errors.push("Copies must be a whole number of 0 or more.");
        copiesInput.classList.add("has-error");
    }

    // If there are problems, show them and stop
    if (errors.length > 0) {
        showMessage(errors.join(" "), "error");
        showToast("Please fix the highlighted fields.", "error");
        return;
    }

    // No problems, so add the new book to the Map
    const newId = booksData.size + 1;
    const newTitle = titleInput.value.trim();

    booksData.set(newId, {
        id: newId,
        title: newTitle,
        author: authorInput.value.trim(),
        category: categoryInput.value,
        copies: copies,
        callNumber: "N/A"
    });

    // Empty the form and show the updated list
    addForm.reset();
    searchInput.value = "";
    availableOnly.checked = false;
    chosenCategory = "all";
    drawChips();
    showBooks();

    showMessage('"' + newTitle + '" was added to the catalogue (ID #' + newId + ").", "success");
    showToast('"' + newTitle + '" was added to the catalogue.', "success");
}


/* ---------- 12. Reset Form button ---------- */
function resetForm() {
    clearMessage();
}


/* ---------- 13. Menu: highlight the link that was clicked ---------- */
function menuClicked() {
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("is-active");
    }
    this.classList.add("is-active");
}


/* ---------- 14. Connect the page to the functions and start ---------- */
searchInput.addEventListener("input", showBooks); // search while typing
availableOnly.addEventListener("change", showBooks); // "Available only" box
addForm.addEventListener("submit", addBook); // Add Book button
addForm.addEventListener("reset", resetForm); // Reset Form button
resetBtn.addEventListener("click", function() {
    showToast("The form was cleared.", "info");
});

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", menuClicked);
}

loanPeriod.textContent = "Standard Borrow: " + loanPeriodDays + " Days";
fillCategories();
drawChips();
showBooks();