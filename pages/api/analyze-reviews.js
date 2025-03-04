import axios from "axios";

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

    const prompt = `
      Analyze the following manager reviews and provide key insights. Offer recommendations based on feedback and areas needing improvement:

      Reviews:
      ${formattedReviews}

      Provide a structured summary with key observations and suggestions for improvement. Remove all the headings, only write it in a single paragraph manner. 
    `;

    console.log("Sending Prompt to Hugging Face:", prompt);

    // Make the API call to Hugging Face
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli", // Hugging Face API endpoint for the BART model
      {
        inputs: prompt, // Input text for the model
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Your Hugging Face API Key
        },
      }
    );

    console.log("✅ Hugging Face API Response:", response.data);

    // Extract the summary from the model's response
    const summaryText = response.data[0]?.generated_text?.trim() || "No summary available.";
    console.log("✅ Extracted Summary:", summaryText);

    // Send the summary back in the response
    res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("❌ Hugging Face API Error:", error);
    res.status(500).json({ error: "Failed to generate review summary" });
  }
}
