import React, { useState, useRef } from 'react';
import { Upload, FileVideo, Mail, User, Zap, Check, ArrowRight, Play } from 'lucide-react';

const UGCProcessingSystem = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contentType: '',
    videoCount: '',
    files: [],
    orderNumber: '',
    style: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    { title: 'Basic Info', icon: User },
    { title: 'Content Details', icon: FileVideo },
    { title: 'Upload Files', icon: Upload },
    { title: 'Processing', icon: Zap }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    // Simulate API call to Django backend
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'files') {
        formData.files.forEach(file => {
          formDataToSend.append('files', file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      // Replace with your Django API endpoint
      const response = await fetch('/api/process-ugc/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        nextStep();
        setIsProcessing(true);
        
        // Simulate processing time
        setTimeout(() => {
          setIsProcessing(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">CreatorClips</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Transform your raw content into professional UGC that converts. 
            AI-powered enhancement in minutes, not hours.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 
                    ${isActive ? 'bg-white text-purple-600 border-white' : 
                      isCompleted ? 'bg-green-500 text-white border-green-500' : 
                      'bg-transparent text-white border-white/50'}
                  `}>
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`ml-3 font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-white/30'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Let's Get Started</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type of content do you create?
                </label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select content type</option>
                  <option value="product-reviews">Product Reviews/Testimonials</option>
                  <option value="service-testimonials">Service Testimonials</option>
                  <option value="behind-scenes">Behind-the-Scenes Content</option>
                  <option value="educational">Educational Content</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many videos do you post per month?
                </label>
                <select
                  name="videoCount"
                  value={formData.videoCount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select range</option>
                  <option value="1-5">1-5 videos</option>
                  <option value="6-15">6-15 videos</option>
                  <option value="16-30">16-30 videos</option>
                  <option value="30+">30+ videos</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Content Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Content Preferences</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number (if paid customer)
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Leave empty for free consultation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Style
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select style preference</option>
                  <option value="professional">Professional & Clean</option>
                  <option value="casual">Casual & Friendly</option>
                  <option value="energetic">Energetic & Dynamic</option>
                  <option value="minimalist">Minimalist & Modern</option>
                  <option value="branded">Branded & Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any specific requirements, brand colors, logos, or instructions..."
                />
              </div>
            </div>
          )}

          {/* Step 3: File Upload */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload Your Content</h2>
              
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop your files here
                </p>
                <p className="text-gray-500 mb-4">
                  or click to browse (Videos, Images, Audio files)
                </p>
                <p className="text-sm text-gray-400">
                  Maximum file size: 100MB per file
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/*,image/*,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* File List */}
              {formData.files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">Uploaded Files:</h3>
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileVideo className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Processing */}
          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Processing Your Content</h2>
              
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-lg text-gray-600">
                    Our AI is enhancing your content...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-green-100 rounded-full p-4">
                      <Check className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Content Enhanced Successfully!</h3>
                  <p className="text-gray-600">
                    Your enhanced content has been processed and will be delivered to your email within 24 hours.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      📧 Check your email for download links
                      <br />
                      💬 Join our Discord community for tips and feedback
                      <br />
                      🚀 Share your results and get featured!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < 2 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 0 && (!formData.name || !formData.email || !formData.contentType)) ||
                  (currentStep === 1 && !formData.style)
                }
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : currentStep === 2 ? (
              <button
                onClick={submitForm}
                disabled={isSubmitting || formData.files.length === 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? 'Submitting...' : 'Process Content'}
                <Zap className="ml-2 h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Enhancement</h3>
              <p className="opacity-90">Advanced AI transforms your raw content into professional-grade UGC</p>
            </div>

            <div className="text-center text-white">
              <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Play className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Processing</h3>
              <p className="opacity-90">Get your enhanced content back in minutes, not hours</p>
            </div>

            <div className="text-center text-white">
              <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
              <p className="opacity-90">100% satisfaction guarantee or your money back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UGCProcessingSystem;