import React, { useState, useRef } from 'react'
import { Upload, Image, X } from 'lucide-react'

export default function ImageUploader({ onImageUpload }) {
  const [dragActive, setDragActive] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setImagePreview(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (imagePreview) {
      onImageUpload(imagePreview)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="card p-8 glass-effect">
      <h3 className="text-xl font-semibold text-white mb-6">Upload Product Image</h3>
      
      {!imagePreview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <p className="text-white mb-2">Drop your product image here, or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            Browse Files
          </button>
          <p className="text-white/60 text-sm mt-4">
            Supports JPG, PNG, WebP up to 10MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="btn-primary"
            >
              Continue with this image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}