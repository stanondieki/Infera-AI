import { useState, useEffect } from 'react';

/**
 * Custom hook to manage profile image from localStorage
 */
export function useProfileImage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = () => {
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    };

    // Load on mount
    loadProfileImage();

    // Listen for storage changes (when image is updated in another tab/component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profileImage') {
        setProfileImage(e.newValue);
      }
    };

    // Listen for custom event (when image is updated in the same tab)
    const handleProfileImageUpdate = ((e: CustomEvent) => {
      setProfileImage(e.detail);
    }) as EventListener;

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  return profileImage;
}

/**
 * Utility function to dispatch profile image update event
 */
export function updateProfileImage(imageData: string | null) {
  const event = new CustomEvent('profileImageUpdated', { detail: imageData });
  window.dispatchEvent(event);
}
