import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://backend-ia06.onrender.com/api';

const AddEditLink = ({ editingLink, setEditingLink, setActiveSubMenu, displayMessage, fetchLinks }) => {
    const [formData, setFormData] = useState({ name: '', url: '', description: '', username: '', password: '', category: '' });

    useEffect(() => {
        if (editingLink) {
            setFormData({
                name: editingLink.name || '',
                url: editingLink.url || '',
                description: editingLink.description || '',
                username: editingLink.username || '',
                password: editingLink.password || '',
                category: editingLink.category || '',
            });
        } else {
            setFormData({ name: '', url: '', description: '', username: '', password: '', category: '' });
        }
    }, [editingLink]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        displayMessage('Processing...', true);
        const submitBtn = document.getElementById('submit-link-btn');
        if (submitBtn) submitBtn.disabled = true;

        if (!formData.name || !formData.url) {
            displayMessage('Both name and URL are required.', false);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        try {
            let response;
            if (editingLink) {
                response = await fetch(`${API_BASE_URL}/mylinks/${editingLink.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/mylinks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save link');
            }

            displayMessage(`Link ${editingLink ? 'updated' : 'added'} successfully!`, true);
            setEditingLink(null);
            setFormData({ name: '', url: '', description: '', username: '', password: '', category: '' });
            setActiveSubMenu('listLinks');
            if (fetchLinks) fetchLinks();
        } catch (error) {
            console.error('Error saving link:', error);
            displayMessage(`Error: ${error.message}. Please try again.`, false);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editingLink ? 'Edit Link' : 'Add New Link'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="e.g., My Portfolio"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL:</label>
                    <input
                        type="url"
                        id="url"
                        value={formData.url}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="e.g., https://example.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={formData.category || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="e.g., Work, Social, Tools, Banking"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-y"
                        placeholder="description for this link..."
                        rows="2"
                    />
                </div>
                <div className="flex gap-4">
                    <div className='grow'>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="username for this link..."
                        />
                    </div>
                    <div className='grow'>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type="text"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="password for this link..."
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    id="submit-link-btn"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {editingLink ? 'Update Link' : 'Add Link'}
                </button>
                {editingLink && (
                    <button
                        type="button"
                        id="cancel-link-edit-btn"
                        className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center"
                        onClick={() => {
                            setEditingLink(null);
                            setActiveSubMenu('listLinks');
                        }}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddEditLink; 