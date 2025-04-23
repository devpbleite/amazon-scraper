import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import cors from "cors";

const app = express();
const PORT = 3000;

// Enable CORS to allow requests from frontend
app.use(cors());

// Create API endpoint for scraping
app.get("/api/scrape", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword parameter is required" });
    }

    console.log(`Scraping Amazon for keyword: ${keyword}`);

    // Format the keyword for URL
    const formattedKeyword = encodeURIComponent(keyword);
    const url = `https://www.amazon.com/s?k=${formattedKeyword}`;

    // Set headers to mimic a real browser
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    };

    // Fetch the Amazon search results page
    const response = await axios.get(url, { headers });
    const html = response.data;

    // Parse HTML with JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract product listings
    const productElements = document.querySelectorAll(
      'div[data-component-type="s-search-result"]'
    );
    const products = [];

    productElements.forEach((element) => {
      try {
        // Extract product title
        const titleElement = element.querySelector("h2");
        const title = titleElement
          ? titleElement.textContent.trim()
          : "Title not found";

        // Extract rating
        const ratingElement = element.querySelector("span.a-icon-alt");
        const ratingText = ratingElement ? ratingElement.textContent : "";
        const ratingMatch = ratingText.match(/\d+(\.\d+)?/);
        const rating = ratingMatch ? parseFloat(ratingMatch[0]) : null;

        // Extract number of reviews
        const reviewCountElement = element.querySelector("span.a-size-base");
        const reviewCountText = reviewCountElement
          ? reviewCountElement.textContent.trim()
          : "";
        const reviewCount = reviewCountText.replace(/[^0-9]/g, "") || null;

        // Extract product image URL
        const imageElement = element.querySelector("img.s-image");
        const imageUrl = imageElement ? imageElement.getAttribute("src") : null;

        // Add product to list if we have at least a title and image
        if (title !== "Title not found" && imageUrl) {
          products.push({
            title,
            rating,
            reviewCount,
            imageUrl,
          });
        }
      } catch (error) {
        console.error("Error parsing product:", error);
      }
    });

    console.log(`Found ${products.length} products`);

    // Return the results
    res.json({
      keyword,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    res
      .status(500)
      .json({ error: "Failed to scrape Amazon", message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
