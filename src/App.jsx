// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import { Icons } from './utils/icons.jsx';
import ContactList from './components/ContactList.jsx';
import MyLinksList from './components/MyLinks/MyLinksList.jsx';
import AddEditLink from './components/MyLinks/AddEditLink.jsx';

const API_BASE_URL = 'https://backend-ia06.onrender.com/api'; // Your Node.js backend URL

// Data for Indian States and Districts
const indianStatesAndDistricts = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Upper Siang", "Siang", "Lower Siang", "Lohit", "Namsai", "Anjaw", "Changlang", "Tirap", "Longding", "Lower Dibang Valley", "Dibang Valley", "Pakke-Kessang", "Lepara", "Shi-Yomi", "Kamle"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golagapra", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "West Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganh", "Jamui",
      "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada (South Bastar)", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham (Kawardha)", "Kanker (North Bastar)", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "  South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Kheda", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehbad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi (Gulbarga)", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru (Mysore)", "Raichur", "Ramanagara", "Shivamogga (Shimoga)", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura (Bijapur)", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Kharganj", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri-Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip", "Saitual"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto", "Noklak"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh (Deogarh)", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur (Sonepur)", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shahid Bhagat Singh Nagar (Nawanshahr)", "Sri Muktsar Sahib", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi (Tuticorin)", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Bara Banki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun",
      "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareilly", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Paschim Bardhaman (West Bardhaman)", "Purba Bardhaman (East Bardhaman)", "Birbhum", "Cooch Behar", "Dakshin Dinajpur (South Dinajpur)", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur (West Medinipur)", "Purba Medinipur (East Medinipur)", "Purulia", "South 24 Parganas", "Uttar Dinajpur (North Dinajpur)"],
    "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    "Lakshadweep": ["Lakshadweep"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};
const states = Object.keys(indianStatesAndDistricts).sort();

