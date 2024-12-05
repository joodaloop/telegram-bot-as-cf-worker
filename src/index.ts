import { telegramBotHandler } from './receive';

export interface Env {
	D1_BINDING?: D1Database;
	BOT_TOKEN: string;
	CLAUDE_TOKEN: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {

		console.log('DB binding:', !!env.D1_BINDING)

		// Handle only POST requests to /telegram
		if (request.method === 'POST' && new URL(request.url).pathname === '/telegram') {
			
			const result = await telegramBotHandler(request, {
				BOT_TOKEN: env.BOT_TOKEN,
				CLAUDE_TOKEN: env.CLAUDE_TOKEN,
				D1_BINDING: env.D1_BINDING
			});
			
			return result;
		}
	
		// Return 404 for all other routes
		return new Response('Not Found', { status: 404 });
	}
};
