import axios from "axios"; // ✅ Correct Hugging Face import

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { reviews } = req.body;

  if (!reviews || reviews.length === 0) {
    return res.status(400).json({ error: "No reviews provided" });
  }

  // ✅ Debugging step
  console.log("Hugging Face API Key:", process.env.HUGGINGFACE_API_KEY ? "Key Exists" : "Key MISSING");

  try {
    const reviewText = reviews.map((r) => `- ${r.comment} (Rating: ${r.rating}/5)`).join("\n");

    const prompt = `Analyze the following manager reviews and provide a one-line summary indicating whether they are mostly positive or mostly negative:\n\n${reviewText}`;

    // Make the API call to Hugging Face
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli", // facebook/bart-large-mnli model
      {
        inputs: prompt, // Input text for the model
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Your Hugging Face API Key
        },
      }
    );

    // Get the model's response and extract the summary
    const summary = response.data[0]?.generated_text || "No summary available.";

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    return res.status(500).json({ error: "Error generating summary" });
  }
}
