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
    const { user } = useAuth(); 
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
                fetchPosts(); 
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
                {/* <div className="flex justify-between items-center mb-8">
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
                    </div> */}

                {/* </div> */}
                {/* --- THIS IS THE SECTION WE ARE FIXING --- */}
                
                {/* CHANGES MADE:
                  1. Main Container: Changed from 'flex' to 'flex flex-col md:flex-row'.
                     - 'flex-col':     Default. Stacks the title and buttons vertically on mobile.
                     - 'md:flex-row':  On medium screens (768px+) and up, they go side-by-side.
                     - 'md:justify-between': Only applies 'justify-between' on desktop.
                     - 'md:items-center':  Only centers them on the cross-axis on desktop.
                     - 'gap-4':         Adds vertical spacing on mobile, horizontal on desktop.
                */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {filter === 'all' ? 'All Posts' : 'My Posts'}
                    </h1>
                    
                    {/*
                      CHANGES MADE:
                      2. Button Container: 
                         - 'flex-col':    Default. Stacks the 'My Posts' and 'Write' buttons on small mobile.
                         - 'sm:flex-row': On small screens (640px+) and up, they go side-by-side.
                         - 'w-full':      Makes the container full-width on mobile.
                         - 'md:w-auto':   Resets to auto-width on medium screens (desktop layout).
                    */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        
                        {/* CHANGES MADE:
                          3. Buttons:
                             - 'w-full':    Makes buttons full-width on small mobile (when stacked).
                             - 'sm:w-auto': Resets to auto-width on small screens+.
                             - 'justify-center': Centers the icon/text inside the full-width button.
                        */}
                        {filter === 'all' ? (
                            <button onClick={() => setFilter('my_posts')} className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 w-full sm:w-auto">
                                <User size={18} /><span>My Posts</span>
                            </button>
                        ) : (
                            <button onClick={() => setFilter('all')} className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 w-full sm:w-auto">
                                <Globe size={18} /><span>All Posts</span>
                            </button>
                        )}
                        <button onClick={handleGoToCreate} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto">
                            <PlusCircle size={18} /><span>Write</span>
                        </button>
                    </div>
                </div>

                {/* --- END OF FIXED SECTION --- */}
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