const generate5DigitCode = () => Math.floor(10000 + Math.random() * 90000).toString();
const generateUniqueId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// --- AddEditContact Component ---
const AddEditContact = ({ editingContact, setEditingContact, extractedContactData, setExtractedContactData, setOverallActiveSubMenu, displayMessage }) => {
    const initialFormData = editingContact || extractedContactData || { purpose: 'general' };

    // Initialize state with a deep copy to avoid direct mutation of props
    const [formData, setFormData] = useState(() => {
        const data = JSON.parse(JSON.stringify(initialFormData));
        // Ensure number fields are strings for input value
        ['xTwitterFollowers', 'facebookFollowers', 'youtubeFollowers', 'instagramFollowers', 'teaStallTeaPowderPrice'].forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                data[key] = String(data[key]);
            } else {
                data[key] = '';
            }
        });
        if (data.purpose === 'teaStall' && !data.teaStallCode) {
            data.teaStallCode = generate5DigitCode();
        } else if (data.purpose !== 'teaStall') {
            data.teaStallCode = '';
        }
        return data;
    });

    // Reset form data when editingContact or extractedContactData changes
    useEffect(() => {
        const data = JSON.parse(JSON.stringify(editingContact || extractedContactData || { purpose: 'general' }));
        ['xTwitterFollowers', 'facebookFollowers', 'youtubeFollowers', 'instagramFollowers', 'teaStallTeaPowderPrice'].forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                data[key] = String(data[key]);
            } else {
                data[key] = '';
            }
        });
        if (data.purpose === 'teaStall' && !data.teaStallCode && !editingContact) { // Only generate code for new tea stall contacts
            data.teaStallCode = generate5DigitCode();
        } else if (data.purpose !== 'teaStall') {
            data.teaStallCode = '';
        }
        setFormData(data);
    }, [editingContact, extractedContactData]);


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handlePurposeChange = (purpose) => {
        const newFormData = { ...formData, purpose };

        // Clear specific fields when purpose changes
        const fieldsToClear = new Set();
        Object.entries(purposeSpecificFields).forEach(([purposeKey, sections]) => {
          if (purposeKey !== purpose) {
            sections.forEach(section => {
              section.fields.forEach(field => fieldsToClear.add(field.id));
            });
          }
        });

        fieldsToClear.forEach(fieldId => {
            if (fieldId.includes('Followers') || fieldId.includes('Price')) {
                newFormData[fieldId] = ''; // Numbers become empty string
            } else {
                newFormData[fieldId] = '';
            }
        });

        // Handle teaStallCode generation on purpose switch for new contacts
        if (purpose === 'teaStall' && !editingContact && !newFormData.teaStallCode) {
            newFormData.teaStallCode = generate5DigitCode();
        } else if (purpose !== 'teaStall' && newFormData.teaStallCode) {
            newFormData.teaStallCode = '';
        }

        setFormData(newFormData);
    };

    const handleFetchLocation = async () => {
        displayMessage('Fetching current location...', true);
        const submitBtn = document.getElementById('submit-contact-btn');
        const fetchBtn = document.getElementById('fetch-location-btn');
        if (submitBtn) submitBtn.disabled = true;
        if (fetchBtn) {
            fetchBtn.disabled = true;
            fetchBtn.innerHTML = `${Icons.MapPin} Fetching...`;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ ...prev, location: `Latitude: ${latitude}, Longitude: ${longitude}` }));
                displayMessage('Location coordinates filled!', true);
                if (submitBtn) submitBtn.disabled = false;
                if (fetchBtn) {
                    fetchBtn.disabled = false;
                    fetchBtn.innerHTML = `${Icons.MapPin} Fetch Location`;
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                displayMessage(`Geolocation error: ${error.message || 'An unknown geolocation error occurred'}. Please enable location services.`, false);
                if (submitBtn) submitBtn.disabled = false;
                if (fetchBtn) {
                    fetchBtn.disabled = false;
                    fetchBtn.innerHTML = `${Icons.MapPin} Fetch Location`;
                }
            });
        } else {
            displayMessage('Geolocation is not supported by your browser.', false);
            if (submitBtn) submitBtn.disabled = false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        displayMessage('Processing...', true);
        const submitBtn = document.getElementById('submit-contact-btn');
        if (submitBtn) submitBtn.disabled = true;

        const dataToSend = { ...formData };

        // Validation
        if (dataToSend.purpose !== 'teaStall' && !dataToSend.name) {
            displayMessage('Name is required for this contact purpose.', false);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }
        if (dataToSend.purpose === 'teaStall' && (!dataToSend.teaStallName || !dataToSend.teaStallOwnerName || !dataToSend.teaStallMobileNumber)) {
            displayMessage('Tea Stall Name, Owner Name, and Mobile Number are required for Tea Stall contacts.', false);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        // Convert number fields to actual numbers
        ['xTwitterFollowers', 'facebookFollowers', 'youtubeFollowers', 'instagramFollowers', 'teaStallTeaPowderPrice'].forEach(key => {
            dataToSend[key] = dataToSend[key] ? Number(dataToSend[key]) : null;
        });

        // Handle special case for 'name' and 'phone' if purpose is 'teaStall'
        if (dataToSend.purpose === 'teaStall') {
            dataToSend.name = dataToSend.teaStallName;
            dataToSend.phone = dataToSend.teaStallMobileNumber;
        }

        dataToSend.timestamp = new Date().toISOString();

        try {
            let response;
            if (editingContact) {
                response = await fetch(`${API_BASE_URL}/contacts/${editingContact.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
            } else {
                dataToSend.id = generateUniqueId(); // Assign unique ID for new contact
                response = await fetch(`${API_BASE_URL}/contacts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save contact');
            }

            displayMessage(`Contact ${editingContact ? 'updated' : 'added'} successfully!`, true);
            setEditingContact(null); // Clear editing state
            setExtractedContactData(null); // Clear extracted data
            setFormData({ purpose: 'general', teaStallCode: generate5DigitCode() }); // Reset form
            setOverallActiveSubMenu('listContacts'); // Go back to contact list
        } catch (error) {
            console.error('Error saving contact:', error);
            displayMessage(`Error: ${error.message}. Please try again.`, false);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    };

    const contactPurposes = [
        { value: 'general', label: 'General' },
        { value: 'distributor', label: 'Distributor' },
        { value: 'influencer', label: 'Influencer' },
        { value: 'political', label: 'Political' },
        { value: 'celebrity', label: 'Celebrity' },
        { value: 'serviceProvider', label: 'Service Provider' },
        { value: 'customer', label: 'Customer' },
        { value: 'teaStall', label: 'Tea Stall' },
    ];

    const commonFields = [
        { id: 'name', label: 'Name', type: 'text', required: true, excludeForPurpose: ['teaStall'] },
        { id: 'phone', label: 'Mobile', type: 'tel', excludeForPurpose: ['teaStall'] },
        { id: 'email', label: 'Email', type: 'email', excludeForPurpose: ['teaStall'] },
        { id: 'company', label: 'Company', type: 'text', excludeForPurpose: ['teaStall', 'influencer', 'political', 'celebrity', 'serviceProvider', 'customer'] },
        { id: 'address', label: 'Address (Street, Zip)', type: 'text' },
        { id: 'city', label: 'City', type: 'text' },
        { id: 'state', label: 'State', type: 'select', options: [{ value: '', label: 'Select State' }, ...states.map(s => ({ value: s, label: s }))], className: 'bg-white' },
        { id: 'district', label: 'District', type: 'select', options: [], disabled: true, className: 'bg-white' }, // Options populated dynamically
        { id: 'location', label: 'Location (Auto-fill or Manual)', type: 'location_input', placeholder: 'e.g., Current position, Office address' },
        { id: 'nativeLanguage', label: 'Native Language', type: 'text', placeholder: 'e.g., Telugu, Hindi' },
        { id: 'remarks', label: 'Remarks', type: 'textarea' },
        { id: 'notes', label: 'Notes', type: 'textarea' },
    ];

    const purposeSpecificFields = {
        influencer: [
            { sectionTitle: 'Influencer Social Media Profiles', sectionColor: 'purple', fields: [
                { id: 'xTwitterProfileName', label: 'X (Twitter) Profile Name', type: 'text', placeholder: 'e.g., JohnDoeOfficial', sectionClasses: 'md:col-span-1' },
                { id: 'xTwitterFollowers', label: 'Followers', type: 'number', placeholder: 'e.g., 5000', min: '0', sectionClasses: 'md:col-span-1' },
                { id: 'x_twitter', label: 'X (Twitter) Profile URL', type: 'url', placeholder: 'e.g., https://x.com/username', sectionClasses: 'md:col-span-1' },
                { id: 'facebookProfileName', label: 'Facebook Profile Name', type: 'text', placeholder: 'e.g., JohnDoePage', sectionClasses: 'md:col-span-1' },
                { id: 'facebookFollowers', label: 'Followers', type: 'number', placeholder: 'e.g., 10000', min: '0', sectionClasses: 'md:col-span-1' },
                { id: 'facebook', label: 'Facebook Profile URL', type: 'url', placeholder: 'e.g., https://facebook.com/username', sectionClasses: 'md:col-span-1' },
                { id: 'youtubeChannelName', label: 'YouTube Channel Name', type: 'text', placeholder: 'e.g., MyVlogChannel', sectionClasses: 'md:col-span-1' },
                { id: 'youtubeFollowers', label: 'Subscribers', type: 'number', placeholder: 'e.g., 50000', min: '0', sectionClasses: 'md:col-span-1' },
                { id: 'youtube', label: 'YouTube Channel URL', type: 'url', placeholder: 'e.g., https://youtube.com/channel/...', sectionClasses: 'md:col-span-1' },
                { id: 'instagramProfileName', label: 'Instagram Profile Name', type: 'text', placeholder: 'e.g., MyInstaLife', sectionClasses: 'md:col-span-1' },
                { id: 'instagramFollowers', label: 'Followers', type: 'number', placeholder: 'e.g., 20000', min: '0', sectionClasses: 'md:col-span-1' },
                { id: 'instagram', label: 'Instagram Profile URL', type: 'url', placeholder: 'e.g., https://instagram.com/username', sectionClasses: 'md:col-span-1' },
            ]}
        ],
        political: [
            { sectionTitle: 'Political Contact Fields', sectionColor: 'red', fields: [
                { id: 'paMobileNumber', label: 'PA Mobile Number', type: 'tel' },
                { id: 'constituency', label: 'Constituency', type: 'text' },
                { id: 'politicalPartyName', label: 'Political Party Name', type: 'text' },
            ]}
        ],
        celebrity: [
            { sectionTitle: 'Celebrity Contact Fields', sectionColor: 'teal', fields: [
                { id: 'managerMobileNumber', label: 'Manager Mobile Number', type: 'tel' },
                { id: 'profession', label: 'Profession', type: 'text' },
            ]}
        ],
        serviceProvider: [
            { sectionTitle: 'Service Provider Fields', sectionColor: 'blue', fields: [
                { id: 'serviceType', label: 'Service Type', type: 'text', placeholder: 'e.g., Advertising, Stock Supply' },
                { id: 'serviceContactPerson', label: 'Service Contact Person', type: 'text', placeholder: 'Name of contact at service company' },
                { id: 'lastInteractionDate', label: 'Last Interaction Date', type: 'date' },
                { id: 'contractDetails', label: 'Contract Details', type: 'textarea', placeholder: 'Summary of contract, terms, etc.' },
            ]}
        ],
        teaStall: [
            { sectionTitle: 'Tea Stall Details', sectionColor: 'amber', fields: [
                { id: 'teaStallCode', label: 'Tea Stall Code', type: 'text', className: 'bg-gray-100', disabled: true },
                { id: 'teaStallName', label: 'Tea Stall Name', type: 'text', required: true },
                { id: 'teaStallOwnerName', label: 'Owner Name', type: 'text', required: true },
                { id: 'teaStallMobileNumber', label: 'Mobile Number', type: 'tel', required: true },
                { id: 'teaStallArea', label: 'Area', type: 'text' },
                { id: 'teaStallMandal', label: 'Mandal', type: 'text' },
                { id: 'teaStallTeaPowderPrice', label: 'Tea Powder Price (per Kg)', type: 'number', min: '0', step: '0.01' },
                { id: 'teaStallOtherSellingItems', label: 'Other Selling Items (comma-separated)', type: 'textarea', rows: '2', placeholder: 'e.g., Biscuits, Snacks, Water Bottles' },
            ]}
        ],
        distributor: [
            { sectionTitle: 'Distributor Specific Fields', sectionColor: 'red', fields: [
                { id: 'distributorTerritory', label: 'Territory', type: 'text', placeholder: 'e.g., North India, EMEA' },
            ]}
        ],
        customer: [
            { sectionTitle: 'Customer Specific Fields', sectionColor: 'orange', fields: [
                { id: 'customerType', label: 'Customer Type', type: 'select', options: [{ value: '', label: 'Select Type' }, { value: 'lead', label: 'Lead' }, { value: 'active', label: 'Active' }, { value: 'churned', label: 'Churned' }] },
            ]}
        ]
    };

    const getFieldsForPurpose = (purpose) => {
        const fields = [...commonFields];
        const purposeSpecific = purposeSpecificFields[purpose];

        if (purposeSpecific) {
            purposeSpecific.forEach(section => {
                if (section.sectionTitle) {
                    fields.push({ id: `section_title_${section.sectionColor}`, type: 'sectionTitle', title: section.sectionTitle, color: section.sectionColor });
                }
                fields.push(...section.fields);
            });
        }
        return fields.filter(field => !field.excludeForPurpose || !field.excludeForPurpose.includes(purpose));
    };

    const renderFormField = (field) => {
        const value = formData[field.id] !== undefined ? formData[field.id] : '';
        const disabledAttr = field.disabled || (field.id === 'district' && !formData.state); // District is disabled if no state
        const requiredAttr = field.required;
        const minAttr = field.min !== undefined ? field.min : undefined;
        const stepAttr = field.step !== undefined ? field.step : undefined;
        const placeholderAttr = field.placeholder;
        const className = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${field.className || ''}`;

        let inputElement;
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'url':
            case 'date':
                inputElement = (
                    <input
                        type={field.type}
                        id={field.id}
                        value={value}
                        onChange={handleChange}
                        className={className}
                        placeholder={placeholderAttr}
                        required={requiredAttr}
                        disabled={disabledAttr}
                    />
                );
                break;
            case 'number':
                inputElement = (
                    <input
                        type="number"
                        id={field.id}
                        value={value}
                        onChange={handleChange}
                        className={className}
                        placeholder={placeholderAttr}
                        required={requiredAttr}
                        disabled={disabledAttr}
                        min={minAttr}
                        step={stepAttr}
                    />
                );
                break;
            case 'textarea':
                inputElement = (
                    <textarea
                        rows="3"
                        id={field.id}
                        value={value}
                        onChange={handleChange}
                        className={`${className} resize-y`}
                        placeholder={placeholderAttr}
                        required={requiredAttr}
                        disabled={disabledAttr}
                    ></textarea>
                );
                break;
            case 'select':
                let options = field.options;
                if (field.id === 'district' && formData.state) {
                    const districts = indianStatesAndDistricts[formData.state] || [];
                    options = [{ value: '', label: 'Select District' }, ...districts.map(d => ({ value: d, label: d }))];
                }
                inputElement = (
                    <select
                        id={field.id}
                        value={value}
                        onChange={handleChange}
                        className={`${className} bg-white`}
                        required={requiredAttr}
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
                break;
            case 'location_input':
                inputElement = (
                    <div className="flex items-center mt-1">
                        <input
                            type="text"
                            id={field.id}
                            value={value}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder={placeholderAttr}
                            disabled={disabledAttr}
                        />
                        <button
                            type="button"
                            id="fetch-location-btn"
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-r-md shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap flex items-center"
                            onClick={handleFetchLocation}
                            disabled={disabledAttr}
                        >
                            {Icons.MapPin} Fetch Location
                        </button>
                    </div>
                );
                break;
            default:
                return null;
        }

        return (
            <div className={field.sectionClasses || ''}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}:</label>
                {inputElement}
            </div>
        );
    };

    const fieldsToRender = getFieldsForPurpose(formData.purpose);
    let renderedFormContent = [];
    let currentSectionContent = [];
    let currentSectionTitle = '';
    let currentSectionColor = '';

    fieldsToRender.forEach((field, index) => {
        if (field.type === 'sectionTitle') {
            if (currentSectionContent.length > 0) {
                renderedFormContent.push(
                    <div key={`section-${currentSectionTitle}-${index}`} className={`flex flex-col space-y-4 border border-${currentSectionColor}-200 p-4 rounded-md bg-${currentSectionColor}-50 mt-6`}>
                        <h3 className={`text-lg font-semibold text-${currentSectionColor}-800 mb-3`}>{currentSectionTitle}</h3>
                        {currentSectionContent}
                    </div>
                );
                currentSectionContent = [];
            }
            currentSectionTitle = field.title;
            currentSectionColor = field.color;
        } else {
            const fieldElement = renderFormField(field);
            if (fieldElement) {
                if (field.sectionClasses && field.sectionClasses.includes('grid-cols-')) {
                    // If a field dictates its own grid structure, add it directly
                    renderedFormContent.push(fieldElement);
                } else if (currentSectionTitle) {
                    currentSectionContent.push(fieldElement);
                } else {
                    renderedFormContent.push(fieldElement);
                }
            }
        }
    });

    if (currentSectionContent.length > 0) {
        renderedFormContent.push(
            <div key={`last-section`} className={`flex flex-col space-y-4 border border-${currentSectionColor}-200 p-4 rounded-md bg-${currentSectionColor}-50 mt-6`}>
                <h3 className={`text-lg font-semibold text-${currentSectionColor}-800 mb-3`}>{currentSectionTitle}</h3>
                {currentSectionContent}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h2>

            <div className="mb-6">
                <label htmlFor="contactPurpose" className="block text-sm font-medium text-gray-700 mb-2">Select Contact Purpose:</label>
                <div className="flex flex-wrap gap-3">
                    {contactPurposes.map(p => (
                        <button
                            key={p.value}
                            type="button"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                                formData.purpose === p.value ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => handlePurposeChange(p.value)}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {renderedFormContent}
                <button
                    type="submit"
                    id="submit-contact-btn"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {editingContact ? Icons.Edit : Icons.Plus} {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                {editingContact && (
                    <button
                        type="button"
                        id="cancel-edit-btn"
                        className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center"
                        onClick={() => {
                            setEditingContact(null);
                            setExtractedContactData(null);
                            setOverallActiveSubMenu('listContacts');
                        }}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
};

// --- ProductList Component ---
const ProductList = ({ setOverallActiveSubMenu, setProductToEdit, displayMessage }) => {
    const [products, setProducts] = useState([]);
    const [filterField, setFilterField] = useState('productName');
    const [filterValue, setFilterValue] = useState('');

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            displayMessage('Failed to load products. Please check your backend connection.', false);
        }
    }, [displayMessage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getProductPlaceholder = (field) => {
        switch (field) {
            case 'productName': return 'Enter product name...';
            case 'category': return 'Enter category...';
            case 'supplierName': return 'Enter supplier name...';
            case 'supplierAddress': return 'Enter supplier address...';
            case 'supplierContactNumber': return 'Enter supplier contact number...';
            case 'supplierLocation': return 'Enter supplier location...';
            default: return 'Search...';
        }
    };

    const handleDeleteProductClick = (id) => {
        showConfirmationModal(
            "Are you sure you want to delete this product? This action cannot be undone.",
            async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Failed to delete product');
                    displayMessage('Product deleted successfully!', true);
                    fetchProducts(); // Refresh list after deletion
                } catch (error) {
                    console.error('Error deleting product:', error);
                    displayMessage('Failed to delete product.', false);
                }
            }
        );
    };

    const filteredProducts = products.filter(product => {
        if (!filterValue) return true;
        const value = String(product[filterField] || '').toLowerCase();
        return value.includes(filterValue.toLowerCase());
    }).sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Products</h2>
            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Filter Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="productFilterField" className="block text-sm font-medium text-gray-700">Filter by Field:</label>
                        <select
                            id="productFilterField"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            value={filterField}
                            onChange={(e) => {
                                setFilterField(e.target.value);
                                setFilterValue('');
                            }}
                        >
                            <option value="productName">Product Name</option>
                            <option value="category">Category</option>
                            <option value="supplierName">Supplier Name</option>
                            <option value="supplierAddress">Supplier Address</option>
                            <option value="supplierContactNumber">Supplier Contact Number</option>
                            <option value="supplierLocation">Supplier Location</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="productFilterValue" className="block text-sm font-medium text-gray-700">Value:</label>
                        <input
                            type="text"
                            id="productFilterValue"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder={getProductPlaceholder(filterField)}
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {products.length === 0 ? (
                <p className="text-gray-600">No products found. Add one using the "Add Product" tab!</p>
            ) : filteredProducts.length === 0 ? (
                <p className="text-gray-600">No products match your filters.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredProducts.map(product => (
                        <li key={product.id} className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex-grow space-y-1">
                                <p className="text-lg font-semibold text-gray-900 flex items-center">{Icons.Package} {product.productName} (<span className="capitalize">{product.category}</span>)</p>
                                <p className="text-gray-700 text-sm flex items-center">{Icons.User} Supplier: {product.supplierName}</p>
                                {product.supplierAddress && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} Address: {product.supplierAddress}</p>}
                                {product.supplierContactNumber && <p className="text-gray-700 text-sm flex items-center">{Icons.Phone} Contact: {product.supplierContactNumber}</p>}
                                {product.supplierLocation && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} Location: {product.supplierLocation}</p>}
                                <p className="text-gray-700 text-sm flex items-center">{Icons.Download} Wholesale Price: ₹{product.wholesalePrice} {product.wholesalePriceUnit ? `per ${product.wholesalePriceUnit}` : ''}</p>
                                <p className="text-gray-700 text-sm flex items-center">{Icons.Upload} Retail Price: ₹{product.retailPrice} {product.retailPriceUnit ? `per ${product.retailPriceUnit}` : ''}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 justify-end">
                                <button
                                    className="edit-product-btn flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md"
                                    onClick={() => {
                                        setProductToEdit(product);
                                        setOverallActiveSubMenu('addProduct');
                                    }}
                                >
                                    {Icons.Edit} Edit
                                </button>
                                <button
                                    className="delete-product-btn flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md"
                                    onClick={() => handleDeleteProductClick(product.id)}
                                >
                                    {Icons.Trash2} Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- AddEditProduct Component ---
const AddEditProduct = ({ productToEdit, setProductToEdit, setOverallActiveSubMenu, displayMessage }) => {
    const initialFormData = productToEdit || {};

    const [formData, setFormData] = useState(() => {
        const data = JSON.parse(JSON.stringify(initialFormData));
        // Ensure number fields are strings for input value
        ['wholesalePrice', 'retailPrice'].forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                data[key] = String(data[key]);
            } else {
                data[key] = '';
            }
        });
        return data;
    });

    useEffect(() => {
        const data = JSON.parse(JSON.stringify(productToEdit || {}));
        ['wholesalePrice', 'retailPrice'].forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                data[key] = String(data[key]);
            } else {
                data[key] = '';
            }
        });
        setFormData(data);
    }, [productToEdit]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        displayMessage('Processing...', true);
        const submitBtn = document.getElementById('submit-product-btn');
        if (submitBtn) submitBtn.disabled = true;

        const dataToSend = { ...formData };

        const requiredFields = [
            { id: 'productName', label: 'Product Name' },
            { id: 'category', label: 'Category' },
            { id: 'supplierName', label: 'Supplier Name' },
            { id: 'wholesalePrice', label: 'Wholesale Price' },
            { id: 'retailPrice', label: 'Retail Price' },
        ];

        for (let field of requiredFields) {
            if (!dataToSend[field.id]) {
                displayMessage(`Please fill in ${field.label}.`, false);
                if (submitBtn) submitBtn.disabled = false;
                return;
            }
        }

        dataToSend.wholesalePrice = Number(dataToSend.wholesalePrice);
        dataToSend.retailPrice = Number(dataToSend.retailPrice);
        dataToSend.timestamp = new Date().toISOString();

        try {
            let response;
            if (productToEdit) {
                response = await fetch(`${API_BASE_URL}/products/${productToEdit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
            } else {
                dataToSend.id = generateUniqueId(); // Assign unique ID for new product
                response = await fetch(`${API_BASE_URL}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save product');
            }

            displayMessage(`Product ${productToEdit ? 'updated' : 'added'} successfully!`, true);
            setProductToEdit(null); // Clear editing state
            setFormData({
                productName: '', category: '', supplierName: '', supplierAddress: '',
                supplierContactNumber: '', supplierLocation: '', wholesalePrice: '',
                wholesalePriceUnit: 'unit', retailPrice: '', retailPriceUnit: 'unit',
            }); // Reset form
            setOverallActiveSubMenu('listProducts'); // Go back to product list
        } catch (error) {
            console.error('Error saving product:', error);
            displayMessage(`Error: ${error.message}. Please try again.`, false);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    };

    const productFields = [
        { id: 'productName', label: 'Product Name', type: 'text', required: true },
        { id: 'category', label: 'Category', type: 'text', required: true },
        { id: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
        { id: 'supplierAddress', label: 'Supplier Address', type: 'text' },
        { id: 'supplierContactNumber', label: 'Supplier Contact Number', type: 'tel' },
        { id: 'supplierLocation', label: 'Supplier Location', type: 'text' },
        { id: 'wholesalePrice', label: 'Wholesale Price', type: 'number', required: true, min: '0', step: '0.01', sectionClasses: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        { id: 'wholesalePriceUnit', label: 'Unit', type: 'select', options: [{ value: 'unit', label: 'Per Unit' }, { value: 'kg', label: 'Per Kg' }, { value: 'litre', label: 'Per Litre' }], sectionClasses: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        { id: 'retailPrice', label: 'Retail Price', type: 'number', required: true, min: '0', step: '0.01', sectionClasses: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        { id: 'retailPriceUnit', label: 'Unit', type: 'select', options: [{ value: 'unit', label: 'Per Unit' }, { value: 'kg', label: 'Per Kg' }, { value: 'litre', label: 'Per Litre' }], sectionClasses: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {productFields.map(field => {
                    const value = formData[field.id] !== undefined ? formData[field.id] : '';
                    const className = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${field.className || ''}`;

                    let inputElement;
                    switch (field.type) {
                        case 'text':
                        case 'tel':
                        case 'url':
                            inputElement = (
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={value}
                                    onChange={handleChange}
                                    className={className}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    disabled={field.disabled}
                                />
                            );
                            break;
                        case 'number':
                            inputElement = (
                                <input
                                    type="number"
                                    id={field.id}
                                    value={value}
                                    onChange={handleChange}
                                    className={className}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    disabled={field.disabled}
                                    min={field.min}
                                    step={field.step}
                                />
                            );
                            break;
                        case 'select':
                            inputElement = (
                                <select
                                    id={field.id}
                                    value={value}
                                    onChange={handleChange}
                                    className={`${className} bg-white`}
                                    required={field.required}
                                    disabled={field.disabled}
                                >
                                    {field.options.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            );
                            break;
                        default:
                            return null;
                    }

                    return (
                        <div key={field.id} className={field.sectionClasses || ''}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}:</label>
                            {inputElement}
                        </div>
                    );
                })}
                <button
                    type="submit"
                    id="submit-product-btn"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {productToEdit ? Icons.Edit : Icons.Plus} {productToEdit ? 'Update Product' : 'Add Product'}
                </button>
                {productToEdit && (
                    <button
                        type="button"
                        id="cancel-product-edit-btn"
                        className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center"
                        onClick={() => {
                            setProductToEdit(null);
                            setOverallActiveSubMenu('listProducts');
                        }}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
};


// --- ExtractContact Component ---
const ExtractContact = ({ setOverallActiveSubMenu, setExtractedContactData, displayMessage }) => {
    const [textToExtract, setTextToExtract] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    const handleExtract = async () => {
        setIsExtracting(true);
        displayMessage('Extracting...', true);

        if (!textToExtract.trim()) {
            displayMessage('Please paste some text to extract contact info.', false);
            setIsExtracting(false);
            return;
        }

        try {
            const prompt = `Extract the following details from the text:
            - Name
            - Phone number
            - Email address
            - Street address
            - City
            - State
            - District
            - Location (General geographical area or specific address if available, beyond street/city/state/district)
            - Company name
            - Native language
            - Purpose (Can be 'general', 'distributor', 'influencer', 'political', 'celebrity', 'serviceProvider', 'customer', 'teaStall' if inferable from context, otherwise default to 'general')
            - Remarks (any general notes or comments at the end)
            - Notes (any additional notes)
            - X (Twitter) profile URL and its associated profile name
            - Facebook profile URL and its associated profile name
            - YouTube channel URL and its associated channel name
            - Instagram profile URL and its associated channel name
            - PA Mobile Number (if applicable for political contacts)
            - Constituency (if applicable for political contacts)
            - Political Party Name (if applicable for political contacts)
            - Manager Mobile Number (if applicable for celebrity contacts)
            - Profession (if applicable for celebrity contacts)
            - Service Type (if applicable for service providers, e.g., advertising, sales, stock supply)
            - Service Contact Person (if applicable for service providers)
            - Last Interaction Date (if applicable for service providers, in,"%Y-%M-%D" format if possible)
            - Contract Details (if applicable for service providers)
            - Tea Stall Name (if applicable for tea stall contacts)
            - Tea Stall Owner Name (if applicable for tea stall contacts)
            - Tea Stall Mobile Number (if applicable for tea stall contacts, distinct from general phone)
            - Tea Stall Area (if applicable for tea stall contacts)
            - Tea Stall Mandal (if applicable for tea stall contacts)
            - Tea Powder Price (if applicable for tea stall contacts)
            - Other Selling Items (if applicable for tea stall contacts)

            If a field is not found, return an empty string for that field. Do NOT try to extract follower counts, as that is a manual field. Do NOT try to extract Tea Stall Code, as that is auto-generated by the app.

            Return the output as a JSON object with keys:
            name, phone, email, address, city, state, district, location, company, nativeLanguage, purpose, remarks, notes,
            x_twitter, xTwitterProfileName, facebook, facebookProfileName, youtube, youtubeChannelName, instagram, instagramProfileName,
            paMobileNumber, constituency, politicalPartyName, managerMobileNumber, profession,
            serviceType, serviceContactPerson, lastInteractionDate, contractDetails,
            teaStallName, teaStallOwnerName, teaStallMobileNumber, teaStallArea, teaStallMandal, teaStallTeaPowderPrice, teaStallOtherSellingItems.

            Text:
            "${textToExtract}"`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = {
                contents: chatHistory,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "name": { "type": "STRING" },
                            "phone": { "type": "STRING" },
                            "email": { "type": "STRING" },
                            "address": { "type": "STRING" },
                            "city": { "type": "STRING" },
                            "state": { "type": "STRING" },
                            "district": { "type": "STRING" },
                            "location": { "type": "STRING" },
                            "company": { "type": "STRING" },
                            "nativeLanguage": { "type": "STRING" },
                            "purpose": { "type": "STRING" },
                            "remarks": { "type": "STRING" },
                            "notes": { "type": "STRING" },
                            "x_twitter": { "type": "STRING" },
                            "xTwitterProfileName": { "type": "STRING" },
                            "facebook": { "type": "STRING" },
                            "facebookProfileName": { "type": "STRING" },
                            "youtube": { "type": "STRING" },
                            "youtubeChannelName": { "type": "STRING" },
                            "instagram": { "type": "STRING" },
                            "instagramProfileName": { "type": "STRING" },
                            "paMobileNumber": { "type": "STRING" },
                            "constituency": { "type": "STRING" },
                            "politicalPartyName": { "type": "STRING" },
                            "managerMobileNumber": { "type": "STRING" },
                            "profession": { "type": "STRING" },
                            "serviceType": { "type": "STRING" },
                            "serviceContactPerson": { "type": "STRING" },
                            "lastInteractionDate": { "type": "STRING" },
                            "contractDetails": { "type": "STRING" },
                            "teaStallName": { "type": "STRING" },
                            "teaStallOwnerName": { "type": "STRING" },
                            "teaStallMobileNumber": { "type": "STRING" },
                            "teaStallArea": { "type": "STRING" },
                            "teaStallMandal": { "type": "STRING" },
                            "teaStallTeaPowderPrice": { "type": "NUMBER" },
                            "teaStallOtherSellingItems": { "type": "STRING" }
                        },
                        required: [
                          "name", "phone", "email", "address", "city", "state", "district", "location",
                          "company", "notes", "nativeLanguage", "remarks", "purpose",
                          "x_twitter", "xTwitterProfileName", "facebook", "facebookProfileName",
                          "youtube", "youtubeChannelName", "instagram", "instagramProfileName",
                          "paMobileNumber", "constituency", "politicalPartyName", "managerMobileNumber", "profession",
                          "serviceType", "serviceContactPerson", "lastInteractionDate", "contractDetails",
                          "teaStallName", "teaStallOwnerName", "teaStallMobileNumber", "teaStallArea", "teaStallMandal", "teaStallTeaPowderPrice", "teaStallOtherSellingItems"
                        ]
                    }
                }
            };
            const apiKey = ""; // Canvas will provide this at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(payload)
                   });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonString = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(jsonString);

                if (!parsedJson.purpose) {
                    parsedJson.purpose = 'general';
                }
                setExtractedContactData(parsedJson); // Store for AddEditContact
                displayMessage('Contact info extracted! Switching to Add New Contact tab...', true);
                setTextToExtract(''); // Clear text area
                setOverallActiveSubMenu('addContact'); // Switch sub menu to add contact form
            } else {
                displayMessage('Could not extract contact info. Please try again or enter manually.', false);
                console.warn("Unexpected API response structure:", result);
            }
        } catch (e) {
            console.error("Error calling Gemini API for extraction:", e);
            displayMessage('Error extracting info. Please check your input and try again.', false);
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">{Icons.Clipboard} Extract Contact Info from Text</h2>
            <p className="text-gray-600 mb-4">
                Paste text containing contact details (e.g., from an email signature, a document)
                to automatically populate a new contact form using AI.
            </p>
            <textarea
                id="extracted-text-input"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-y"
                rows="8"
                placeholder="Paste text here (e.g., John Doe, +1234567890, john.doe@example.com, CEO at Example Corp, 123 Main St, New York, NY, USA, California, Los Angeles, Native Language: English, Purpose: Distributor, Remarks: Follow up next week, X: @JohnDoeOfficial, YT: MyGamingChannel, Tea Stall Name: Chai Spot, Owner: Ram Kumar, Mobile: 9876543210, Area: Sector 10, Mandal: Gachibowli, Tea Powder Price: 250, Other Items: Samosa, Biscuits)"
                value={textToExtract}
                onChange={(e) => setTextToExtract(e.target.value)}
                disabled={isExtracting}
            ></textarea>
            <button
                id="extract-info-btn"
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleExtract}
                disabled={isExtracting}
            >
                {Icons.Clipboard} {isExtracting ? 'Extracting...' : 'Extract Info'}
            </button>
        </div>
    );
};

