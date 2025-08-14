import React, { useState, useEffect } from 'react'
import apiClient from '../api/client'

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await apiClient.get('/chat/')
      if (res.data) {
        setMessages(res.data)
      }
    } catch (e) {
      console.error('Failed to fetch conversations:', e)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = { role: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)
    setError(null)

    try {
      const res = await apiClient.post('/chat/', { message: inputMessage })
      const aiResponse = { role: 'assistant', content: res.data.response }
      setMessages(prev => [...prev, aiResponse])
    } catch (e) {
      setError(e?.response?.data || 'Failed to send message')
      // Remove the user message if AI failed to respond
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      await apiClient.delete(`/chat/${messageId}/`)
      await fetchConversations()
    } catch (e) {
      setError('Failed to delete message')
    }
  }

  const clearAll = async () => {
    try {
      await apiClient.delete('/chat/clear/')
      setMessages([])
    } catch (e) {
      setError('Failed to clear conversations')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">AI Nutritionist</h2>
        <button
          onClick={clearAll}
          className="text-red-600 hover:text-red-800 text-sm border border-red-200 rounded px-3 py-1"
        >
          Clear All
        </button>
      </div>

      {error && <div className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded p-2">{JSON.stringify(error)}</div>}

      {/* Chat Messages */}
      <div className="border rounded-lg h-96 overflow-y-auto p-4 mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">👋 Welcome to your AI Nutritionist!</p>
            <p className="text-sm">Ask me anything about nutrition, meal planning, or fitness advice.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                      : 'bg-white border text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm">{message.content}</p>
                    {message.id && (
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="text-xs opacity-70 hover:opacity-100"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border px-4 py-2 rounded-lg">
                  <p className="text-gray-500">AI is thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          placeholder="Ask about nutrition, meal planning, or fitness advice..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className={`px-6 py-2 rounded-lg text-white ${
            loading || !inputMessage.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105'
          }`}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default Chatbot




