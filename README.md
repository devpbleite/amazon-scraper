# Amazon Product Scraper

A simple web application to scrape Amazon product listings from the first page of search results for a given keyword.

## Features

- Backend API built with Bun, Express, Axios, and JSDOM
- Frontend built with HTML, CSS, and Vanilla JavaScript using Vite
- Scrapes product titles, ratings, review counts, and images
- Clean and user-friendly interface

## Setup and Running Instructions

### Prerequisites

- Bun (latest version)
- Node.js and npm (for frontend)

### Backend Setup

1. Clone this repository
2. Navigate to the backend directory:
   ```
   cd amazon-scraper
   ```
3. Install dependencies:
   ```
   bun install
   ```
4. Start the server:
   ```
   bun start
   ```
   
   For development with auto-reload:
   ```
   bun dev
   ```
   
The backend server will run at: `http://localhost:3000`

### Frontend Setup

1. Open a new terminal
2. Navigate to the frontend directory:
   ```
   cd amazon-scraper-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at the URL shown in your terminal (typically `http://localhost:5173`)

## Usage

1. Open the frontend in your browser
2. Enter a search keyword in the input field
3. Click the "Search" button or press Enter
4. Wait for the results to load
5. Browse through the scraped product listings

## Notes

- Amazon's website structure may change over time, which could break the scraper
- This application is for educational purposes only
- Be aware that Amazon might block requests if too many are made in a short period
- Consider implementing rate limiting and proxy rotation for production use

## Project Structure

```
amazon-scraper/backend
├── index.js         # Backend server and scraping logic
├── package.json     # Backend dependencies
└── README.md        # This file

amazon-scraper/frontend
├── index.html       # Main HTML page
├── style.css        # Styles
├── main.js          # Frontend logic
└── package.json     # Frontend dependencies
```

## Possible Improvements

- Add pagination to scrape more results
- Implement caching to reduce load on Amazon's servers
- Add more detailed product information
- Improve error handling and user feedback
- Add filters for sorting and filtering results