// --- BackupRestore Component ---
const BackupRestore = ({ displayMessage }) => {
    const [backups, setBackups] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false); // For backup and restore operations

    const fetchBackups = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/backups`);
            if (!response.ok) throw new Error('Failed to fetch backups');
            const data = await response.json();
            // Assuming backups are returned sorted by timestamp descending from backend
            setBackups(data);
        } catch (error) {
            console.error('Error fetching backups:', error);
            displayMessage('Failed to load backups. Please check your backend connection.', false);
        }
    }, [displayMessage]);

    useEffect(() => {
        fetchBackups();
    }, [fetchBackups]);

    const handleCreateBackup = async () => {
        setIsProcessing(true);
        displayMessage('Creating Backup...', true);
        try {
            const contactsResponse = await fetch(`${API_BASE_URL}/contacts`);
            const productsResponse = await fetch(`${API_BASE_URL}/products`);

            if (!contactsResponse.ok || !productsResponse.ok) {
                throw new Error('Failed to fetch current data for backup.');
            }

            const currentContacts = await contactsResponse.json();
            const currentProducts = await productsResponse.json();

            const newBackup = {
                id: generateUniqueId(),
                timestamp: new Date().toISOString(),
                contacts: JSON.stringify(currentContacts),
                products: JSON.stringify(currentProducts),
                contactCount: currentContacts.length,
                productCount: currentProducts.length,
            };

            const backupResponse = await fetch(`${API_BASE_URL}/backups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBackup)
            });

            if (!backupResponse.ok) {
                const errorData = await backupResponse.json();
                throw new Error(errorData.message || 'Failed to create backup.');
            }

            displayMessage(`Backup created successfully! Contacts: ${currentContacts.length}, Products: ${currentProducts.length}`, true);
            fetchBackups(); // Refresh the list of backups
        } catch (error) {
            console.error('Error during backup:', error);
            displayMessage(`Error creating backup: ${error.message}`, false);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExportCsv = async () => {
        setIsProcessing(true);
        displayMessage('Exporting CSV...', true);
        try {
            const contactsResponse = await fetch(`${API_BASE_URL}/contacts`);
            if (!contactsResponse.ok) throw new Error('Failed to fetch contacts for CSV export');
            const currentContacts = await contactsResponse.json();

            if (currentContacts.length === 0) {
                displayMessage('No contacts to export.', false);
                setIsProcessing(false);
                return;
            }

            const headers = [
                'name', 'phone', 'email', 'company', 'address', 'city', 'state', 'district', 'location', 'nativeLanguage', 'purpose',
                'x_twitter', 'xTwitterProfileName', 'xTwitterFollowers',
                'facebook', 'facebookProfileName', 'facebookFollowers', 'youtube', 'youtubeChannelName', 'youtubeFollowers',
                'instagram', 'instagramProfileName', 'instagramFollowers',
                'paMobileNumber', 'constituency', 'politicalPartyName', 'managerMobileNumber', 'profession',
                'serviceType', 'serviceContactPerson', 'lastInteractionDate', 'contractDetails',
                'teaStallCode', 'teaStallName', 'teaStallOwnerName', 'teaStallMobileNumber', 'teaStallArea', 'teaStallMandal', 'teaStallTeaPowderPrice', 'teaStallOtherSellingItems',
                'remarks', 'notes'
            ];
            const csvRows = [];

            csvRows.push(headers.map(header => `"${header}"`).join(','));

            currentContacts.forEach(contact => {
                const row = headers.map(header => {
                    const value = contact[header];
                    if (value === null || value === undefined) {
                        return '""';
                    }
                    if (typeof value === 'number') {
                        return value;
                    }
                    return `"${String(value).replace(/"/g, '""')}"`;
                });
                csvRows.push(row.join(','));
            });

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'private_contacts_backup.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href); // Clean up URL object

            displayMessage('Contacts exported to CSV successfully!', true);
        } catch (e) {
            console.error("Error exporting CSV:", e);
            displayMessage(`Error exporting contacts to CSV: ${e.message}`, false);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRestore = (backupId) => {
        showConfirmationModal(
            "Restoring this backup will *add* new contacts and products from the backup to your current list. Existing contacts/products with identical key identifiers (name/phone/email for contacts, product name/supplier/category for products) will be skipped to avoid duplicates. Are you sure you want to proceed?",
            async () => {
                setIsProcessing(true);
                displayMessage('Restoring data...', true);
                try {
                    const selectedBackup = backups.find(b => b.id === backupId);

                    if (!selectedBackup) {
                        displayMessage('Selected backup not found.', false);
                        return;
                    }

                    const contactsToRestore = JSON.parse(selectedBackup.contacts || '[]');
                    const productsToRestore = JSON.parse(selectedBackup.products || '[]');

                    // Fetch current data to check for duplicates
                    const currentContactsResponse = await fetch(`${API_BASE_URL}/contacts`);
                    const currentProductsResponse = await fetch(`${API_BASE_URL}/products`);
                    if (!currentContactsResponse.ok || !currentProductsResponse.ok) {
                        throw new Error('Failed to fetch current data for duplicate check.');
                    }
                    const currentContacts = await currentContactsResponse.json();
                    const currentProducts = await currentProductsResponse.json();

                    let addedContactCount = 0;
                    let skippedContactCount = 0;

                    for (const contact of contactsToRestore) {
                        const isDuplicate = currentContacts.some(
                            existing =>
                                existing.name === contact.name &&
                                existing.phone === contact.phone &&
                                existing.email === contact.email &&
                                existing.teaStallCode === contact.teaStallCode
                        );

                        if (!isDuplicate) {
                            // Omit the MongoDB `_id` and `createdAt`/`updatedAt` if they exist in the backup,
                            // let the backend generate new ones.
                            const { _id, createdAt, updatedAt, ...contactData } = contact;
                            await fetch(`${API_BASE_URL}/contacts`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...contactData, id: generateUniqueId() })
                            });
                            addedContactCount++;
                        } else {
                            skippedContactCount++;
                        }
                    }

                    let addedProductCount = 0;
                    let skippedProductCount = 0;

                    for (const product of productsToRestore) {
                        const isDuplicate = currentProducts.some(
                            existing =>
                                existing.productName === product.productName &&
                                existing.supplierName === product.supplierName &&
                                existing.category === product.category
                        );

                        if (!isDuplicate) {
                            const { _id, createdAt, updatedAt, ...productData } = product;
                            await fetch(`${API_BASE_URL}/products`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...productData, id: generateUniqueId() })
                            });
                            addedProductCount++;
                        } else {
                            skippedProductCount++;
                        }
                    }

                    displayMessage(`Restore complete: Added ${addedContactCount} new contacts, skipped ${skippedContactCount} duplicates. Added ${addedProductCount} new products, skipped ${skippedProductCount} duplicates.`, true);
                    // No need to fetch contacts/products directly here, as React re-renders when state changes
                } catch (error) {
                    console.error("Error during restore:", error);
                    displayMessage(`Error restoring data: ${error.message}`, false);
                } finally {
                    setIsProcessing(false);
                }
            }
        );
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">{Icons.Sliders} Backup & Restore Data</h2>
            <p className="text-gray-600 mb-4">
                This feature allows you to back up your private contacts and products to your MongoDB database and restore them later.
                Each backup creates a snapshot of your current data.
            </p>

            <button
                id="create-backup-btn"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3 flex items-center justify-center"
                onClick={handleCreateBackup}
                disabled={isProcessing}
            >
                {Icons.Upload} {isProcessing ? 'Creating Backup...' : 'Create New Backup Now'}
            </button>

            <button
                id="export-csv-btn"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center"
                onClick={handleExportCsv}
                disabled={isProcessing}
            >
                {Icons.Download} {isProcessing ? 'Exporting...' : 'Export Contacts to CSV'}
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Available Backups</h3>
            {backups.length === 0 ? (
                <p className="text-gray-600">No backups found.</p>
            ) : (
                <ul className="space-y-3">
                    {backups.map(backup => (
                        <li key={backup.id} className="bg-gray-50 p-3 rounded-md shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900">Backup from: {new Date(backup.timestamp).toLocaleString()}</p>
                                <p className="text-sm text-gray-700">Contacts: {backup.contactCount}, Products: {backup.productCount || 0}</p>
                            </div>
                            <button
                                data-id={backup.id}
                                className="restore-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 shadow-md flex items-center"
                                onClick={() => handleRestore(backup.id)}
                                disabled={isProcessing}
                            >
                                {Icons.Download} Restore
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


// --- Main App Component ---
function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [pin, setPin] = useState(['', '', '', '']);
    const [pinMessage, setPinMessage] = useState('');
    const correctPin = "1357";

    const [activeMainMenu, setActiveMainMenu] = useState('contacts');
    const [activeSubMenu, setActiveSubMenu] = useState('listContacts');

    // States for data manipulation across components
    const [editingContact, setEditingContact] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [extractedContactData, setExtractedContactData] = useState(null);
    const [editingLink, setEditingLink] = useState(null);

    // State for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [confirmModalOnConfirm, setConfirmModalOnConfirm] = useState(null);

    // Generic message display for various operations
    const [appMessage, setAppMessage] = useState({ text: '', isError: false, show: false });

    const displayMessage = useCallback((text, isError) => {
        setAppMessage({ text, isError, show: true });
        setTimeout(() => {
            setAppMessage({ text: '', isError: false, show: false });
        }, 3000);
    }, []);

    const showConfirmationModal = useCallback((message, onConfirm) => {
        setConfirmModalMessage(message);
        setConfirmModalOnConfirm(() => onConfirm); // Use a functional update to store the callback
        setShowConfirmModal(true);
    }, []);

    const handleConfirmModalProceed = () => {
        if (confirmModalOnConfirm) {
            confirmModalOnConfirm();
        }
        setShowConfirmModal(false);
        setConfirmModalOnConfirm(null);
    };

    const handleConfirmModalCancel = () => {
        setShowConfirmModal(false);
        setConfirmModalOnConfirm(null);
    };

    const handlePinChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newPin = [...pin];
        newPin[index] = value.length > 1 ? value[value.length - 1] : value;
        setPin(newPin);
        setPinMessage('');

        if (newPin[index] && index < newPin.length - 1) {
            document.getElementById(`pin-input-${index + 1}`).focus();
        }

        if (newPin.join('').length === 4) {
            if (newPin.join('') === correctPin) {
                setPinMessage('Login successful!');
                setTimeout(() => {
                    setLoggedIn(true);
                }, 500);
            } else {
                setPinMessage('Incorrect PIN. Please try again.');
                setTimeout(() => {
                    setPin(['', '', '', '']);
                    document.getElementById('pin-input-0').focus();
                    setPinMessage('');
                }, 1000);
            }
        }
    };

    const handlePinKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            document.getElementById(`pin-input-${index - 1}`).focus();
        }
    };

    const subMenuItems = {
        contacts: [
            { name: 'Contacts List', id: 'listContacts', icon: Icons.List },
            { name: 'Add Contact', id: 'addContact', icon: Icons.Plus },
        ],
        products: [
            { name: 'Product List', id: 'listProducts', icon: Icons.List },
            { name: 'Add Product', id: 'addProduct', icon: Icons.Plus },
        ],
        mylinks: [
            { name: 'Links List', id: 'listLinks', icon: Icons.List },
            { name: 'Add Link', id: 'addLink', icon: Icons.Plus },
        ],
        tools: [
            { name: 'Extract Contact Info', id: 'extractContact', icon: Icons.Clipboard },
            { name: 'Backup & Restore', id: 'backupRestore', icon: Icons.Upload },
        ],
    };

    const renderMainContent = () => {
        switch (activeSubMenu) {
            case 'listContacts':
                return <ContactList setActiveSubMenu={setActiveSubMenu} setEditingContact={setEditingContact} displayMessage={displayMessage} showConfirmationModal={showConfirmationModal} />;
            case 'addContact':
                return <AddEditContact editingContact={editingContact} setEditingContact={setEditingContact} extractedContactData={extractedContactData} setExtractedContactData={setExtractedContactData} setOverallActiveSubMenu={setActiveSubMenu} displayMessage={displayMessage} />;
            case 'listProducts':
                return <ProductList setOverallActiveSubMenu={setActiveSubMenu} setProductToEdit={setProductToEdit} displayMessage={displayMessage} />;
            case 'addProduct':
                return <AddEditProduct productToEdit={productToEdit} setProductToEdit={setProductToEdit} setOverallActiveSubMenu={setActiveSubMenu} displayMessage={displayMessage} />;
            case 'listLinks':
                return <MyLinksList setActiveSubMenu={setActiveSubMenu} setEditingLink={setEditingLink} displayMessage={displayMessage} showConfirmationModal={showConfirmationModal} />;
            case 'addLink':
                return <AddEditLink editingLink={editingLink} setEditingLink={setEditingLink} setActiveSubMenu={setActiveSubMenu} displayMessage={displayMessage} />;
            case 'extractContact':
                return <ExtractContact setOverallActiveSubMenu={setActiveSubMenu} setExtractedContactData={setExtractedContactData} displayMessage={displayMessage} />;
            case 'backupRestore':
                return <BackupRestore displayMessage={displayMessage} />;
            default:
                return <div className="text-center text-gray-600">Select an option from the menu.</div>;
        }
    };

    if (!loggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-rose-700 p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center transform transition-all duration-300 scale-100 hover:scale-105">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
                        Welcome to VLN Contacts
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Please enter your 4-digit PIN to continue.
                    </p>
                    <div className="flex justify-center space-x-3 mb-6">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                id={`pin-input-${index}`}
                                type="password"
                                maxLength="1"
                                data-pin-index={index}
                                className="pin-input w-14 h-16 text-4xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 transition-all duration-200 outline-none shadow-sm"
                                inputMode="numeric"
                                pattern="[0-9]"
                                value={digit}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                onKeyDown={(e) => handlePinKeyDown(index, e)}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    <p className={`mt-6 text-lg font-semibold ${pinMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                        {pinMessage}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-red-50 flex flex-col font-sans text-gray-800">
            <header className="bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center z-10">
                <h1 className="text-3xl font-extrabold mb-3 sm:mb-0 flex items-center">
                    {Icons.Home}
                    VLN Contacts CRM
                </h1>
                <nav>
                    <ul className="flex flex-wrap justify-center gap-4">
                        <li>
                            <button
                                id="main-menu-contacts"
                                className={`flex items-center px-5 py-2 rounded-full font-semibold transition-all duration-300 ${activeMainMenu === 'contacts' ? 'bg-white text-red-700 shadow-md scale-105' : 'hover:bg-red-600 hover:scale-105'}`}
                                onClick={() => {
                                    setActiveMainMenu('contacts');
                                    setActiveSubMenu('listContacts');
                                    setProductToEdit(null);
                                    setExtractedContactData(null);
                                    setEditingContact(null);
                                    setEditingLink(null);
                                }}
                            >
                                {Icons.User} Contacts
                            </button>
                        </li>
                        <li>
                            <button
                                id="main-menu-products"
                                className={`flex items-center px-5 py-2 rounded-full font-semibold transition-all duration-300 ${activeMainMenu === 'products' ? 'bg-white text-red-700 shadow-md scale-105' : 'hover:bg-red-600 hover:scale-105'}`}
                                onClick={() => {
                                    setActiveMainMenu('products');
                                    setActiveSubMenu('listProducts');
                                    setExtractedContactData(null);
                                    setEditingContact(null);
                                    setProductToEdit(null);
                                    setEditingLink(null);
                                }}
                            >
                                {Icons.Package} Products
                            </button>
                        </li>
                        <li>
                            <button
                                id="main-menu-mylinks"
                                className={`flex items-center px-5 py-2 rounded-full font-semibold transition-all duration-300 ${activeMainMenu === 'mylinks' ? 'bg-white text-red-700 shadow-md scale-105' : 'hover:bg-red-600 hover:scale-105'}`}
                                onClick={() => {
                                    setActiveMainMenu('mylinks');
                                    setActiveSubMenu('listLinks');
                                    setEditingContact(null);
                                    setProductToEdit(null);
                                    setExtractedContactData(null);
                                    setEditingLink(null);
                                }}
                            >
                                {Icons.Link} My Links
                            </button>
                        </li>
                        <li>
                            <button
                                id="main-menu-tools"
                                className={`flex items-center px-5 py-2 rounded-full font-semibold transition-all duration-300 ${activeMainMenu === 'tools' ? 'bg-white text-red-700 shadow-md scale-105' : 'hover:bg-red-600 hover:scale-105'}`}
                                onClick={() => {
                                    setActiveMainMenu('tools');
                                    setActiveSubMenu('extractContact');
                                    setExtractedContactData(null);
                                    setEditingContact(null);
                                    setProductToEdit(null);
                                    setEditingLink(null);
                                }}
                            >
                                {Icons.Sliders} Tools
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="flex flex-1 flex-col lg:flex-row w-full max-w-6xl mx-auto py-6 px-4">
                <aside className="lg:w-1/4 mb-6 lg:mb-0 lg:mr-6 bg-white rounded-lg shadow-xl p-6">
                    <h3 className="text-xl font-bold text-red-700 mb-4 pb-2 border-b border-gray-200">
                        {activeMainMenu.charAt(0).toUpperCase() + activeMainMenu.slice(1)} Menu
                    </h3>
                    <nav>
                        <ul className="flex flex-col space-y-3">
                            {subMenuItems[activeMainMenu].map(item => (
                                <li key={item.id}>
                                    <button
                                        className={`flex items-center w-full text-left px-4 py-2 rounded-md font-medium transition-colors duration-200 ${activeSubMenu === item.id ? 'bg-red-100 text-red-800 shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'}`}
                                        onClick={() => setActiveSubMenu(item.id)}
                                    >
                                        {item.icon} {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
                        <span className="block font-semibold mb-1">Your User ID (Simulated):</span>
                        <span id="user-id-value" className="font-mono bg-gray-100 px-3 py-1 rounded-md text-xs break-all">anonymous-user-001</span>
                    </div>
                </aside>

                <main className="flex-1 bg-white rounded-lg shadow-xl p-6">
                    {/* App-wide message display */}
                    {appMessage.show && (
                        <div className={`mt-4 mb-4 p-3 rounded-md text-center ${appMessage.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {appMessage.text}
                        </div>
                    )}
                    {renderMainContent()}
                </main>
            </div>

            <ConfirmationModal
                message={confirmModalMessage}
                onConfirm={handleConfirmModalProceed}
                onCancel={handleConfirmModalCancel}
                show={showConfirmModal}
            />
        </div>
    );
}

export default App;