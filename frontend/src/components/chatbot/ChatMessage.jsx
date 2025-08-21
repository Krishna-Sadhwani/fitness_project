import React from 'react';
import { Bot, User, Trash2 } from 'lucide-react';

export default function ChatMessage({ conversation, onDelete }) {
    return (
        <div className="space-y-4 group">
            {/* User Message */}
            <div className="flex items-start gap-3 justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-lg">
                    <p>{conversation.user_message}</p>
                </div>
                <User className="w-8 h-8 p-1.5 bg-gray-200 text-gray-600 rounded-full flex-shrink-0" />
            </div>

            {/* AI Response */}
            <div className="flex items-start gap-3">
                <Bot className="w-8 h-8 p-1.5 bg-green-100 text-green-600 rounded-full flex-shrink-0" />
                <div className="bg-gray-100 p-3 rounded-lg max-w-lg relative">
                    <p className="whitespace-pre-wrap">{conversation.ai_response}</p>
                    {/* Delete button appears on hover */}
                    <button 
                        onClick={onDelete}
                        className="absolute -top-2 -right-2 p-1 bg-white rounded-full text-gray-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
