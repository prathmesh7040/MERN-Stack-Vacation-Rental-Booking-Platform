import { useState, useEffect } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
import { Navigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios'; // Assuming you have this configured

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BookingWidget = ({ place }) => {
  const [date, setDate] = useState({ from: undefined, to: undefined });
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');

  const numberOfNights = date.from && date.to
    ? differenceInCalendarDays(new Date(date.to), new Date(date.from))
    : 0;

  // Function to handle the booking submission
  async function handleBooking() {
    if (!date.from || !date.to) {
      alert('Please select a check-in and check-out date.');
      return;
    }
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    try {
      const response = await axiosInstance.post('/bookings', {
        checkIn: date.from,
        checkOut: date.to,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
      });
      
      const bookingId = response.data._id; // Adjust based on your API response
      alert('Booking successful!');
      setRedirect(`/account/bookings/₹{bookingId}`);
    } catch (error) {
      alert('Booking failed. Please try again.');
      console.error(error);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ₹{place.price} / per night
      </div>

      <div className="border rounded-2xl mt-4">
        {/* Calendar and Guest inputs */}
        <div className="p-4">
          <label className="font-semibold">Select Dates:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal mt-2">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (date.to ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}` : format(date.from, "LLL dd, y")) : (<span>Pick a date</span>)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" selected={date} onSelect={setDate} initialFocus numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="py-3 px-4 border-t">
          <label className="font-semibold">Number of guests:</label>
          <input type="number" value={numberOfGuests} onChange={ev => setNumberOfGuests(Math.max(1, parseInt(ev.target.value, 10)))} min="1" max={place.maxGuests} className="w-full border rounded-lg p-2 mt-2" />
        </div>

        {/* Show these inputs only when dates have been selected */}
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label className="font-semibold">Your full name:</label>
            <input type="text" value={name} onChange={ev => setName(ev.target.value)} className="w-full border rounded-lg p-2 mt-2" />
            <label className="font-semibold mt-2 block">Phone number:</label>
            <input type="tel" value={phone} onChange={ev => setPhone(ev.target.value)} className="w-full border rounded-lg p-2 mt-2" />
          </div>
        )}
      </div>

      {/* Price Display */}
      {numberOfNights > 0 && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">
            Total Price: ₹{place.price * numberOfNights}
          </h2>
          <p className="text-sm text-gray-500">
            ₹{place.price} x {numberOfNights} nights
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button onClick={handleBooking} className="bg-primary p-4 text-white rounded-2xl w-full mt-4">
        Book this place
      </button>
    </div>
  );
};

export default BookingWidget;