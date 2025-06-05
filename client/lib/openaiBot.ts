export async function openaiBot(message: string): Promise<string> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", // or your preferred Groq model
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Groq API error:", error);
      return "Something went wrong with the Groq bot.";
    }

    const data = await res.json();

    // Extract GPT-like reply text
    const reply = data.choices?.[0]?.message?.content;
    return reply || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Something went wrong with the Groq bot.";
  }
}
