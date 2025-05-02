import { useState, useEffect } from 'react';

const useGeoLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location', error);
      }
    );
  }, []);

  return location;
};

export default useGeoLocation;
