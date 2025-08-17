import React, { useState } from 'react';
import apiClient from '../../api/client';
import { Toaster, toast } from 'sonner';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';

export default function CreatePost({ onBack }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null); // State for the image file
    const [imagePreview, setImagePreview] = useState(null); // State for the image preview URL
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create a temporary URL for the preview
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (status) => {
        if (!title || !content) {
            toast.error('Please fill out both the title and content.');
            return;
        }

        // Use FormData to send both text and file data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        if (image) {
            formData.append('image', image);
        }

        setIsSubmitting(true);
        try {
            // The header must be 'multipart/form-data' when sending files
            await apiClient.post('/blog/posts/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(`Post successfully saved as ${status}!`);
            onBack(); // Go back to the list view
        } catch (error) {
            toast.error('Failed to save the post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <button onClick={onBack} className="flex items-center text-green-600 font-semibold mb-8 hover:underline">
                    <ArrowLeft size={18} className="mr-2" />
                    Cancel
                </button>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800">Create a New Post</h1>
                    
                    {/* Title and Content Inputs (Unchanged) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                        <textarea rows="10" value={content} onChange={e => setContent(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>

                    {/* --- NEW: Image Upload Section --- */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Image (Optional)</label>
                        {imagePreview ? (
                            <div className="relative mt-2">
                                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                                <button onClick={removeImage} className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
                                    <X size={18} className="text-gray-700" />
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button onClick={() => handleSubmit('draft')} disabled={isSubmitting} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 disabled:bg-gray-300">
                            {isSubmitting ? 'Saving...' : 'Save as Draft'}
                        </button>
                        <button onClick={() => handleSubmit('published')} disabled={isSubmitting} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
                            {isSubmitting ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
