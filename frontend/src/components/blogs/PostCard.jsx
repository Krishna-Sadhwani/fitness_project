import React from 'react';
import { MessageSquare, ThumbsUp, Edit, Trash2 } from 'lucide-react';

export default function PostCard({ post, onSelectPost, isAuthor, onEdit, onDelete }) {
    // Stop event propagation for edit/delete buttons so they don't trigger onSelectPost
    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit();
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            onClick={onSelectPost}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 mb-4">
                    <img 
                        src={post.author.profile_picture || `https://placehold.co/100x100/E2E8F0/4A5568?text=${post.author.username.charAt(0).toUpperCase()}`} 
                        alt={post.author.username} 
                        className="w-8 h-8 rounded-full object-cover" 
                    />
                    <span className="font-semibold text-gray-700">By {post.author.username}</span>
                </div>
                {/* --- NEW: Conditionally render Edit/Delete buttons --- */}
                {isAuthor && (
                    <div className="flex items-center gap-2">
                        <button onClick={handleEditClick} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full">
                            <Edit size={16} />
                        </button>
                        <button onClick={handleDeleteClick} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full">
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
            <p className="mt-2 text-gray-600 line-clamp-2">{post.content}</p>
            
            <div className="flex items-center justify-end mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><ThumbsUp size={14} /> {post.like_count}</span>
                    <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {post.comments.length}</span>
                </div>
            </div>
        </div>
    );
}
