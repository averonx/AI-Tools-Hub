// Your NewsAPI key
const API_KEY = 'b9109af05a834803ae6a8945d4cc894d';

// Fetch 15 top headlines for World Headlines
const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=15&apiKey=${API_KEY}`;

const newsContainer = document.getElementById('newsContainer');
const memeContainer = document.getElementById('memeContainer');
const scoreCounter = document.getElementById('score');

// Array of funny punchlines to add humor to headlines
const punchlines = [
  " - And that's just unbelievable!",
  " - LOL, who would've thought?",
  " - Seriously, can you believe it?",
  " - Wow, that's one for the books!",
  " - Oops, reality check!",
  " - Hold on, did that really happen?",
  " - Newsflash: This is wild!",
  " - Cue the laughter!",
  " - And now, the plot thickens!",
  " - Wait, what?!",
  " - Unbelievable, right?",
  " - This one's a hoot!",
  " - Hilariously shocking!",
  " - Brace yourself!",
  " - The news just got funnier!"
];

// Function to append a random punchline to a headline
function makeHeadlineFunny(headline) {
  const randomIndex = Math.floor(Math.random() * punchlines.length);
  return headline + punchlines[randomIndex];
}

// Fetch news articles and create news and meme cards
fetch(newsUrl)
  .then(response => response.json())
  .then(data => {
    const articles = data.articles || [];
    articles.forEach(article => {
      const funnyHeadline = makeHeadlineFunny(article.title || "Untitled News");

      // Create a News Card
      const newsCard = document.createElement('div');
      newsCard.className = 'card';

      const imgSrc = article.urlToImage ? article.urlToImage : 'https://via.placeholder.com/300x180?text=No+Image';
      const img = document.createElement('img');
      img.src = imgSrc;
      newsCard.appendChild(img);

      const cardContent = document.createElement('div');
      cardContent.className = 'card-content';

      const newsTitle = document.createElement('h3');
      newsTitle.textContent = funnyHeadline;
      cardContent.appendChild(newsTitle);

      const newsDesc = document.createElement('p');
      newsDesc.textContent = article.description || "No description available.";
      cardContent.appendChild(newsDesc);

      newsCard.appendChild(cardContent);
      newsContainer.appendChild(newsCard);

      // Increase score on card click (gamification)
      newsCard.addEventListener('click', () => {
        let currentScore = parseInt(scoreCounter.textContent.replace("Points: ", ""));
        scoreCounter.textContent = "Points: " + (currentScore + 10);
      });

      // Create a Meme Card
      const memeCardWrapper = document.createElement('div');
      memeCardWrapper.className = 'card';
      memeCardWrapper.style.position = 'relative';
      memeCardWrapper.style.width = '300px';

      const memeImg = document.createElement('img');
      // Using a simple black background with white text as a meme template
      memeImg.src = 'https://via.placeholder.com/300x180/000000/ffffff?text=Meme+Time';

      const memeOverlay = document.createElement('div');
      memeOverlay.className = 'card-content';
      memeOverlay.style.position = 'absolute';
      memeOverlay.style.top = '0';
      memeOverlay.style.left = '0';
      memeOverlay.style.width = '100%';
      memeOverlay.style.height = '100%';
      memeOverlay.style.display = 'flex';
      memeOverlay.style.alignItems = 'center';
      memeOverlay.style.justifyContent = 'center';
      memeOverlay.style.color = '#fff';
      memeOverlay.style.fontSize = '1.1rem';
      memeOverlay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
      memeOverlay.style.padding = '10px';
      memeOverlay.style.boxSizing = 'border-box';
      memeOverlay.style.textAlign = 'center';
      memeOverlay.textContent = funnyHeadline;

      memeCardWrapper.appendChild(memeImg);
      memeCardWrapper.appendChild(memeOverlay);
      memeContainer.appendChild(memeCardWrapper);
    });
  })
  .catch(error => console.error("Error fetching news:", error));

// Navigation button functionality (smooth scrolling)
document.querySelectorAll('.nav-button').forEach(button => {
  button.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(`${this.textContent.trim()} section is coming soon!`);
    }
  });
});

// Day/Night Toggle Functionality
document.querySelector('.toggle-button').addEventListener('click', function() {
  document.body.classList.toggle('night-mode');
  const icon = this.querySelector('.icon');
  if (document.body.classList.contains('night-mode')) {
    icon.textContent = '🌙';
    document.body.style.background = '#121212';
  } else {
    icon.textContent = '☀️';
    document.body.style.background = '#f5f5f5';
  }
});

// Custom Cursor Functionality
const customCursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  customCursor.style.top = `${e.clientY}px`;
  customCursor.style.left = `${e.clientX}px`;
});

// Button Ripple Effect
document.querySelectorAll('.ripple').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const circle = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
});

// Back to Top Button Functionality
const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});
backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
