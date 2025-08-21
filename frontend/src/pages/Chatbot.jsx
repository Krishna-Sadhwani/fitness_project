import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import { Toaster, toast } from 'sonner';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import ChatMessage from '../components/chatbot/ChatMessage'; // We will create this next
import ChatInput from '../components/chatbot/ChatInput';   // We will create this next

export default function Chatbot() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const chatEndRef = useRef(null);

    // Function to fetch past conversations
    const fetchHistory = async () => {
        setIsFetchingHistory(true);
        try {
            const response = await apiClient.get('/chatbot/chat/');
            setHistory(response.data);
        } catch (error) {
            toast.error('Failed to load conversation history.');
        } finally {
            setIsFetchingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleSubmit = async (message) => {
        if (!message.trim() || isLoading) return;

        setIsLoading(true);
        
        // Temporarily add the user's message to the UI for a responsive feel
        const tempUserMessage = { id: 'temp-user', user_message: message };
        setHistory(prev => [...prev, tempUserMessage]);

        try {
            const response = await apiClient.post('/chatbot/chat/', { message });
            // After getting the real response, refresh the entire history
            // to get the saved message with its real ID and the AI response.
            fetchHistory();
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            // Remove the temporary message if the API call fails
            setHistory(prev => prev.filter(m => m.id !== 'temp-user'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/chatbot/chat/${id}/`);
            toast.success('Conversation deleted.');
            setHistory(prev => prev.filter(conv => conv.id !== id));
        } catch (error) {
            toast.error('Failed to delete conversation.');
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Are you sure you want to delete your entire conversation history?')) {
            try {
                await apiClient.delete('/chatbot/chat/clear/');
                toast.success('History cleared.');
                setHistory([]);
            } catch (error) {
                toast.error('Failed to clear history.');
            }
        }
    };

    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Chat Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">AI Nutritionist</h1>
                        <p className="text-sm text-gray-500">Your personal health assistant</p>
                    </div>
                    <button 
                        onClick={handleClearAll}
                        className="flex items-center gap-2 text-sm text-red-600 font-semibold hover:bg-red-50 p-2 rounded-lg"
                    >
                        <Trash2 size={16} />
                        Clear History
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {isFetchingHistory ? (
                        <p className="text-center text-gray-500">Loading history...</p>
                    ) : (
                        history.map((conv) => (
                            <ChatMessage key={conv.id} conversation={conv} onDelete={() => handleDelete(conv.id)} />
                        ))
                    )}
                    
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <Bot className="w-8 h-8 p-1.5 bg-green-100 text-green-600 rounded-full flex-shrink-0" />
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <Loader2 className="animate-spin text-gray-500" />
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Message Input Form */}
                <ChatInput onSendMessage={handleSubmit} isLoading={isLoading} />
            </div>
        </>
    );
}

