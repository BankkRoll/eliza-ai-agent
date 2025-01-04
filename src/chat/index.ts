import readline from "readline";
import { settings } from "@ai16z/eliza";

// Create a readline interface for user input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Handle SIGINT (Ctrl+C) to gracefully exit the program
rl.on("SIGINT", () => {
  rl.close();
  process.exit(0);
});

/**
 * Handles user input, sends it to the agent, and displays the response
 */
async function handleUserInput(input: string, agentId: string) {
  // Check if user wants to exit
  if (input.toLowerCase() === "exit") {
    rl.close();
    process.exit(0);
  }

  try {
    // Get the server port from settings or use default 3000
    const serverPort = parseInt(settings.SERVER_PORT || "3000");

    // Send user input to the agent
    const response = await fetch(
      `http://localhost:${serverPort}/${agentId}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          userId: "user",
          userName: "User",
        }),
      },
    );

    // Parse and display the agent's response
    const data = await response.json();
    data.forEach((message) => console.log(`${"Agent"}: ${message.text}`));
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

/**
 * Starts the chat interface
 */
export function startChat(characters: any[]) {
  function chat() {
    // Use the first character's name as the agent ID, or default to "Agent"
    const agentId = characters[0].name ?? "Agent";
    rl.question("You: ", async (input) => {
      await handleUserInput(input, agentId);
      if (input.toLowerCase() !== "exit") {
        chat(); // Loop back to ask another question
      }
    });
  }

  return chat;
}
