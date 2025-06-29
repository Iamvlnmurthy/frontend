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

    return (
        <div className="bg-white rounded-lg p-6">
            {/* ...rest of the component's JSX... */}
        </div>
    );
};

export default ContactList;
