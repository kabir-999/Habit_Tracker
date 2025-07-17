import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, profile } = req.body;
  if (!message || !profile) {
    return res.status(400).json({ error: "Missing message or profile" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const prompt = `
You are a friendly habit coach AI. The user profile is:
Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Profession: ${profile.profession}
Goal: ${profile.goal}

User says: "${message}"

Respond in a helpful, personalized way.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "AI error", details: err.message });
  }
} 