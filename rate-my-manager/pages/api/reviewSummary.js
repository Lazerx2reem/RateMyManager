import OpenAI from "openai"; // ✅ Correct OpenAI import

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { reviews } = req.body;

  if (!reviews || reviews.length === 0) {
    console.log("❌ No reviews received in API");
    return res.status(400).json({ error: "No reviews provided" });
  }

  try {
    const openai = new OpenAI({ apiKey: "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" }); // ✅ New OpenAI API call

    const reviewText = reviews.map((r) => `- ${r.comment} (Rating: ${r.rating}/5)`).join("\n");

    console.log(reviewText);

    const prompt = `Analyze the following manager reviews and provide a one-line summary indicating whether they are mostly positive or mostly negative:\n\n${reviewText}`;

    console.log("📢 Sending Prompt to OpenAI:", prompt); // Debugging

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50, 
    });

    console.log("✅ OpenAI API Response:", response); // Debugging

    const summary = response.choices[0]?.message?.content || "No summary available.";

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    return res.status(500).json({ error: "Error generating summary" });
  }
}
