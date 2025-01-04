import type { Character, IAgentRuntime } from "@ai16z/eliza";

import { AutoClientInterface } from "@ai16z/client-auto";
import { DiscordClientInterface } from "@ai16z/client-discord";
import { TelegramClientInterface } from "@ai16z/client-telegram";
import { TwitterClientInterface } from "@ai16z/client-twitter";

/**
 * Initializes client interfaces for a character based on its configuration
 */
export async function initializeClients(
  character: Character,
  runtime: IAgentRuntime,
) {
  const clients = [];
  // Convert client types to lowercase for case-insensitive comparison
  const clientTypes = character.clients?.map((str) => str.toLowerCase()) || [];

  // Initialize Auto client if specified
  if (clientTypes.includes("auto")) {
    const autoClient = await AutoClientInterface.start(runtime);
    if (autoClient) clients.push(autoClient);
  }

  // Initialize Discord client if specified
  if (clientTypes.includes("discord")) {
    clients.push(await DiscordClientInterface.start(runtime));
  }

  // Initialize Telegram client if specified
  if (clientTypes.includes("telegram")) {
    const telegramClient = await TelegramClientInterface.start(runtime);
    if (telegramClient) clients.push(telegramClient);
  }

  // Initialize Twitter client if specified
  if (clientTypes.includes("twitter")) {
    const twitterClients = await TwitterClientInterface.start(runtime);
    clients.push(twitterClients);
  }

  // Initialize clients from plugins if any
  if (character.plugins?.length > 0) {
    for (const plugin of character.plugins) {
      if (plugin.clients) {
        for (const client of plugin.clients) {
          clients.push(await client.start(runtime));
        }
      }
    }
  }

  return clients;
}
