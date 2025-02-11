function searchTools() {
    let input = document.getElementById("search-bar").value.toLowerCase();
    let cards = document.querySelectorAll(".tool-card");

    cards.forEach(card => {
        let title = card.querySelector("h2").innerText.toLowerCase();
        if (title.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function filterTools(category) {
    let cards = document.querySelectorAll(".tool-card");

    if (category === "all") {
        cards.forEach(card => card.style.display = "block");
    } else {
        cards.forEach(card => {
            if (card.classList.contains(category)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }
}
