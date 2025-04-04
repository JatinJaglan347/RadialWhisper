import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertTriangle, Tag, Sparkles, ChevronDown, ArrowRight, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';

const LandingWriteSuggestion = () => {
  const { authUser, createSuggestion } = useAuthStore();
  const [formState, setFormState] = useState({
    title: '',
    category: '',
    description: ''
  });
  
  const [characterCount, setCharacterCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const suggestionData = {
        title: formState.title,
        category: formState.category,
        description: formState.description,
        userId: authUser.data.user._id
      };
      
      await createSuggestion(suggestionData);
      setIsSubmitted(true);
      
      setFormState({
        title: '',
        category: '',
        description: ''
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectCategory = (category) => {
    setFormState(prev => ({
      ...prev,
      category
    }));
    setIsCategoryOpen(false);
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: null
      }));
    }
  };
  
  // If user not logged in
  if (!authUser) {
    return (
      <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#1E1F21] to-[#31333A] border border-[#FFF6E0]/5">
        <div className="p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#61677A]/10 blur-[80px]"></div>
          
          <div className="text-center relative z-10 py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#31333A] mb-4 text-yellow-400">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Account Required</h3>
            <p className="text-[#D8D9DA] mb-8 max-w-md mx-auto">
              Join our community to share your ideas and help shape the future of RadialWhisper.
            </p>
            <a 
              href="/login" 
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-3 rounded-full font-medium transition-all overflow-hidden"
            >
              <span className="relative z-10">Log In / Sign Up</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Success message
  if (isSubmitted) {
    return (
      <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#1E1F21] to-[#31333A] border border-[#FFF6E0]/5">
        <div className="p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-green-500/5 blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-green-500/5 blur-[80px]"></div>
          
          <div className="py-10 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            
            <h3 className="text-3xl font-bold mb-4">Thank You!</h3>
            <p className="text-[#D8D9DA] text-lg mb-8 max-w-lg mx-auto">
              Your suggestion has been submitted successfully. We appreciate your contribution to making RadialWhisper better.
            </p>
            
            <button 
              onClick={() => setIsSubmitted(false)}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-8 py-3 rounded-full font-medium transition-all overflow-hidden"
            >
              <Sparkles size={18} className="relative z-10" />
              <span className="relative z-10">Share Another Idea</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main form
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[600px]">
        {/* Sidebar */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#1E1F21] to-[#272829] p-8 relative">
          <div className="sticky top-8">
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-3">
                  <Sparkles size={16} className="text-[#FFF6E0]" />
                </div>
                <h3 className="text-xl font-semibold">Share Your Vision</h3>
              </div>
              <p className="text-[#D8D9DA] text-sm leading-relaxed">
                Your suggestions directly influence our development roadmap. Be specific, be bold, and help us create the features you want to see.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#31333A]/50 backdrop-blur-sm p-4 rounded-lg border border-[#FFF6E0]/5">
                <div className="flex items-center mb-2">
                  <LayoutGrid size={16} className="text-[#FFF6E0] mr-2" />
                  <h4 className="font-medium">Guidelines</h4>
                </div>
                <ul className="space-y-2 text-sm text-[#D8D9DA]">
                  <li className="flex items-start">
                    <span className="text-[#FFF6E0] mr-2">•</span>
                    <span>Be specific and clear about your idea</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFF6E0] mr-2">•</span>
                    <span>Explain the problem your suggestion solves</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFF6E0] mr-2">•</span>
                    <span>Consider how other users might benefit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFF6E0] mr-2">•</span>
                    <span>Keep suggestions constructive and respectful</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#31333A]/50 backdrop-blur-sm p-4 rounded-lg border border-[#FFF6E0]/5">
                <div className="flex items-center mb-2">
                  <Tag size={16} className="text-[#FFF6E0] mr-2" />
                  <h4 className="font-medium">Popular Categories</h4>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {categories.slice(0, 4).map(category => (
                    <span key={category} className="inline-flex px-3 py-1 bg-[#272829] text-xs rounded-full text-[#D8D9DA]">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <div className="md:col-span-3 bg-gradient-to-br from-[#272829] to-[#31333A] p-8 relative">
          <div className="absolute top-0 right-0 w-full h-64 bg-[#FFF6E0]/5 blur-[100px] opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Create Suggestion</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2 text-[#D8D9DA]">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  className={`w-full bg-[#1E1F21] border ${errors.title ? 'border-red-400' : 'border-[#31333A]'} rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30 transition-all`}
                  placeholder="A concise title for your suggestion"
                />
                {errors.title && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {errors.title}
                  </p>
                )}
              </div>
              
              {/* Category dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#D8D9DA]">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`w-full flex items-center justify-between bg-[#1E1F21] border ${errors.category ? 'border-red-400' : 'border-[#31333A]'} rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30 transition-all`}
                  >
                    <span className={formState.category ? 'text-[#FFF6E0]' : 'text-[#61677A]'}>
                      {formState.category || 'Select a category'}
                    </span>
                    <ChevronDown size={18} className={`text-[#61677A] transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-[#1E1F21] border border-[#31333A] rounded-lg shadow-2xl max-h-60 overflow-auto">
                      {categories.map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => selectCategory(category)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] transition-colors ${
                            formState.category === category ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.category && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {errors.category}
                  </p>
                )}
              </div>
              
              {/* Description field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="description" className="block text-sm font-medium text-[#D8D9DA]">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-xs ${characterCount < 30 ? 'text-red-400' : characterCount > 800 ? 'text-yellow-400' : 'text-[#61677A]'}`}>
                    {characterCount}/1000 characters
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  rows="8"
                  maxLength="1000"
                  className={`w-full bg-[#1E1F21] border ${errors.description ? 'border-red-400' : 'border-[#31333A]'} rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30 transition-all resize-none`}
                  placeholder="Describe your idea in detail. What problem does it solve? How would it benefit users?"
                ></textarea>
                
                {/* Character count visualization */}
                <div className="h-1 w-full bg-[#31333A] rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      characterCount < 30 ? 'bg-red-400' : 
                      characterCount > 800 ? 'bg-yellow-400' : 'bg-[#FFF6E0]'
                    }`}
                    style={{ width: `${Math.min(100, (characterCount / 1000) * 100)}%` }}
                  ></div>
                </div>
                
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {errors.description}
                  </p>
                )}
              </div>
              
              {/* Submit button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-3 rounded-full font-medium transition-all overflow-hidden disabled:opacity-70"
                >
                  <span className="relative z-10">{isSubmitting ? 'Submitting...' : 'Submit Suggestion'}</span>
                  <Send size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingWriteSuggestion;