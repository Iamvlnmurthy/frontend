import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://backend-ia06.onrender.com/api';

const MyLinksList = ({ setActiveSubMenu, setEditingLink, displayMessage, showConfirmationModal }) => {
    const [links, setLinks] = useState([]);
    const [filterValue, setFilterValue] = useState('');

    const fetchLinks = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/mylinks`);
            if (!response.ok) throw new Error('Failed to fetch links');
            const data = await response.json();
            setLinks(data);
        } catch (error) {
            console.error('Error fetching links:', error);
            displayMessage('Failed to load links. Please check your backend connection.', false);
        }
    }, [displayMessage]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const filteredLinks = links.filter(link => {
        if (!filterValue) return true;
        return (
            (link.name || '').toLowerCase().includes(filterValue.toLowerCase()) ||
            (link.url || '').toLowerCase().includes(filterValue.toLowerCase())
        );
    });

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Links</h2>
            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700">Filter:</label>
                <input
                    type="text"
                    id="filterValue"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Search by name or URL..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />
            </div>
            {links.length === 0 ? (
                <p className="text-gray-600">No links found. Add one using the "Add Link" tab!</p>
            ) : filteredLinks.length === 0 ? (
                <p className="text-gray-600">No links match your filter.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredLinks.map(link => (
                        <li key={link.id} className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex-grow space-y-1">
                                <p className="text-lg font-semibold text-gray-900 flex items-center">{link.name}</p>
                                {link.description && (
                                    <p className="text-gray-500 text-sm mb-1">{link.description}</p>
                                )}
                                {link.username && (
                                    <p className="text-gray-500 text-sm mb-1"><span className="font-semibold">Username:</span> {link.username}</p>
                                )}
                                {link.password && (
                                    <p className="text-gray-500 text-sm mb-1"><span className="font-semibold">Password:</span> {link.password}</p>
                                )}
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{link.url}</a>
                            </div>
                            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 justify-end">
                                <button
                                    className="edit-link-btn flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md"
                                    onClick={() => {
                                        setEditingLink(link);
                                        setActiveSubMenu('addLink');
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-link-btn flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md"
                                    onClick={() => showConfirmationModal(
                                        'Are you sure you want to delete this link?',
                                        async () => {
                                            try {
                                                const response = await fetch(`${API_BASE_URL}/mylinks/${link.id}`, { method: 'DELETE' });
                                                if (!response.ok) throw new Error('Failed to delete link');
                                                displayMessage('Link deleted successfully!', true);
                                                fetchLinks();
                                            } catch (error) {
                                                console.error('Error deleting link:', error);
                                                displayMessage('Failed to delete link.', false);
                                            }
                                        }
                                    )}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyLinksList; 