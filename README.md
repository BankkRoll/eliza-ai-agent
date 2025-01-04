# Eliza AI Agent

Eliza is an AI agent capable of interacting through various platforms. This README will guide you through the setup and customization process.

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BankkRoll/eliza-ai-agent.git
   cd eliza-ai-agent
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Configuration

### Character Customization

1. Open `agent/src/character.ts` to modify the default character.
2. Uncomment and edit the desired traits and behaviors.

#### Custom Characters

To use custom character files:

- Use the following command:
  ```bash
  pnpm start --characters="path/to/your/character.json"
  ```
- You can load multiple character files simultaneously by separating paths with commas.

### Environment Variables

1. Create a `.env` file by duplicating the template:
   ```bash
   cp .env.example .env
   ```

2. Fill out the `.env` file with your own values. Here are some key variables to set:

   ```env
   # Discord Configuration
   DISCORD_APPLICATION_ID="000000772361146438"
   DISCORD_API_TOKEN="OTk1MTU1NzcyMzYxMT000000.000000.00000000000000000000000000000000"

   # OpenRouter Configuration
   OPENROUTER_API_KEY="sk-xx-xx-xxx"

   # Twitter Configuration
   TWITTER_USERNAME="your_username"
   TWITTER_PASSWORD="your_password"
   TWITTER_EMAIL="your@email.com"
   ```

   Add any other required API keys or configuration variables as needed.

## Running the Agent

To start your Eliza AI agent:

```bash
pnpm start
```

## Advanced Usage

### Adding Clients

To enable additional client interfaces, modify the `clients` array in your character configuration:

```diff
- clients: [],
+ clients: ["twitter", "discord"],
```

This example adds Twitter and Discord interfaces to your agent.

## Troubleshooting

If you encounter any issues:

1. Ensure all environment variables are correctly set.
2. Check that you have the latest version of Node.js and pnpm.
3. Verify that all dependencies are installed correctly.

For more help, please open an issue on the GitHub repository.