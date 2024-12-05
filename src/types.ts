
// See https://docs.anthropic.com/en/api/messages
export type AnthropicReply = {
	id: string,
	type: "message",
	role: "assistant",
	content: { type: "text", text: string }[],
	model: string,
	stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use",
	stop_sequence: null,
	usage: {
	  input_tokens: number,
	  output_tokens: number
	}
}

export type ContextItem = {
	role: "user" | "assistant",
	content: string
}


type ParseMode = "Markdown" | "MarkdownV2" | "HTML";

export interface Update {
    update_id: number;
    message?: Message;
    edited_message?: Message;
    callback_query?: CallbackQuery;
}

export interface Message {
    message_id: number;
    from: User;
    chat: Chat;
    date: number;
    text?: string;
    photo?: PhotoSize[];
    document?: Document;
    caption?: string;
}

export interface User {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

export interface Chat {
    id: number;
    type: 'private' | 'group' | 'supergroup' | 'channel';
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
}

export interface CallbackQuery {
    id: string;
    from: User;
    message?: Message;
    inline_message_id?: string;
    data?: string;
}

export interface PhotoSize {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    file_size?: number;
}

export interface Document {
    file_id: string;
    file_unique_id: string;
    thumb?: PhotoSize;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
}

export interface SendBasicOptions {
	message_thread_id?: number | undefined;
	disable_notification?: boolean | undefined;
	reply_to_message_id?: number | undefined;
	reply_markup?: InlineKeyboardMarkup | undefined;
	protect_content?: boolean | undefined;
	allow_sending_without_reply?: boolean | undefined;
}

export interface SendMessageOptions extends SendBasicOptions {
	parse_mode?: ParseMode | undefined;
	disable_web_page_preview?: boolean | undefined;
	entities?: MessageEntity[] | undefined;
}

type MessageEntityType =
        | "mention"
        | "hashtag"
        | "cashtag"
        | "bot_command"
        | "url"
        | "email"
        | "phone_number"
        | "bold"
        | "italic"
        | "underline"
        | "strikethrough"
        | "code"
        | "pre"
        | "text_link"
        | "text_mention"
        | "spoiler"
        | "custom_emoji";


export interface MessageEntity {
	type: MessageEntityType;
	offset: number;
	length: number;
	url?: string | undefined;
	user?: User | undefined;
	language?: string | undefined;
	custom_emoji_id?: string | undefined;
}

export interface InlineKeyboardMarkup {
	inline_keyboard: InlineKeyboardButton[][];
}

export interface InlineKeyboardButton {
	text: string;
	url?: string | undefined;
	callback_data?: string | undefined;
	switch_inline_query?: string | undefined;
	switch_inline_query_current_chat?: string | undefined;
}
