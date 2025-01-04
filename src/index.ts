import type { DirectClient } from "@ai16z/client-direct";
import { DirectClientInterface } from "@ai16z/client-direct";
import {
  AgentRuntime,
  elizaLogger,
  stringToUuid,
  type Character,
} from "@ai16z/eliza";
import { bootstrapPlugin } from "@ai16z/plugin-bootstrap";
import { nodePlugin } from "@ai16z/plugin-node";
import { solanaPlugin } from "@ai16z/plugin-solana";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { intializeDbCache } from "./cache/index.js";
import { character } from "./character.js";
import { startChat } from "./chat/index.js";
import { initializeClients } from "./clients/index.js";
import {
  getTokenForProvider,
  loadCharacters,
  parseArguments,
} from "./config/index.js";
import { initializeDatabase } from "./database/index.js";

// Get the current file name and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Waits for a random amount of time between minTime and maxTime
 */
export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

/**
 * Creates an agent runtime for a given character
 */
export function createAgent(
  character: Character,
  db: any,
  cache: any,
  token: string,
) {
  // Log the creation of the runtime
  elizaLogger.success(
    elizaLogger.successesTitle,
    "Creating runtime for character",
    character.name,
  );

  // Create and return the AgentRuntime
  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [
      bootstrapPlugin,
      nodePlugin,
      // Only include solanaPlugin if WALLET_PUBLIC_KEY is set
      character.settings?.secrets?.WALLET_PUBLIC_KEY ? solanaPlugin : null,
    ].filter(Boolean), // Remove null values from the plugins array
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager: cache,
  });
}

/**
 * Starts an agent for a given character
 */
async function startAgent(character: Character, directClient: DirectClient) {
  try {
    // Set character ID and username if not already set
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;

    // Get the token for the character's model provider
    const token = getTokenForProvider(character.modelProvider, character);

    // Set up the data directory
    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize the database
    const db = initializeDatabase(dataDir);
    await db.init();

    // Initialize the cache
    const cache = intializeDbCache(character, db);

    // Create the agent runtime
    const runtime = createAgent(character, db, cache, token);

    // Initialize the runtime
    await runtime.initialize();

    // Initialize the clients
    const clients = await initializeClients(character, runtime);

    // Register the agent with the direct client
    directClient.registerAgent(runtime);

    return clients;
  } catch (error) {
    // Log any errors that occur during agent startup
    elizaLogger.error(
      `Error starting agent for character ${character.name}:`,
      error,
    );
    console.error(error);
    throw error;
  }
}

/**
 * Starts all agents based on the provided arguments
 */
const startAgents = async () => {
  // Start the direct client interface
  const directClient = await DirectClientInterface.start();

  // Parse command line arguments
  const args = parseArguments();

  // Get the characters argument
  let charactersArg = args.characters || args.character;

  // Initialize characters array with default character
  let characters = [character];
  console.log("charactersArg", charactersArg);

  // Load characters if specified in arguments
  if (charactersArg) {
    characters = await loadCharacters(charactersArg);
  }
  console.log("characters", characters);

  try {
    // Start an agent for each character
    for (const character of characters) {
      await startAgent(character, directClient as DirectClient);
    }
  } catch (error) {
    elizaLogger.error("Error starting agents:", error);
  }

  // Log that the chat has started
  elizaLogger.log("Chat started. Type 'exit' to quit.");

  // Start the chat
  const chat = startChat(characters);
  chat();
};

// Start the agents and handle any unhandled errors
startAgents().catch((error) => {
  elizaLogger.error("Unhandled error in startAgents:", error);
  process.exit(1);
});