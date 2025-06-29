// src/App.js
import React, { useState, useEffect, useCallback } from 'react';

// Replicating Lucide-react icons in SVG directly for a self-contained app
const Icons = {
    List: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>,
    Plus: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M12 5L12 19"/><path d="M5 12L19 12"/></svg>,
    Upload: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
    Download: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
    Clipboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M9 18H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/><path d="M15 18h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><line x1="12" x2="12" y1="18" y2="22"/></svg>,
    Share2: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><circle cx="18" cy="5" r="3"/><path d="M8.59 11.51L12 14l3.41-2.49"/><circle cx="5" cy="12" r="3"/><circle cx="18" cy="19" r="3"/></svg>,
    Edit: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    Trash2: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
    MapPin: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M12 21.7C17.3 17 20 12.5 20 10a8 8 0 1 0-16 0c0 2.5 2.7 7 8 11.7z"/><circle cx="12" cy="10" r="3"/></svg>,
    X: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M18 6L6 18"/><path d="M6 6L18 18"/></svg>,
    Facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    Youtube: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2c.86.6 1.45 1.5 1.5 2.5a2.5 2.5 0 0 1-2.5 2.5c-.06 1-.65 1.9-1.5 2.5a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2z"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
    Instagram: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
    Phone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M22 16.92V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3.08A2 2 0 0 1 3.2 13.5L7 10.5M15 2H9L7 8h10l-2-6z"/></svg>,
    Mail: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    Building: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
    Landmark: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="10"/><line x1="10" x2="10" y1="18" y2="10"/><line x1="14" x2="14" y1="18" y2="10"/><line x1="18" x2="18" y1="18" y2="10"/><polygon points="12 2 20 7 4 7"/></svg>,
    Globe: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20z"/><path d="M2 12h20"/></svg>,
    Briefcase: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-red-500"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    Calendar: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    FileText: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
    User: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-red-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Flag: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>,
    Coffee: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M10 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6z"/><path d="M16 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8"/><path d="M12 8v10a4 4 0 0 0 4 4h2c2.76 0 5-2.24 5-5V8h-9z"/></svg>,
    Package: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="m7.5 4.27 9 5.15"/><path d="M21 8.03v8.94L12 22l-9-5.03V8.03L12 2l9 6.03Z"/><path d="m3.3 7.64 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
    Sliders: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="w-5 h-5 mr-2"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>,
    Home: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

const API_BASE_URL = 'http://localhost:3001/api'; // Your Node.js backend URL

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

// Custom Confirmation Modal component
const ConfirmationModal = ({ message, onConfirm, onCancel, show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto">
                <p id="confirm-message" className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        id="confirm-cancel"
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-sm transition-colors duration-200"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm-proceed"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors duration-200"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ContactList Component ---
const ContactList = ({ setActiveSubMenu, setEditingContact, displayMessage }) => {
    const [contacts, setContacts] = useState([]);
    const [filterField, setFilterField] = useState('name');
    const [filterValue, setFilterValue] = useState('');
    const [purposeFilter, setPurposeFilter] = useState('');
    const [expandedContactId, setExpandedContactId] = useState(null); // NEW: Track expanded contact

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
                <ul className="space-y-4">
                    {filteredContacts.map(contact => {
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
                                    <span className="ml-2 text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                                </div>
                                {isExpanded && (
                                    <div className="mt-3">
                                        {/* --- BEGIN: All details (copy from your previous card body) --- */}
                                        {contact.phone && <p className="text-gray-700 text-sm flex items-center">{Icons.Phone} {contact.phone}</p>}
                                        {contact.email && <p className="text-gray-700 text-sm flex items-center">{Icons.Mail} {contact.email}</p>}
                                        {contact.company && <p className="text-gray-700 text-sm flex items-center">{Icons.Building} {contact.company}</p>}
                                        {contact.address && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} {contact.address}</p>}
                                        {contact.city && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} City: {contact.city}</p>}
                                        {contact.state && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} State: {contact.state}</p>}
                                        {contact.district && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} District: {contact.district}</p>}
                                        {contact.location && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} Location: {contact.location}</p>}
                                        {contact.nativeLanguage && <p className="text-gray-700 text-sm flex items-center">{Icons.Globe} Native Language: {contact.nativeLanguage}</p>}
                                        {contact.purpose && <p className="text-gray-700 text-sm font-semibold flex items-center">{Icons.Briefcase} Purpose: <span className="capitalize ml-1">{contact.purpose}</span></p>}
                                        {contact.purpose === 'political' && (
                                            <div className="pl-6 pt-2 border-t border-gray-200 mt-2">
                                                {contact.paMobileNumber && <p className="text-gray-700 text-sm flex items-center">{Icons.Phone} PA Mobile: {contact.paMobileNumber}</p>}
                                                {contact.constituency && <p className="text-gray-700 text-sm flex items-center">{Icons.Landmark} Constituency: {contact.constituency}</p>}
                                                {contact.politicalPartyName && <p className="text-gray-700 text-sm flex items-center">{Icons.Flag} Political Party: {contact.politicalPartyName}</p>}
                                            </div>
                                        )}
                                        {contact.purpose === 'celebrity' && (
                                            <div className="pl-6 pt-2 border-t border-gray-200 mt-2">
                                                {contact.managerMobileNumber && <p className="text-gray-700 text-sm flex items-center">{Icons.Phone} Manager Mobile: {contact.managerMobileNumber}</p>}
                                                {contact.profession && <p className="text-gray-700 text-sm flex items-center">{Icons.Briefcase} Profession: {contact.profession}</p>}
                                            </div>
                                        )}
                                        {contact.purpose === 'serviceProvider' && (
                                            <div className="pl-6 pt-2 border-t border-gray-200 mt-2">
                                                {contact.serviceType && <p className="text-gray-700 text-sm flex items-center">{Icons.Briefcase} Service Type: {contact.serviceType}</p>}
                                                {contact.serviceContactPerson && <p className="text-gray-700 text-sm flex items-center">{Icons.User} Contact Person: {contact.serviceContactPerson}</p>}
                                                {contact.lastInteractionDate && <p className="text-gray-700 text-sm flex items-center">{Icons.Calendar} Last Interaction: {contact.lastInteractionDate}</p>}
                                                {contact.contractDetails && <p className="text-gray-700 text-sm flex items-center">{Icons.FileText} Contract: {contact.contractDetails}</p>}
                                            </div>
                                        )}
                                        {contact.purpose === 'teaStall' && (
                                            <div className="pl-6 pt-2 border-t border-gray-200 mt-2">
                                                {contact.teaStallCode && <p className="text-gray-700 text-sm flex items-center">{Icons.Coffee} Code: {contact.teaStallCode}</p>}
                                                {contact.teaStallName && <p className="text-gray-700 text-sm flex items-center">{Icons.Coffee} Stall Name: {contact.teaStallName}</p>}
                                                {contact.teaStallOwnerName && <p className="text-gray-700 text-sm flex items-center">{Icons.User} Owner: {contact.teaStallOwnerName}</p>}
                                                {contact.teaStallMobileNumber && <p className="text-gray-700 text-sm flex items-center">{Icons.Phone} Mobile: {contact.teaStallMobileNumber}</p>}
                                                {contact.teaStallArea && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} Area: {contact.teaStallArea}</p>}
                                                {contact.teaStallMandal && <p className="text-gray-700 text-sm flex items-center">{Icons.MapPin} Mandal: {contact.teaStallMandal}</p>}
                                                {contact.teaStallTeaPowderPrice && <p className="text-gray-700 text-sm flex items-center">{Icons.Package} Tea Powder Price: ₹{contact.teaStallTeaPowderPrice}</p>}
                                                {contact.teaStallOtherSellingItems && <p className="text-gray-700 text-sm flex items-center">{Icons.List} Other Items: {contact.teaStallOtherSellingItems}</p>}
                                            </div>
                                        )}
                                        {(contact.purpose === 'influencer' || (!contact.purpose && (contact.x_twitter || contact.facebook || contact.youtube || contact.instagram))) && (
                                            <div className="pl-6 pt-2 border-t border-gray-200 mt-2">
                                                {contact.x_twitter && <p className="text-gray-700 text-sm flex items-center">{Icons.X} X (Twitter): {contact.xTwitterProfileName ? <span className="ml-1 text-xs text-gray-600">({contact.xTwitterProfileName})</span> : ''}{contact.xTwitterFollowers ? <span className="ml-1 text-xs bg-gray-200 px-2 py-1 rounded">F: {contact.xTwitterFollowers}</span> : ''}<a href={contact.x_twitter} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline ml-2">Link</a></p>}
                                                {contact.facebook && <p className="text-gray-700 text-sm flex items-center">{Icons.Facebook} Facebook: {contact.facebookProfileName ? <span className="ml-1 text-xs text-gray-600">({contact.facebookProfileName})</span> : ''}{contact.facebookFollowers ? <span className="ml-1 text-xs bg-gray-200 px-2 py-1 rounded">F: {contact.facebookFollowers}</span> : ''}<a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline ml-2">Link</a></p>}
                                                {contact.youtube && <p className="text-gray-700 text-sm flex items-center">{Icons.Youtube} YouTube: {contact.youtubeChannelName ? <span className="ml-1 text-xs text-gray-600">({contact.youtubeChannelName})</span> : ''}{contact.youtubeFollowers ? <span className="ml-1 text-xs bg-gray-200 px-2 py-1 rounded">S: {contact.youtubeFollowers}</span> : ''}<a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline ml-2">Link</a></p>}
                                                {contact.instagram && <p className="text-gray-700 text-sm flex items-center">{Icons.Instagram} Instagram: {contact.instagramProfileName ? <span className="ml-1 text-xs text-gray-600">({contact.instagramProfileName})</span> : ''}{contact.instagramFollowers ? <span className="ml-1 text-xs bg-gray-200 px-2 py-1 rounded">F: {contact.instagramFollowers}</span> : ''}<a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline ml-2">Link</a></p>}
                                            </div>
                                        )}
                                        {contact.remarks && <p className="text-gray-700 text-sm flex items-center">{Icons.FileText} Remarks: {contact.remarks}</p>}
                                        {contact.notes && <p className="text-gray-700 text-sm flex items-center">{Icons.FileText} Notes: {contact.notes}</p>}
                                        <div className="mt-4 flex flex-wrap gap-2 justify-end">
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
                                        {/* --- END: All details --- */}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

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
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // REPLACE WITH YOUR ACTUAL API KEY
                const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

                try {
                    const response = await fetch(geocodingUrl);
                    const data = await response.json();

                    if (data.results && data.results.length > 0) {
                        setFormData(prev => ({ ...prev, location: data.results[0].formatted_address }));
                        displayMessage('Location fetched successfully!', true);
                    } else {
                        displayMessage('Could not find address for location.', false);
                        setFormData(prev => ({ ...prev, location: `Lat: ${latitude}, Lon: ${longitude}` }));
                    }
                } catch (error) {
                    console.error("Error fetching location from Google Maps API:", error);
                    displayMessage('Error fetching location address.', false);
                    setFormData(prev => ({ ...prev, location: `Lat: ${latitude}, Lon: ${longitude}` }));
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                    if (fetchBtn) {
                        fetchBtn.disabled = false;
                        fetchBtn.innerHTML = `${Icons.MapPin} Fetch Location`;
                    }
                }
            }, (error) => {
                console.error("Geolocation error:", error);
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
                        disabled={disabledAttr}
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
        tools: [
            { name: 'Extract Contact Info', id: 'extractContact', icon: Icons.Clipboard },
            { name: 'Backup & Restore', id: 'backupRestore', icon: Icons.Upload },
        ],
    };

    const renderMainContent = () => {
        switch (activeSubMenu) {
            case 'listContacts':
                return <ContactList setActiveSubMenu={setActiveSubMenu} setEditingContact={setEditingContact} displayMessage={displayMessage} />;
            case 'addContact':
                return <AddEditContact editingContact={editingContact} setEditingContact={setEditingContact} extractedContactData={extractedContactData} setExtractedContactData={setExtractedContactData} setOverallActiveSubMenu={setActiveSubMenu} displayMessage={displayMessage} />;
            case 'listProducts':
                return <ProductList setOverallActiveSubMenu={setActiveSubMenu} setProductToEdit={setProductToEdit} displayMessage={displayMessage} />;
            case 'addProduct':
                return <AddEditProduct productToEdit={productToEdit} setProductToEdit={setProductToEdit} setOverallActiveSubMenu={setActiveSubMenu} displayMessage={displayMessage} />;
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
                                }}
                            >
                                {Icons.Package} Products
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