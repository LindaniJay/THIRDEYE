import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback, FC } from 'react';
import axios from 'axios';

// Define the type for our form data
interface FormData {
    fullName: string;
    email: string;
    phone: string;
    carModel: string;
    budget: number;
    neededBy: Date;
    additionalNotes?: string;
}

// Define the validation schema based on the FormData type
const schema: yup.ObjectSchema<FormData> = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  carModel: yup.string().required('Car model is required'),
  budget: yup.number().typeError('Budget must be a number').required('Budget is required').min(1000, 'Budget must be at least $1,000'),
  neededBy: yup.date().min(new Date(), 'Date must be in the future').required('Date is required'),
  additionalNotes: yup.string(),
});

// Extend the File type to include our custom preview property
interface IFileWithPreview extends File {
    preview: string;
}

const BookingForm: FC = () => {
  const [files, setFiles] = useState<IFileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      additionalNotes: ''
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5
  });

  const removeFile = (fileToRemove: IFileWithPreview) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      // Append form data
      (Object.keys(data) as Array<keyof FormData>).forEach(key => {
        const value = data[key];
        if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (value) {
            formData.append(key, value.toString());
        }
      });
      
      // Append files
      files.forEach(file => {
        formData.append('images', file);
      });

      // Send to backend
      await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsSuccess(true);
      reset();
      setFiles([]);
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8 glass rounded-2xl my-8"
    >
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Find Your Dream Car</h2>
        
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
          >
            Your request has been submitted successfully! We'll get back to you soon.
          </motion.div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Full Name</label>
            <input 
              type="text" 
              {...register('fullName')} 
              className="input-field bg-white/10 text-white placeholder-gray-400 border-gray-600"
              placeholder="John Doe"
            />
            {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input 
              type="email" 
              {...register('email')} 
              className="input-field bg-white/10 text-white placeholder-gray-400 border-gray-600"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Phone Number</label>
            <input 
              type="tel" 
              {...register('phone')} 
              className="input-field bg-white/10 text-white placeholder-gray-400 border-gray-600"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Desired Car Model</label>
            <input 
              type="text" 
              {...register('carModel')} 
              className="input-field bg-white/10 text-white placeholder-gray-400 border-gray-600"
              placeholder="e.g., Toyota Camry 2023"
            />
            {errors.carModel && <p className="text-red-400 text-sm mt-1">{errors.carModel.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Budget ($)</label>
            <input 
              type="number" 
              {...register('budget')} 
              className="input-field bg-white/10 text-white placeholder-gray-400 border-gray-600"
              placeholder="e.g., 25000"
            />
            {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Needed By</label>
            <input 
              type="date" 
              {...register('neededBy')} 
              className="input-field bg-white/10 text-white placeholder-gray-400 border-gray-600"
            />
            {errors.neededBy && <p className="text-red-400 text-sm mt-1">{errors.neededBy.message?.toString()}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Additional Notes</label>
          <textarea 
            {...register('additionalNotes')} 
            rows={3}
            className="input-field bg-white/10 text-white placeholder-gray-400 border-gray-600"
            placeholder="Any specific features, colors, or requirements..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Upload Reference Images (Max 5)</label>
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors"
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-300">
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag and drop some files here, or click to select files'}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={file.preview}
                    alt={file.name || `Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                    onLoad={() => URL.revokeObjectURL(file.preview)} 
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm;
