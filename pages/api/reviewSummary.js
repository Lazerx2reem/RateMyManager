import axios from "axios";

// Function to handle retries
const fetchWithRetry = async (url, data, retries = 5, delay = 1000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Ensure you provide the correct API key
        },
      });
      return response; // If successful, return the response
    } catch (error) {
      attempt++;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (attempt >= retries) {
        throw new Error("Max retries reached, could not fetch from API.");
      }
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay)); // Exponential backoff
      delay *= 2; // Increase delay for next attempt
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reviews } = req.body;

  if (!reviews || reviews.length === 0) {
    console.log("⚠️ No reviews provided.");
    return res.status(400).json({ error: "No reviews provided" });
  }

  try {
    const formattedReviews = reviews
      .map((r, i) => `- ${r.comment} (Rating: ${r.rating}/5)`)
      .join("\n");

    // Calculate the average rating to include in the prompt for better context
    const averageRating = (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    ).toFixed(2);

    const prompt = `
      Analyze the following manager reviews and provide a one-line summary indicating whether they are mostly positive or mostly negative:
      If the average rating is over 3, the reviews are mostly positive.
      If the average rating is under 3, the reviews are mostly negative.
      
      Average Rating: ${averageRating}

      Reviews:
      ${formattedReviews}

      Expected Response:
      The reviews are mostly positive or mostly negative based on the average rating and overall sentiment.
    `;

    console.log("Sending Prompt to Hugging Face BART:", prompt);

    // Make the API call to Hugging Face (BART model for summarization)
    const response = await fetchWithRetry(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn", // Use the BART model endpoint
      {
        inputs: prompt, // Input text for the model
        parameters: {
          max_length: 100, // Increase max_length for more detailed response
          num_beams: 5, // Increase the number of beams
          no_repeat_ngram_size: 2, // Prevent repetition
        },
      }
    );

    console.log("✅ Full Hugging Face API Response:", response.data); // Log full response for debugging

    // Extract the summary_text directly from the response
    const summaryText = response.data[0]?.summary_text?.trim() || "No summary available.";

    console.log("✅ Extracted Summary:", summaryText);

    // Send the summary back in the response
    res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("❌ Hugging Face API Error:", error);
    res.status(500).json({ error: "Failed to generate review summary" });
  }
}
