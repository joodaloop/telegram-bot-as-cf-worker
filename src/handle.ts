import { getLastNMessages, storeMessage } from "./db/functions";
import { DrizzleD1 } from "./db";
import { answerCallbackQuery, sendMessage, sendTyping } from "./send";
import { AnthropicReply, CallbackQuery, ContextItem, Message, Update } from "./types";

export async function handleMessage(token: string, message: Message, claude_token: string, db?: D1Database){

	const chat_id = message.chat.id;

	if(!message.text) return

	await sendTyping(token, chat_id);

	const typingInterval = setInterval(async () => {
		await sendTyping(token, chat_id);
	}, 4000);

	let context: ContextItem[] = [{role: 'user', content: message.text}]

	// if the database is bound, save the received message
	if(db){
		const recent6 = await getLastNMessages(chat_id, 6, db)
		context = recent6.reverse().map(a => 
			(
				{role: a.username == 'bot' ? 'assistant' : 'user', content: a.text}
			))
		await storeMessage(message, db)
	}

	try{
		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'x-api-key': claude_token,
			'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: "claude-3-5-sonnet-20241022",
				system: `You are a thoughtful, collaborative intellectual partner. Your role is to engage in constructive dialogue, help refine ideas, spot blindspots, and think things through together with me. Ask clarifying questions, but only when needed. Avoid writing code unless specifically asked for.`,
				max_tokens: 1024,
				temperature: 0.7,
				messages: context
			})
		});
		
		const data: AnthropicReply = await response.json();

		if(data && data.content[0].text){
			clearInterval(typingInterval);
			await sendMessage(token, chat_id, data.content[0].text);

			// if the database is bound, save the sent message
			if(db) await storeMessage({...message, from: {...message.from, id: 0, username: 'bot'}}, db)
		}

		else{
			throw new Error('No text returned from LLM!')
		}

		
	}

	 catch (error: unknown) {
		clearInterval(typingInterval);
		sendMessage(token, chat_id, "Something went wrong: " + error)
		throw error;
	  }
}



export async function handleCommand(token: string, message: Message) {
	const command = message.text!.split(' ')[0].substring(1);
	const chat_id = message.chat.id;
  
	switch (command) {
	  case 'start':
		await sendMessage(token, chat_id, 'Welcome! 👋\n What would you like to talk about?');
		break;
  
	  case 'help':
		await sendMessage(token, chat_id, 
		  'Available commands:\n' +
		  '/start - Start the bot\n' +
		  '/help - Show this help message'
		);
		break;
  
	  default:
		await sendMessage(token, chat_id, 'Unknown command');
		break;
	}
}


export async function handleCallback(token: string, query: CallbackQuery) {
	
	switch (query.data) {
	  case 'hello':
		await sendMessage(token, query.message!.chat.id, 'You can start using me as a chatbot!');
		break;
	}
	
	// Always answer callback query to remove loading state
	await answerCallbackQuery(token, query.id);
  }