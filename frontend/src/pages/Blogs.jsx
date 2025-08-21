import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'sonner';
import { PlusCircle, User, Globe } from 'lucide-react';
import PostDetail from '../components/blogs/PostDetail';
import CreatePost from '../components/blogs/CreatePost';
import EditPost from '../components/blogs/EditPost';
import PostCard from '../components/blogs/PostCard';

export default function Blogs() {
    const { user } = useAuth(); // Get the current user
    const [view, setView] = useState('list');
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = '/blog/posts/';
            if (filter === 'my_posts') {
                url += '?my_posts=true';
            }
            const response = await apiClient.get(url);
            setPosts(response.data);
        } catch (error) {
            toast.error('Failed to load blog posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const handleSelectPost = (post) => {
        setSelectedPost(post);
        setView('post');
    };

    const handleGoToCreate = () => {
        setView('create');
    };

    const handleGoToEdit = (post) => {
        setSelectedPost(post);
        setView('edit');
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await apiClient.delete(`/blog/posts/${postId}/`);
                toast.success('Post deleted successfully!');
                fetchPosts(); // Refresh the list
            } catch (error) {
                toast.error('Failed to delete post.');
            }
        }
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedPost(null);
        fetchPosts();
    };

    // --- Render Logic ---
    if (view === 'post') {
        return <PostDetail postId={selectedPost.id} onBack={handleBackToList} />;
    }
    if (view === 'create') {
        return <CreatePost onBack={handleBackToList} />;
    }
    if (view === 'edit') {
        return <EditPost post={selectedPost} onBack={handleBackToList} />;
    }

    return (
      
        <>
            <Toaster position="top-center" richColors />
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {filter === 'all' ? 'All Posts' : 'My Posts'}
                    </h1>
                    <div className="flex items-center gap-2">
                        {filter === 'all' ? (
                            <button onClick={() => setFilter('my_posts')} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                <User size={18} /><span>My Posts</span>
                            </button>
                        ) : (
                            <button onClick={() => setFilter('all')} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                <Globe size={18} /><span>All Posts</span>
                            </button>
                        )}
                        <button onClick={handleGoToCreate} className="flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">
                            <PlusCircle size={18} /><span>Write</span>
                        </button>
                    </div>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500">Loading posts...</p>
                ) : (
                    <div className="space-y-6">
                        {posts.length === 0 ? (
                            <p className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                                {filter === 'all' ? 'No posts found.' : "You haven't written any posts yet."}
                            </p>
                        ) : (
                            posts.map(post => {
                                // --- THIS IS THE CORRECTED LOGIC ---
                                // We use parseInt() to ensure we are comparing numbers, not a string and a number.
                                const isAuthor = user && parseInt(user.user_id) === post.author.id;

                                return (
                                    <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    onSelectPost={() => handleSelectPost(post)}
                                    isAuthor={isAuthor}
                                    onEdit={() => handleGoToEdit(post)}
                                    onDelete={() => handleDeletePost(post.id)}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
