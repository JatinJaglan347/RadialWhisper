import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Tag, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';

const LandingWriteSuggestion = () => {
  const { authUser } = useAuthStore();
  
  const [formState, setFormState] = useState({
    title: '',
    category: '',
    description: ''
  });
  
  const [characterCount, setCharacterCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  
  const categories = [
    'Feature Request', 
    'UI/UX Improvement', 
    'Bug Report', 
    'Performance Issue',
    'Documentation',
    'Other'
  ];
  
  // Update character count when description changes
  useEffect(() => {
    setCharacterCount(formState.description.length);
  }, [formState.description]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formState.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formState.description.length < 30) {
      newErrors.description = 'Description should be at least 30 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after submission
      setFormState({
        title: '',
        category: '',
        description: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  // If user not logged in
  const renderLoginPrompt = () => (
    <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-lg text-center">
      <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-400" />
      <h3 className="text-xl font-bold mb-2">Login Required</h3>
      <p className="text-[#D8D9DA] mb-6">
        You need to be logged in to submit suggestions.
      </p>
      <a 
        href="/login" 
        className="inline-block bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
      >
        Log In / Sign Up
      </a>
    </div>
  );
  
  if (!authUser) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {renderLoginPrompt()}
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto" data-aos="fade-up">
      {isSubmitted ? (
        <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-lg text-center">
          <CheckCircle size={64} className="mx-auto mb-6 text-green-400" />
          <h3 className="text-2xl font-bold mb-2">Suggestion Submitted!</h3>
          <p className="text-[#D8D9DA] mb-6">
            Thank you for your valuable input. Your suggestion has been recorded and will be reviewed by our team.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
          >
            Submit Another Suggestion
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl p-8 relative overflow-hidden">
          {/* Form background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#FFF6E0] blur-[100px] opacity-10"></div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Share Your Suggestion</h2>
            <p className="text-[#D8D9DA]">
              Your feedback helps us improve RadialWhisper for everyone. Be specific and constructive.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Suggestion Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formState.title}
                onChange={handleChange}
                className={`w-full bg-[#272829] border ${errors.title ? 'border-red-400' : 'border-[#61677A]'} rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all`}
                placeholder="Brief summary of your suggestion"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formState.category}
                  onChange={handleChange}
                  className={`w-full bg-[#272829] border ${errors.category ? 'border-red-400' : 'border-[#61677A]'} rounded-lg px-4 py-3 text-[#FFF6E0] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all`}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#61677A]" size={18} />
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description <span className="text-red-400">*</span>
                </label>
                <span className={`text-xs ${characterCount < 30 ? 'text-red-400' : 'text-[#61677A]'}`}>
                  {characterCount}/1000 characters
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows="6"
                maxLength="1000"
                className={`w-full bg-[#272829] border ${errors.description ? 'border-red-400' : 'border-[#61677A]'} rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all resize-none`}
                placeholder="Describe your suggestion in detail. What problem does it solve? How would it benefit users?"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative overflow-hidden bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center">
                  {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LandingWriteSuggestion;