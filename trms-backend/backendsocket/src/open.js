// import OpenAI from "openai";
const OpenAI  = require('openai')
// Initialize the OpenAI instance with your API key
const openai = new OpenAI({
  apiKey: "sk-proj-DqrX7c6DbdvkrMePf57xT3BlbkFJXmyCSqmXjAnkQIWA9WCz",
  dangerouslyAllowBrowser: true
});

// Function to fetch summary from OpenAI
async function getSummary(prompt) {
    console.log("Hii")
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo", // Adjust the model name as per your requirement
    });

    // Log or return the completion text
    console.log(response.choices[0].message.content); // Example: Log the content of the first choice

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching summary from OpenAI:', error);
    throw error;
  }
}

// Example usage (you can uncomment main() function call if needed)
async function main() {
  const prompt = "what is two plus two";
  await getSummary(prompt);
}

main()

// Export the function to use it in other parts of your application
// export { getSummary };
