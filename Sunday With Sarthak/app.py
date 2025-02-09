from flask import Flask, jsonify, request
import requests
import json
import os
from datetime import datetime
import openai
from dotenv import load_dotenv
import schedule
import time
from threading import Thread

app = Flask(__name__, static_folder='.')

# Load environment variables
load_dotenv()

# Configure API keys
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
openai.api_key = OPENAI_API_KEY

# Store our data
news_cache = []
memes_cache = []
current_poll = None

def get_indian_news():
    try:
        url = f'https://newsapi.org/v2/top-news?country=in&apiKey={NEWS_API_KEY}'
        response = requests.get(url)
        news = response.json()
        
        funny_news = []
        for article in news.get('articles', [])[:5]:
            # Generate a funny twist for each news headline
            prompt = f"Make this news headline funny in an Indian context: {article['title']}"
            funny_response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}]
            )
            funny_headline = funny_response.choices[0].message.content

            funny_news.append({
                'original': article['title'],
                'funny': funny_headline,
                'url': article['url'],
                'image': article['urlToImage']
            })
        
        global news_cache
        news_cache = funny_news
        return funny_news
    except Exception as e:
        print(f"Error fetching news: {str(e)}")
        return []

def generate_indian_meme():
    try:
        # Get current trending topics in India
        topics_prompt = "List 3 current trending political topics in India"
        topics_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": topics_prompt}]
        )
        topics = topics_response.choices[0].message.content

        # Generate meme text
        meme_prompt = f"Create a funny political meme text about: {topics}. Make it witty and relevant to Indian politics."
        meme_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": meme_prompt}]
        )
        meme_text = meme_response.choices[0].message.content

        # In a real implementation, you would use DALL-E or similar to generate the meme image
        # For now, we'll just return the text
        global memes_cache
        memes_cache.append({
            'text': meme_text,
            'topic': topics,
            'timestamp': datetime.now().isoformat()
        })
        
        # Keep only latest 10 memes
        memes_cache = memes_cache[-10:]
        
    except Exception as e:
        print(f"Error generating meme: {str(e)}")

def check_and_create_poll():
    try:
        # Get information about upcoming elections
        election_prompt = "What's the next major election (state or central) in India? Format: State/Central, Month Year"
        election_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": election_prompt}]
        )
        election_info = election_response.choices[0].message.content

        # If there's an upcoming election, create a poll
        if election_info:
            poll_prompt = f"Create a poll question about {election_info} with two options"
            poll_response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": poll_prompt}]
            )
            poll_content = poll_response.choices[0].message.content

            global current_poll
            current_poll = {
                'question': poll_content.split('\n')[0],
                'options': poll_content.split('\n')[1:3],
                'votes': [0, 0],
                'election_info': election_info
            }

    except Exception as e:
        print(f"Error creating poll: {str(e)}")

# API endpoints
@app.route('/api/news')
def get_news():
    return jsonify(news_cache)

@app.route('/api/memes')
def get_memes():
    return jsonify(memes_cache)

@app.route('/api/poll')
def get_poll():
    return jsonify(current_poll if current_poll else {'error': 'No active poll'})

@app.route('/api/vote', methods=['POST'])
def submit_vote():
    data = request.json
    if current_poll and 'option' in data:
        option = int(data['option'])
        if 0 <= option <= 1:
            current_poll['votes'][option] += 1
            return jsonify({'success': True})
    return jsonify({'error': 'Invalid vote'}), 400

def update_content():
    while True:
        schedule.run_pending()
        time.sleep(1)

def init_scheduler():
    # Update news every 3 hours
    schedule.every(3).hours.do(get_indian_news)
    
    # Generate new memes every 6 hours
    schedule.every(6).hours.do(generate_indian_meme)
    
    # Check for new polls daily
    schedule.every().day.at("00:00").do(check_and_create_poll)
    
    # Start with initial content
    get_indian_news()
    generate_indian_meme()
    check_and_create_poll()
    
    # Start the scheduler in a separate thread
    scheduler_thread = Thread(target=update_content)
    scheduler_thread.daemon = True
    scheduler_thread.start()

if __name__ == '__main__':
    init_scheduler()
    app.run(debug=True, port=5000)
