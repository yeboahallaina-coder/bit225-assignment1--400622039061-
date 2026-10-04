/* ==========================================================
   data.js - the data for BlueLib Catalogue
   The data is stored in Maps. A Map is a list where every item
   has a key (like an ID) and a value (the details).
   Example: booksData.get(1) gives the details of book number 1.
   This file must be loaded BEFORE app.js.
   ========================================================== */
// Note on AI Collaboration:
//    Claude AI was used as a coding assistant.
//    The final implementation was reviewed, adapted, and thoroughly tested by the author.  
/* Categories: category name -> the text shown on the filter button */
const categoriesData = new Map([
    ["IT", "IT"],
    ["Business", "Business"],
    ["Science", "Science"],
    ["Arts", "Arts"]
]);

/* Books: book ID -> book details.
   cover = a picture from the internet (Open Library).
   If the picture cannot load, the title is shown in a box instead. */
const booksData = new Map([
    [1, {
        id: 1,
        title: "The Pragmatic Programmer",
        author: "David Thomas and Andrew Hunt",
        category: "IT",
        copies: 6,
        callNumber: "QA76.76",
        cover: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg"
    }],
    [2, {
        id: 2,
        title: "Zero to One",
        author: "Peter Thiel",
        category: "Business",
        copies: 2,
        callNumber: "HD62.5",
        cover: "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg"
    }],
    [3, {
        id: 3,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        copies: 4,
        callNumber: "QB981",
        cover: "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg"
    }],
    [4, {
        id: 4,
        title: "The Story of Art",
        author: "E. H. Gombrich",
        category: "Arts",
        copies: 0,
        callNumber: "N5300",
        cover: "https://covers.openlibrary.org/b/isbn/9780714832470-L.jpg"
    }],
    [5, {
        id: 5,
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Erich Gamma et al.",
        category: "IT",
        copies: 5,
        callNumber: "QA76.64",
        cover: "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg"
    }],
    [6, {
        id: 6,
        title: "Good to Great",
        author: "Jim Collins",
        category: "Business",
        copies: 3,
        callNumber: "HD57.7",
        cover: "https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg"
    }]
]);

/* How many days a book can be borrowed */
const loanPeriodDays = 14;