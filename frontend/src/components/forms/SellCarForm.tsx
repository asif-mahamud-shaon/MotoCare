'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { carsApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Upload, X, Camera, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SellCarFormData {
  brand: string;
  model: string;
  year: number;
  condition: 'NEW' | 'RECONDITIONED' | 'PRE_OWNED';
  price: number;
  description: string;
}

export function SellCarForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SellCarFormData>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SellCarFormData) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('Form data being submitted:', data);
      console.log('Images being submitted:', images);

      const formData = new FormData();
      formData.append('brand', data.brand);
      formData.append('model', data.model);
      formData.append('year', data.year.toString());
      formData.append('condition', data.condition);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);

      images.forEach((image, index) => {
        formData.append('images', image);
      });

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await carsApi.createCar(formData);

      if (response.success) {
        toast.success('Car listed successfully! It will be reviewed before going live.');
        reset();
        setImages([]);
        setImagePreviews([]);
      } else {
        throw new Error(response.message || 'Failed to create listing');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create listing';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand *
          </label>
          <input
            type="text"
            {...register('brand', { required: 'Brand is required' })}
            className="input-field"
            placeholder="e.g., BMW, Mercedes-Benz, Toyota"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.brand.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model *
          </label>
          <input
            type="text"
            {...register('model', { required: 'Model is required' })}
            className="input-field"
            placeholder="e.g., X5, C-Class, Camry"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.model.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            {...register('year', { 
              required: 'Year is required',
              min: { value: 1900, message: 'Invalid year' },
              max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
            })}
            className="input-field"
            placeholder="e.g., 2023"
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.year.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition *
          </label>
          <select
            {...register('condition', { required: 'Condition is required' })}
            className="input-field"
          >
            <option value="">Select condition</option>
            <option value="NEW">New</option>
            <option value="RECONDITIONED">Reconditioned</option>
            <option value="PRE_OWNED">Pre-owned</option>
          </select>
          {errors.condition && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.condition.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) *
          </label>
          <input
            type="number"
            min="0"
            step="100"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            className="input-field"
            placeholder="e.g., 25000"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="input-field"
          placeholder="Describe your car's features, condition, history, etc."
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos * (Max 10 images, 5MB each)
        </label>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Camera className="w-12 h-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary-600 hover:text-primary-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB each
            </p>
          </label>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {images.length} of 10 images uploaded
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            reset();
            setImages([]);
            setImagePreviews([]);
          }}
          className="btn-secondary"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Creating Listing...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>List My Car</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
