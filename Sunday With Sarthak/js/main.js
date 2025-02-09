document.addEventListener('DOMContentLoaded', () => {
    // Theme Switching
    const themeSwitch = document.querySelector('.theme-switch');
    let isDarkMode = false;

    themeSwitch.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        themeSwitch.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Load content when tab is clicked
            if (tabId === 'news') loadNews();
            if (tabId === 'memes') loadMemes();
            if (tabId === 'polls') loadPoll();
        });
    });

    // Fetch and display news
    async function loadNews() {
        try {
            const response = await fetch('http://localhost:5000/api/news');
            const newsData = await response.json();
            
            const newsContainer = document.querySelector('.news-container');
            newsContainer.innerHTML = '';
            
            newsData.forEach(news => {
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';
                newsCard.innerHTML = `
                    <div class="news-image">
                        <img src="${news.image || 'images/default-news.jpg'}" alt="News Image">
                    </div>
                    <div class="news-content">
                        <h3>Original: ${news.original}</h3>
                        <p class="funny-twist">😄 Funny Twist: ${news.funny}</p>
                        <a href="${news.url}" target="_blank" class="read-more">Read Full Story 📰</a>
                    </div>
                `;
                newsContainer.appendChild(newsCard);
            });
        } catch (error) {
            console.error('Error loading news:', error);
        }
    }

    // Fetch and display memes
    async function loadMemes() {
        try {
            const response = await fetch('http://localhost:5000/api/memes');
            const memesData = await response.json();
            
            const memeCarousel = document.querySelector('.meme-carousel');
            memeCarousel.innerHTML = '';
            
            memesData.forEach((meme, index) => {
                const memeSlide = document.createElement('div');
                memeSlide.className = 'meme-slide' + (index === 0 ? ' active' : '');
                memeSlide.innerHTML = `
                    <div class="meme-content">
                        <h3>${meme.topic}</h3>
                        <p class="meme-text">${meme.text}</p>
                        <small>Generated on: ${new Date(meme.timestamp).toLocaleString()}</small>
                    </div>
                `;
                memeCarousel.appendChild(memeSlide);
            });

            // Add navigation buttons if there are multiple memes
            if (memesData.length > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'carousel-btn prev';
                prevBtn.innerHTML = '❮';
                
                const nextBtn = document.createElement('button');
                nextBtn.className = 'carousel-btn next';
                nextBtn.innerHTML = '❯';
                
                memeCarousel.appendChild(prevBtn);
                memeCarousel.appendChild(nextBtn);
                
                setupCarouselNavigation();
            }
        } catch (error) {
            console.error('Error loading memes:', error);
        }
    }

    // Fetch and display poll
    async function loadPoll() {
        try {
            const response = await fetch('http://localhost:5000/api/poll');
            const pollData = await response.json();
            
            if (pollData.error) {
                document.querySelector('.poll-container').innerHTML = '<p>No active polls at the moment</p>';
                return;
            }
            
            const totalVotes = pollData.votes.reduce((a, b) => a + b, 0);
            const percentages = pollData.votes.map(votes => 
                totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
            );
            
            const pollContainer = document.querySelector('.poll-container');
            pollContainer.innerHTML = `
                <div class="poll-question">
                    <h3>${pollData.question}</h3>
                    <p class="election-info">📅 ${pollData.election_info}</p>
                    <div class="candidates">
                        ${pollData.options.map((option, index) => `
                            <div class="candidate">
                                <div class="option-text">${option}</div>
                                <button class="vote-btn" data-option="${index}" ${localStorage.getItem('voted') ? 'disabled' : ''}>
                                    Vote 🗳️
                                </button>
                                <div class="vote-percentage" style="width: ${percentages[index]}%">
                                    ${percentages[index]}%
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Add vote event listeners
            if (!localStorage.getItem('voted')) {
                document.querySelectorAll('.vote-btn').forEach(button => {
                    button.addEventListener('click', async () => {
                        const option = button.getAttribute('data-option');
                        try {
                            const response = await fetch('http://localhost:5000/api/vote', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ option: parseInt(option) })
                            });
                            
                            if (response.ok) {
                                localStorage.setItem('voted', 'true');
                                loadPoll(); // Refresh poll display
                            }
                        } catch (error) {
                            console.error('Error submitting vote:', error);
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error loading poll:', error);
        }
    }

    function setupCarouselNavigation() {
        const carousel = document.querySelector('.meme-carousel');
        const slides = carousel.querySelectorAll('.meme-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }

    // Load initial content
    loadNews();
    
    // Refresh content periodically
    setInterval(loadNews, 1800000); // Refresh news every 30 minutes
    setInterval(loadMemes, 3600000); // Refresh memes every hour
    setInterval(loadPoll, 3600000); // Refresh poll every hour

    // Initialize with the first tab active
    document.querySelector('.tab-btn').click();
});
