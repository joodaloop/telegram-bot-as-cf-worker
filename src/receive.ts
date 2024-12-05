import { Env } from ".";
import { handleCallback, handleCommand, handleMessage } from "./handle";
import { Update } from "./types";

export async function telegramBotHandler(req: Request,  env: Env) {
	try {
		
		const update: Update = await req.json();
		const username = update.message?.chat.username

		let auth: false | string[] = false
		
		// uncomment the below line and add your username so only your messages are accepted
		// auth = ['joodaloop']

		if(auth && username && !auth.includes(username)){
			console.error('Please go away, user #' + update.message?.chat.id + ' and username: ' + username);
			return Response.json({ ok: true });
		}



		
		if (update.callback_query) {
			await handleCallback(env.BOT_TOKEN, update.callback_query);
		}
	
		else if (update.message?.text?.startsWith('/')) {
			await handleCommand(env.BOT_TOKEN, update.message);
		}
	
		else if(update.message?.text){
			await handleMessage(env.BOT_TOKEN, update.message, env.CLAUDE_TOKEN, env.D1_BINDING)
		}
	
		return Response.json({ ok: true });
		} catch (error) {
		console.error('Error handling update:', error);
		return Response.json({ ok: true });
	}
  }