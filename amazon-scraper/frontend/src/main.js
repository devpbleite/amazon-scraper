import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const keywordInput = document.getElementById("keyword");
  const scrapeButton = document.getElementById("scrape-btn");
  const loadingSpinner = document.getElementById("loading");
  const resultsContainer = document.getElementById("results");
  const errorMessage = document.getElementById("error-message");

  // API endpoint
  const API_URL = "http://localhost:3000/api/scrape";

  // Function to render stars based on rating
  const renderStars = (rating) => {
    if (!rating) return "☆☆☆☆☆";

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars)
    );
  };

  // Function to format the number of reviews
  const formatReviewCount = (count) => {
    if (!count) return "No reviews";

    if (count > 1000) {
      return `${(count / 1000).toFixed(1)}k reviews`;
    }

    return `${count} reviews`;
  };

  // Function to display the products
  const displayProducts = (products) => {
    resultsContainer.innerHTML = "";

    if (products.length === 0) {
      resultsContainer.innerHTML =
        '<div class="no-results">No products found. Try a different keyword.</div>';
      return;
    }

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
        <img src="${product.imageUrl}" alt="${
        product.title
      }" class="product-image">
        <div class="product-info">
          <div class="product-title">${product.title}</div>
          <div class="product-rating">
            <span class="stars">${renderStars(product.rating)}</span>
            <span class="review-count">${formatReviewCount(
              product.reviewCount
            )}</span>
          </div>
        </div>
      `;

      resultsContainer.appendChild(productCard);
    });
  };

  // Function to handle the scraping process
  const scrapeAmazon = async () => {
    const keyword = keywordInput.value.trim();

    if (!keyword) {
      errorMessage.textContent = "Please enter a keyword";
      errorMessage.style.display = "block";
      return;
    }

    try {
      // Show loading spinner
      loadingSpinner.style.display = "flex";
      errorMessage.style.display = "none";
      resultsContainer.innerHTML = "";

      // Make API request
      const response = await fetch(
        `${API_URL}?keyword=${encodeURIComponent(keyword)}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Hide loading spinner
      loadingSpinner.style.display = "none";

      // Display results
      displayProducts(data.products);
    } catch (error) {
      // Hide loading spinner
      loadingSpinner.style.display = "none";

      // Show error message
      errorMessage.textContent = `Failed to scrape Amazon: ${error.message}`;
      errorMessage.style.display = "block";

      console.error("Error scraping Amazon:", error);
    }
  };

  // Add event listeners
  scrapeButton.addEventListener("click", scrapeAmazon);

  keywordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      scrapeAmazon();
    }
  });
});
