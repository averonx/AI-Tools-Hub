// Your NewsAPI key
const API_KEY = 'b9109af05a834803ae6a8945d4cc894d';

// Fetch 15 top headlines (you can change the country or category as desired)
const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=15&apiKey=${API_KEY}`;

const newsContainer = document.getElementById('newsContainer');
const memeContainer = document.getElementById('memeContainer');

// A few funny punchlines to add a humorous twist
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

// Function to add a random funny punchline to a headline
function makeHeadlineFunny(headline) {
  const randomIndex = Math.floor(Math.random() * punchlines.length);
  return headline + punchlines[randomIndex];
}

// Fetch the news articles
fetch(newsUrl)
  .then(response => response.json())
  .then(data => {
    const articles = data.articles || [];
    
    // For each article, create a news card and a meme card
    articles.forEach(article => {
      // Make the headline funny
      const funnyHeadline = makeHeadlineFunny(article.title || "Untitled News");

      // ----- Create News Card -----
      const newsCard = document.createElement('div');
      newsCard.className = 'card';
      
      // Image if available
      const imgSrc = article.urlToImage ? article.urlToImage : 'https://via.placeholder.com/300x180?text=No+Image';
      const img = document.createElement('img');
      img.src = imgSrc;
      newsCard.appendChild(img);
      
      // Card content
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
      
      // ----- Create Meme Card -----
      const memeCard = document.createElement('div');
      memeCard.className = 'card';
      
      // Use a static meme background image (you can replace the URL with a better meme template)
      const memeImg = document.createElement('img');
      memeImg.src = 'https://via.placeholder.com/300x180/000000/ffffff?text=Meme+Time';
      memeCard.appendChild(memeImg);
      
      // Overlay funny headline text on the meme image
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
      
      // Wrap the meme card in a container to allow for position:relative
      const memeCardWrapper = document.createElement('div');
      memeCardWrapper.className = 'card';
      memeCardWrapper.style.position = 'relative';
      memeCardWrapper.style.width = '300px';
      memeCardWrapper.style.height = 'auto';
      
      memeCardWrapper.appendChild(memeImg);
      memeCardWrapper.appendChild(memeOverlay);
      memeContainer.appendChild(memeCardWrapper);
    });
  })
  .catch(error => console.error("Error fetching news:", error));

// Day/Night Toggle Functionality (from previous code)
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
