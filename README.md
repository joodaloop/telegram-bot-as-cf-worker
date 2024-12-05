# Telegram bot on Cloudflare Workers (as LLM chat interface)

Minimal starter code to create a Telegram bot to talk to Claude. 

If you have trouble getting this to work, reach out to me on Twitter (@joodalooped) or Bluesky (@joodaloop.bsky.social) or open an issue.

Over time, I hope to add more examples of Telegram bot features, as well as integrations with other Cloudflare products (R2, Vectorize, etc.).



## things you need

1. A Telegram account (to get a bot token)
	- Visit the @BotFather and follow [these steps](https://core.telegram.org/bots/tutorial) to get a token

2. An Anthropic account (to use the Claude API)
	- Log in, add credits, create an API key etc. from https://console.anthropic.com/

3. A Cloudflare account (to host the bot)
	- Clone this repo
	- Go to the Clouldflare dashboard => Workers & Pages => Create => Workers => Create the "Hello World" worker
	- Go to the Settings for the Worker => Build => Connect your Github repository
	- Then set your API keys: Settings => Variables & Secrets => Add secrets (type: secret) for the following tokens:
		- BOT_TOKEN = your_telegram_bot_token
		- CLAUDE_TOKEN = your_claude_token

4. A terminal of some kind
	- To connect the bot to the worker, you'll need to run the following commend from any command line:
	```bash
	curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" -H "Content-Type: application/json" -d '{"url":"<YOUR_WORKER_URL>/telegram","allowed_updates":["message","callback_query"]}'```




## Addtional details

### Context window

With this setup, the bot will only reply to your latest message, it has no context on the rest of the conversation. To extend the context window, we can use a D1 database to store the message content. 

The steps to do that are non-trivial.

You will need to run the project locally, I will add complete instructions later but for now just now that you have to set up a local copy of your repository (and npm install everything) and then:
1. Create a D1 database in your CF dashboard: Workers & Pages => D1 SQL Database => Create
2. Uncomment the [[d1_databases]] section in the wrangler.toml of this repo, and fill in your `database_name` and `database_id` from the newly-created database
3. Fill in your config details in drizzle.config.ts (make sure you don't commit these to your repo though!)
4. run `drizzle-kit generate` followed by `drizzle-kit migrate`
5. If that works, you can redeploy the project and it *should* start saving your messages.

### Auth

In the [receive.ts](/src/receive.ts) file, change the username in the "auth" array to be your Telegram username, then only you can send messages to the bot. (You can also add multiple username so your friends can use it too)

This isn't *super* important, because when you create a bot, nobody else knows it exists unless they know the bot's username.