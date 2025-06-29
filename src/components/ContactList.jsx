import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../utils/icons.jsx';

// TODO: Move API_BASE_URL to a config file or pass as prop
const API_BASE_URL = 'https://backend-ia06.onrender.com/api';

const ContactList = ({ setActiveSubMenu, setEditingContact, displayMessage, showConfirmationModal }) => {
    const [contacts, setContacts] = useState([]);
    const [filterField, setFilterField] = useState('name');
    const [filterValue, setFilterValue] = useState('');
    const [purposeFilter, setPurposeFilter] = useState('');
    const [expandedContactId, setExpandedContactId] = useState(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const contactsPerPage = 10;

    const fetchContacts = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/contacts`);
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            displayMessage('Failed to load contacts. Please check your backend connection.', false);
        }
    }, [displayMessage]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const getPlaceholder = (field) => {
        const numericalFields = ['xTwitterFollowers', 'facebookFollowers', 'instagramFollowers', 'teaStallTeaPowderPrice', 'phone', 'paMobileNumber', 'managerMobileNumber', 'teaStallMobileNumber'];
        const dateFields = ['lastInteractionDate'];

        if (numericalFields.includes(field)) return 'Enter number...';
        if (dateFields.includes(field)) return 'Enter date (YYYY-MM-DD)...';
        if (field.includes('email')) return 'Enter email address...';
        if (field.includes('URL')) return 'Enter URL...';
        return `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`;
    };

    const getInputType = (field) => {
        const numericalFields = ['xTwitterFollowers', 'facebookFollowers', 'instagramFollowers', 'teaStallTeaPowderPrice', 'phone', 'paMobileNumber', 'managerMobileNumber', 'teaStallMobileNumber'];
        const dateFields = ['lastInteractionDate'];
        if (numericalFields.includes(field)) return 'number';
        if (dateFields.includes(field)) return 'date';
        return 'text';
    };

    const handleShare = async (contact) => {
        let shareText = `Contact: ${contact.name}\n`;
        if (contact.phone) shareText += `Phone: ${contact.phone}\n`;
        if (contact.email) shareText += `Email: ${contact.email}\n`;
        if (contact.company) shareText += `Company: ${contact.company}\n`;
        if (contact.address) shareText += `Address: ${contact.address}\n`;
        if (contact.city) shareText += `City: ${contact.city}\n`;
        if (contact.state) shareText += `State: ${contact.state}\n`;
        if (contact.district) shareText += `District: ${contact.district}\n`;
        if (contact.location) shareText += `Location: ${contact.location}\n`;
        if (contact.nativeLanguage) shareText += `Native Language: ${contact.nativeLanguage}\n`;
        if (contact.purpose) shareText += `Purpose: ${contact.purpose}\n`;

        if (contact.purpose === 'political') {
            if (contact.paMobileNumber) shareText += `PA Mobile: ${contact.paMobileNumber}\n`;
            if (contact.constituency) shareText += `Constituency: ${contact.constituency}\n`;
            if (contact.politicalPartyName) shareText += `Political Party: ${contact.politicalPartyName}\n`;
        }
        if (contact.purpose === 'celebrity') {
            if (contact.managerMobileNumber) shareText += `Manager Mobile: ${contact.managerMobileNumber}\n`;
            if (contact.profession) shareText += `Profession: ${contact.profession}\n`;
        }
        if (contact.purpose === 'serviceProvider') {
            if (contact.serviceType) shareText += `Service Type: ${contact.serviceType}\n`;
            if (contact.serviceContactPerson) shareText += `Service Contact: ${contact.serviceContactPerson}\n`;
            if (contact.lastInteractionDate) shareText += `Last Interaction: ${contact.lastInteractionDate}\n`;
            if (contact.contractDetails) shareText += `Contract Details: ${contact.contractDetails}\n`;
        }
        if (contact.purpose === 'teaStall') {
            if (contact.teaStallCode) shareText += `Tea Stall Code: ${contact.teaStallCode}\n`;
            if (contact.teaStallName) shareText += `Tea Stall Name: ${contact.teaStallName}\n`;
            if (contact.teaStallOwnerName) shareText += `Owner Name: ${contact.teaStallOwnerName}\n`;
            if (contact.teaStallMobileNumber) shareText += `Mobile Number: ${contact.teaStallMobileNumber}\n`;
            if (contact.teaStallArea) shareText += `Area: ${contact.teaStallArea}\n`;
            if (contact.teaStallMandal) shareText += `Mandal: ${contact.teaStallMandal}\n`;
            if (contact.teaStallTeaPowderPrice) shareText += `Tea Powder Price: ${contact.teaStallTeaPowderPrice}\n`;
            if (contact.teaStallOtherSellingItems) shareText += `Other Selling Items: ${contact.teaStallOtherSellingItems}\n`;
        }
        if (contact.x_twitter) shareText += `X (Twitter): ${contact.x_twitter}\n`;
        if (contact.facebook) shareText += `Facebook: ${contact.facebook}\n`;
        if (contact.youtube) shareText += `YouTube: ${contact.youtube}\n`;
        if (contact.instagram) shareText += `Instagram: ${contact.instagram}\n`;
        if (contact.remarks) shareText += `Remarks: ${contact.remarks}\n`;
        if (contact.notes) shareText += `Notes: ${contact.notes}\n`;

        try {
            if (navigator.share) {
                await navigator.share({ title: `Contact: ${contact.name}`, text: shareText });
                displayMessage('Contact shared successfully!', true);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = shareText;
                textarea.style.position = 'fixed';
                textarea.style.opacity = 0;
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                displayMessage('Contact details copied to clipboard!', true);
                document.body.removeChild(textarea);
            }
        } catch (error) {
            console.error('Error sharing contact:', error);
            displayMessage('Sharing failed or cancelled.', false);
        }
    };

    const handleDeleteClick = (id) => {
        showConfirmationModal(
            "Are you sure you want to delete this contact? This action cannot be undone.",
            async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Failed to delete contact');
                    displayMessage('Contact deleted successfully!', true);
                    fetchContacts(); // Refresh list after deletion
                } catch (error) {
                    console.error('Error deleting contact:', error);
                    displayMessage('Failed to delete contact.', false);
                }
            }
        );
    };

    const filteredContacts = contacts.filter(contact => {
        let textFilterMatch = true;
        if (filterValue) {
            let contactValue = contact[filterField];
            if (typeof contactValue === 'number' || filterField.includes('MobileNumber') || filterField === 'teaStallTeaPowderPrice') {
                textFilterMatch = String(contactValue || '').includes(filterValue);
            } else {
                textFilterMatch = String(contactValue || '').toLowerCase().includes(filterValue.toLowerCase());
            }
        }

        let purposeFilterMatch = true;
        if (purposeFilter) {
            purposeFilterMatch = contact.purpose === purposeFilter;
        }
        return textFilterMatch && purposeFilterMatch;
    }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    // Pagination logic
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    const paginatedContacts = filteredContacts.slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage);

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Private Contacts</h2>
            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Filter Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="purposeFilter" className="block text-sm font-medium text-gray-700">Filter by Purpose:</label>
                        <select
                            id="purposeFilter"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            value={purposeFilter}
                            onChange={(e) => setPurposeFilter(e.target.value)}
                        >
                            <option value="">All Purposes</option>
                            <option value="general">General</option>
                            <option value="distributor">Distributor</option>
                            <option value="influencer">Influencer</option>
                            <option value="political">Political</option>
                            <option value="celebrity">Celebrity</option>
                            <option value="serviceProvider">Service Provider</option>
                            <option value="customer">Customer</option>
                            <option value="teaStall">Tea Stall</option>
                            <option value="shops">Shops</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterField" className="block text-sm font-medium text-gray-700">Filter by Field:</label>
                        <select
                            id="filterField"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            value={filterField}
                            onChange={(e) => {
                                setFilterField(e.target.value);
                                setFilterValue(''); // Clear value when field changes
                            }}
                        >
                            <option value="name">Name</option>
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="company">Company</option>
                            <option value="address">Address (Street)</option>
                            <option value="city">City</option>
                            <option value="state">State</option>
                            <option value="district">District</option>
                            <option value="location">Location</option>
                            <option value="nativeLanguage">Native Language</option>
                            <option value="remarks">Remarks</option>
                            <option value="notes">Notes</option>
                            <option value="paMobileNumber">PA Mobile Number</option>
                            <option value="constituency">Constituency</option>
                            <option value="politicalPartyName">Political Party Name</option>
                            <option value="managerMobileNumber">Manager Mobile Number</option>
                            <option value="profession">Profession</option>
                            <option value="serviceType">Service Type</option>
                            <option value="serviceContactPerson">Service Contact Person</option>
                            <option value="lastInteractionDate">Last Interaction Date</option>
                            <option value="contractDetails">Contract Details</option>
                            <option value="xTwitterProfileName">X (Twitter) Profile Name</option>
                            <option value="xTwitterFollowers">X (Twitter) Followers</option>
                            <option value="x_twitter">X (Twitter) URL</option>
                            <option value="facebookProfileName">Facebook Profile Name</option>
                            <option value="facebookFollowers">Facebook Followers</option>
                            <option value="facebook">Facebook URL</option>
                            <option value="youtubeChannelName">YouTube Channel Name</option>
                            <option value="youtubeFollowers">YouTube Subscribers</option>
                            <option value="youtube">YouTube URL</option>
                            <option value="instagramProfileName">Instagram Profile Name</option>
                            <option value="instagramFollowers">Instagram Followers</option>
                            <option value="instagram">Instagram URL</option>
                            <option value="teaStallCode">Tea Stall Code</option>
                            <option value="teaStallName">Tea Stall Name</option>
                            <option value="teaStallOwnerName">Tea Stall Owner Name</option>
                            <option value="teaStallMobileNumber">Tea Stall Mobile Number</option>
                            <option value="teaStallArea">Tea Stall Area</option>
                            <option value="teaStallMandal">Tea Stall Mandal</option>
                            <option value="teaStallTeaPowderPrice">Tea Stall Tea Powder Price</option>
                            <option value="teaStallOtherSellingItems">Tea Stall Other Selling Items</option>
                            <option value="shopCategory">Shop Category</option>
                            <option value="shopName">Shop Name</option>
                            <option value="shopOwnerName">Shop Owner Name</option>
                            <option value="shopContactNumber">Shop Contact Number</option>
                            <option value="shopAddress">Shop Address</option>
                            <option value="shopVillage">Shop Village</option>
                            <option value="shopMandal">Shop Mandal</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700">Value:</label>
                        <input
                            type={getInputType(filterField)}
                            id="filterValue"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder={getPlaceholder(filterField)}
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {contacts.length === 0 ? (
                <p className="text-gray-600">No private contacts found. Add one using the "Add Contact" tab!</p>
            ) : filteredContacts.length === 0 ? (
                <p className="text-gray-600">No contacts match your filters.</p>
            ) : (
                <>
                <ul className="space-y-4">
                    {paginatedContacts.map(contact => {
                        const isExpanded = expandedContactId === contact.id;
                        return (
                            <li
                                key={contact.id}
                                className={`bg-gray-50 p-4 rounded-lg shadow-md flex flex-col transition-all duration-200 ${isExpanded ? 'border-2 border-red-400' : 'cursor-pointer hover:bg-red-50'}`}
                            >
                                <div
                                    className="flex items-center"
                                    onClick={() => setExpandedContactId(isExpanded ? null : contact.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="text-lg font-semibold text-gray-900 flex items-center">
                                        {Icons.User} {contact.name || ''}
                                    </span>
                                    {contact.purpose && (
                                        <span className="ml-3 px-2 py-0.5 rounded-full bg-gray-200 text-xs text-gray-700 font-medium whitespace-nowrap">
                                            {contact.purpose.charAt(0).toUpperCase() + contact.purpose.slice(1)}
                                        </span>
                                    )}
                                    <span className="ml-2 text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                                </div>
                                {isExpanded && (
                                    <div className="mt-3">
                                        <table className="min-w-full border border-gray-200 rounded overflow-hidden mb-4">
                                            <tbody>
                                                {Object.entries(contact).map(([key, value]) => {
                                                    if (!value || [
                                                        '_id', 'id', '__v', 'timestamp', 'createdAt', 'updatedAt'
                                                    ].includes(key)) return null;
                                                    // Human-readable labels for known fields
                                                    const labels = {
                                                        name: 'Name', phone: 'Phone', email: 'Email', company: 'Company', address: 'Address', city: 'City', state: 'State', district: 'District', location: 'Location', nativeLanguage: 'Native Language', purpose: 'Purpose', remarks: 'Remarks', notes: 'Notes',
                                                        x_twitter: 'X (Twitter) URL', xTwitterProfileName: 'X (Twitter) Profile Name', xTwitterFollowers: 'X (Twitter) Followers',
                                                        facebook: 'Facebook URL', facebookProfileName: 'Facebook Profile Name', facebookFollowers: 'Facebook Followers',
                                                        youtube: 'YouTube URL', youtubeChannelName: 'YouTube Channel Name', youtubeFollowers: 'YouTube Subscribers',
                                                        instagram: 'Instagram URL', instagramProfileName: 'Instagram Profile Name', instagramFollowers: 'Instagram Followers',
                                                        paMobileNumber: 'PA Mobile Number', constituency: 'Constituency', politicalPartyName: 'Political Party Name',
                                                        managerMobileNumber: 'Manager Mobile Number', profession: 'Profession',
                                                        serviceType: 'Service Type', serviceContactPerson: 'Service Contact Person', lastInteractionDate: 'Last Interaction Date', contractDetails: 'Contract Details',
                                                        teaStallCode: 'Tea Stall Code', teaStallName: 'Tea Stall Name', teaStallOwnerName: 'Tea Stall Owner Name', teaStallMobileNumber: 'Tea Stall Mobile Number', teaStallArea: 'Tea Stall Area', teaStallMandal: 'Tea Stall Mandal', teaStallTeaPowderPrice: 'Tea Stall Tea Powder Price', teaStallOtherSellingItems: 'Tea Stall Other Selling Items',
                                                        shopCategory: 'Shop Category', shopName: 'Shop Name', shopOwnerName: 'Shop Owner Name', shopContactNumber: 'Shop Contact Number', shopAddress: 'Shop Address', shopVillage: 'Shop Village', shopMandal: 'Shop Mandal',
                                                    };
                                                    return (
                                                        <tr key={key}>
                                                            <td className="font-semibold text-gray-700 pr-4 py-1 align-top whitespace-nowrap">{labels[key] || key}</td>
                                                            <td className="text-gray-800 py-1 break-all">{value}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="mt-2 flex flex-wrap gap-2 justify-end">
                                            <button
                                                className="share-btn flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md"
                                                onClick={(e) => { e.stopPropagation(); handleShare(contact); }}
                                            >
                                                {Icons.Share2} Share
                                            </button>
                                            <button
                                                className="edit-btn flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingContact(contact);
                                                    setActiveSubMenu('addContact');
                                                }}
                                            >
                                                {Icons.Edit} Edit
                                            </button>
                                            <button
                                                className="delete-btn flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(contact.id); }}
                                            >
                                                {Icons.Trash2} Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-6 gap-2">
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2 text-gray-700">Page {currentPage} of {totalPages}</span>
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                </>
            )}
        </div>
    );
};

export default ContactList;
