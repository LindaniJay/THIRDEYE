import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar as solidStar, 
  faStarHalfAlt as halfStar, 
  faStar as regularStar, 
  faCamera, 
  faUser,
  faStarHalfStroke
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[];
  vehicleInspected: string;
  inspectionType: string;
}

const ReviewSystem: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 0,
    comment: '',
    vehicleInspected: '',
    inspectionType: 'pre-purchase',
    photos: [] as string[],
  });
  const [hoverRating, setHoverRating] = useState(0);

  // Mock reviews - in a real app, these would come from an API
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'John D.',
      rating: 5,
      comment: 'Excellent service! The inspector was very thorough and provided a detailed report.',
      date: '2023-06-10',
      photos: [
        'https://images.unsplash.com/photo-1580273916550-e323be72aead?w=500&auto=format',
        'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=500&auto=format'
      ],
      vehicleInspected: '2020 Toyota Camry',
      inspectionType: 'Pre-Purchase'
    },
    {
      id: '2',
      userName: 'Sarah M.',
      rating: 4,
      comment: 'Good inspection, found a few issues I would have missed. Photos were very helpful.',
      date: '2023-05-28',
      vehicleInspected: '2018 Honda CR-V',
      inspectionType: 'Annual'
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setNewReview(prev => ({
      ...prev,
      rating
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos = files.map(file => URL.createObjectURL(file));
      setNewReview(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName || 'Anonymous',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      photos: newReview.photos,
      vehicleInspected: newReview.vehicleInspected,
      inspectionType: newReview.inspectionType
    };

    setReviews([review, ...reviews]);
    setNewReview({
      userName: '',
      rating: 0,
      comment: '',
      vehicleInspected: '',
      inspectionType: 'pre-purchase',
      photos: [],
    });
    setShowForm(false);
  };

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star}>
        {star <= Math.floor(rating) ? (
          <FontAwesomeIcon icon={solidStar} className="text-yellow-400 w-5 h-5" />
        ) : star - 0.5 <= rating ? (
          <FontAwesomeIcon icon={faStarHalfStroke} className="text-yellow-400 w-5 h-5" />
        ) : (
          <FontAwesomeIcon icon={farStar} className="text-yellow-400 w-5 h-5" />
        )}
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="cursor-pointer"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {star <= (hoverRating || newReview.rating) ? (
                      <FontAwesomeIcon icon={solidStar} className="text-yellow-400 w-6 h-6" />
                    ) : (
                      <FontAwesomeIcon icon={farStar} className="text-gray-300 w-6 h-6" />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={newReview.userName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John D."
                />
              </div>
              
              <div>
                <label htmlFor="vehicleInspected" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Inspected
                </label>
                <input
                  type="text"
                  id="vehicleInspected"
                  name="vehicleInspected"
                  value={newReview.vehicleInspected}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2020 Toyota Camry"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="inspectionType" className="block text-sm font-medium text-gray-700 mb-1">
                Type of Inspection
              </label>
              <select
                id="inspectionType"
                name="inspectionType"
                value={newReview.inspectionType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="pre-purchase">Pre-Purchase Inspection</option>
                <option value="pre-rental">Pre-Rental Inspection</option>
                <option value="periodic">Periodic Maintenance Check</option>
                <option value="diagnostic">Diagnostic Inspection</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={newReview.comment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {newReview.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={photo} 
                      alt={`Review ${index + 1}`} 
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedPhotos = [...newReview.photos];
                        updatedPhotos.splice(index, 1);
                        setNewReview(prev => ({
                          ...prev,
                          photos: updatedPhotos
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors">
                  <FontAwesomeIcon icon={faCamera} className="w-4 h-4 mr-1" />
                  <span className="text-xs text-gray-500">Add</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newReview.rating || !newReview.comment || !newReview.vehicleInspected}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUser} className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <h4 className="font-medium">{review.userName}</h4>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.rating.toFixed(1)} • {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {review.inspectionType}
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <p className="text-sm text-gray-500 mb-3">
                <span className="font-medium">Vehicle:</span> {review.vehicleInspected}
              </p>
              
              {review.photos && review.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review ${review.id} - ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        // In a real app, you might want to open a lightbox here
                        window.open(photo, '_blank');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;
