import OpenAI from 'openai';
import { getFirestore } from 'firebase-admin/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const db = getFirestore();

const SYSTEM_PROMPT = `You are CodeFlux AI, an expert web developer AI assistant. Your role is to generate clean, modern, and functional code based on user requests.

IMPORTANT GUIDELINES:
- Always respond with BOTH a helpful message AND executable code
- For web projects, generate HTML, CSS, and JavaScript files
- Use modern, best practices and responsive design
- Include comments in the code for clarity
- Make the UI visually appealing with modern CSS
- Ensure code is production-ready and secure

RESPONSE FORMAT:
Return a JSON object with:
{
  "message": "Helpful explanation of what you created",
  "code": {
    "index.html": "...",
    "styles.css": "...",
    "script.js": "..."
  },
  "language": "html/css/js" | "python" | "node" | "react"
}

Be creative and provide value in your implementations!`;

export async function generateCode(userMessage, userId, projectId = null) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0].message.content;
    
    // Parse JSON response from AI
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      // Fallback if AI doesn't return proper JSON
      parsedResponse = {
        message: response,
        code: {
          'index.html': `<!DOCTYPE html><html><body><h1>Generated Code</h1><p>${response}</p></body></html>`
        },
        language: 'html/css/js'
      };
    }

    // Save to Firestore
    const projectRef = projectId 
      ? db.collection('projects').doc(projectId)
      : db.collection('projects').doc();

    await projectRef.set({
      userId,
      title: userMessage.substring(0, 50) + '...',
      messages: [
        { role: 'user', content: userMessage, timestamp: new Date() },
        { role: 'assistant', content: parsedResponse.message, timestamp: new Date() }
      ],
      generatedCode: parsedResponse.code,
      language: parsedResponse.language,
      updatedAt: new Date(),
      createdAt: projectId ? undefined : new Date()
    }, { merge: true });

    return {
      ...parsedResponse,
      projectId: projectRef.id
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to generate code: ' + error.message);
  }
}
