export async function sendMessage(token: string, chat_id: number, text: string, options = {}) {
	await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id,
			text,
			...options
		}),
	});
}

  
export async function answerCallbackQuery(token: string, callback_query_id: string) {
	await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ callback_query_id }),
	});
}

  
export async function sendTyping(token: string, chat_id: number | string) {
	await fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id,
			action: 'typing'
		})
	});
}
  