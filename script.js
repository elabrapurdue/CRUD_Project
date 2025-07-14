let books = [];
let nextId = 4;

function loadBooks() {
    $.getJSON("books.json", function (data) {
        books = data;
        nextId = books.length + 1;
        renderBooks();
    });
}

function renderBooks() {
    $("#book-list").empty();
    books.forEach(book => {
        $("#book-list").append(`
            <div class="book-card" data-id="${book.id}">
                <img src="${book.image}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <div class="synopsis" style="display:none;">${book.synopsis || "No synopsis available."}</div>
                <button class="delete-btn">Delete</button>
                <button class="edit-btn">Edit</button>
            </div>
        `);
    });
}

$(document).on("click", ".book-card img", function () {
    const card = $(this).parent();
    const synopsis = card.find(".synopsis");

    //resets all cards first
    $(".book-card").css({
        "box-shadow": "0 0 5px rgba(0,0,0,0.2)",
        "background": "rgba(253, 242, 242, 0.384)"
    });

    $(".synopsis").not(synopsis).slideUp();

    if (synopsis.is(":visible")) {
        synopsis.slideUp();
        card.css({
            "box-shadow": "0 0 5px rgba(0,0,0,0.2)",
            "background": "rgba(253, 242, 242, 0.384)"
        });
    } else {
        synopsis.slideDown();
        card.css({
            "box-shadow": "0 0 15px rgb(255, 3, 171)",
            "background": "rgb(247, 201, 232)"
        });
    }
});



function addBook(title, author, image) {
    books.push({ id: nextId++, title, author, image, synopsis: "No synopsis available." });
    renderBooks();
    highlightLastCard();
}

function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    renderBooks();
}

function updateBook(id, newTitle, newAuthor, newImage) {
    const book = books.find(b => b.id === id);
    if (book) {
        book.title = newTitle;
        book.author = newAuthor;
        book.image = newImage;
    }
    renderBooks();
}

function highlightLastCard() {
    const lastCard = $("#book-list .book-card").last();

    lastCard.css({
        "background": "linear-gradient(to right, #00ffcc, #00ff66)",
        "box-shadow": "0 0 20px #00ffcc"
    });

    lastCard.animate({ opacity: 0.8 }, 200).animate({ opacity: 1 }, 200);

    setTimeout(() => {
        lastCard.css({
            "background": "rgba(253, 242, 242, 0.41)",
            "box-shadow": "0 0 5px rgba(0,0,0,0.2)"
        });
    }, 1000);
}


$(document).ready(function () {
    loadBooks();

    $(document).on("click", ".delete-btn", function () {
        const id = parseInt($(this).parent().attr("data-id"));
        $(this).parent().fadeOut(300, function () {
            deleteBook(id);
        });
    });

    $(document).on("click", ".edit-btn", function () {
        const card = $(this).parent();
        const id = parseInt(card.attr("data-id"));
        const currentTitle = card.find("h3").text();
        const currentAuthor = card.find("p").text();
        const currentImage = card.find("img").attr("src");

        const newTitle = prompt("Edit title:", currentTitle);
        const newAuthor = prompt("Edit author:", currentAuthor);
        const newImage = prompt("Edit image URL:", currentImage);

        if (newTitle && newAuthor && newImage) {
            updateBook(id, newTitle, newAuthor, newImage);
        }
    });

    $("#add-book").click(function () {
        const title = $("#book-title").val().trim();
        const author = $("#book-author").val().trim();
        let image = $("#book-image").val().trim();
        let synopsis = $("#book-synopsis").val().trim();

        if (!title || !author) {
            alert("Please enter both a book title and an author.");
            return;
        }

        if (!image) {
            image = "book.png";
        }

        if (!synopsis) {
            synopsis = "No synopsis available.";
        }

        books.push({ id: nextId++, title, author, image, synopsis });
        renderBooks();
        highlightLastCard();

        $("#book-title, #book-author, #book-image, #book-synopsis").val("");
    });

});
