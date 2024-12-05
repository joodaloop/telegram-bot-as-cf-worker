import { desc, eq } from "drizzle-orm";
import { createDb, DrizzleD1 } from ".";
import { messages } from "./schema";
import { Message } from "../types";

export async function getLastNMessages(chat_id: number, n: number, db_binding: D1Database){
	
	const db = createDb(db_binding)

	const context = await db
		.select({
			text: messages.text,
			username: messages.username
		})
		.from(messages)
		.where(eq(messages.chat_id, chat_id))
		.orderBy(desc(messages.timestamp))
		.limit(n)
	
	return context
}


export async function storeMessage(message: Message, db_binding: D1Database) {

	const db = createDb(db_binding)

	const { 
	  from,
	  chat,
	  text
	} = message;
  
	if (!text) return;
	if (!from?.id) return
  
	try {
	  await db.insert(messages).values(
		{
			user_id: from.id,
			username: from?.username || null,
			chat_id: chat.id,
			text: text
		}
	  )
	} catch (error) {
	  console.error('Error storing message:', error);
	  throw error;
	}
  }