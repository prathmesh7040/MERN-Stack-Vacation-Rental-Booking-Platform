import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/utils/axios';

import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import AddressLink from '@/components/ui/AddressLink';
import Spinner from '@/components/ui/Spinner';
import PerksWidget from '@/components/ui/PerksWidget';


const PlacePage = () => {
  // 1. Get the place ID from the URL
  const { id } = useParams();
  
  // 2. State for loading and place data
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Fetch data from the API when the component mounts
  useEffect(() => {
    if (!id) {
      return;
    }
    axiosInstance.get(`/places/${id}`).then(response => {
      setPlace(response.data.place);
      setLoading(false);
    });
  }, [id]);

  // 4. Show a loading spinner while data is being fetched
  if (loading) {
    return <Spinner />;
  }
  
  // A check in case the place is not found
  if (!place) {
    return <div className="text-center mt-8">Could not find the requested place.</div>;
  }

  // 5. Render the page with all the details
  return (
    <div className="mt-4 px-8 pt-20">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      
      <PlaceGallery place={place} />

      <div className="mt-8 mb-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
  <div>
    <div className="my-4">
      <h2 className="text-2xl font-semibold">Description</h2>
      {place.description}
    </div>
    Check-in: {place.checkIn} <br />
    Check-out: {place.checkOut} <br />
    Max number of guests: {place.maxGuests}
    
    {/* ADD THIS LINE */}
    <PerksWidget perks={place.perks} />
    
  </div>
  <div>
    {place && <BookingWidget place={place} />}
  </div>
</div>

      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-500 leading-5">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;