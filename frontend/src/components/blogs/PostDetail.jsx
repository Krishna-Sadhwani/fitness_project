import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Toaster, toast } from 'sonner';
import { ArrowLeft, ThumbsUp, Send } from 'lucide-react';

export default function PostDetail({ postId, onBack }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/blog/posts/${postId}/`);
            setPost(response.data);
        } catch (error) {
            toast.error('Failed to load the post.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const handleLike = async () => {
        try {
            await apiClient.post(`/blog/posts/${postId}/like/`);
            fetchPost(); // Refetch post to update like count
        } catch (error) {
            toast.error('Failed to update like.');
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        try {
            await apiClient.post(`/blog/posts/${postId}/comments/`, { content: comment });
            setComment('');
            fetchPost(); // Refetch post to show new comment
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment.');
        }
    };

    if (loading) return <p className="text-center p-8">Loading post...</p>;
    if (!post) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <button onClick={onBack} className="flex items-center text-green-600 font-semibold mb-8 hover:underline">
                <ArrowLeft size={18} className="mr-2" />
                Back to All Posts
            </button>

            <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                {/* --- CHANGE IS HERE --- */}
                <div className="flex items-center gap-3 mb-4">
                    <img 
                        src={post.author.profile_picture || `https://placehold.co/100x100/E2E8F0/4A5568?text=${post.author.username.charAt(0).toUpperCase()}`} 
                        alt={post.author.username} 
                        className="w-10 h-10 rounded-full object-cover" 
                    />
                    <span className="font-semibold text-gray-700">By {post.author.username}</span>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
                
                {post.image && (
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-96 object-cover rounded-xl my-8" 
                    />
                )}

                <div className="mt-8 prose prose-lg max-w-none text-gray-700">
                    <p>{post.content}</p>
                </div>
            </article>

            <div className="mt-8">
                <div className="flex items-center gap-4">
                    <button onClick={handleLike} className="flex items-center gap-2 bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors">
                        <ThumbsUp size={18} />
                        <span>Like ({post.like_count})</span>
                    </button>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments ({post.comments.length})</h2>
                    <div className="space-y-4">
                        {post.comments.map(c => (
                            <div key={c.id} className="bg-gray-100 p-4 rounded-lg">
                                <p className="font-semibold text-gray-800">{c.author.username}</p>
                                <p className="text-gray-600">{c.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex items-center gap-2">
                        <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <button onClick={handleAddComment} className="bg-green-500 text-white p-2.5 rounded-lg hover:bg-green-600 transition-colors"><Send size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}