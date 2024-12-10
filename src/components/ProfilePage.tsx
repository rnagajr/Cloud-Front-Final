'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Car, Calendar, LogOut, Settings } from 'lucide-react';
import { Badge } from "./ui/badge";
import Navbar from './Navbar';
import CarManagement from './CarManagement';

interface Booking {
  _id: string;
  status: string;
  totalPrice: number;
  car: {
    name: string;
    model: string;
  };
  startDate: string;
  endDate: string;
}

interface User {
  id: string;
  role: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchBookings = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 400) {
          setFetchError("No bookings made.");
        } else {
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }
      } else {
        const data: Booking[] = await response.json();
        setBookings(data);
      }
    } catch (error) {
      const err = error as Error;
      setFetchError(err.message || "An unknown error occurred.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to home page
  };

  const cancelBooking = async (bookingId: string, startDate: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }

    // Check if it's too late to cancel
    const now = new Date();
    const bookingStart = new Date(startDate);
    const timeDifference = bookingStart.getTime() - now.getTime();
    const cancelDeadline = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeDifference <= cancelDeadline) {
      alert("It's too late to cancel now.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        alert('Booking cancelled successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Error cancelling booking.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while cancelling the booking. Please try again.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBookings(token);
      fetchUserData(token);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <Tabs defaultValue="bookings">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="bookings" className="flex items-center">
              <Car className="mr-2 h-4 w-4" />
              Bookings
            </TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="car-management" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Car Management
              </TabsTrigger>
            )}
            <TabsTrigger value="logout" className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>View and manage your car rental bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBookings ? (
                  <p>Loading bookings...</p>
                ) : fetchError ? (
                  <p className="text-red-500">{fetchError}</p>
                ) : bookings.length > 0 ? (
                  bookings.map(booking => (
                    <div key={booking._id} className="mb-6 p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{booking.car.name} {booking.car.model}</h3>
                        <Badge>{booking.status}</Badge>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                        <span className="font-semibold">
                          Total: ${booking.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      {booking.status === 'booked' && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => cancelBooking(booking._id, booking.startDate)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No bookings found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {user?.role === 'admin' && (
            <TabsContent value="car-management">
              <CarManagement />
            </TabsContent>
          )}

          <TabsContent value="logout">
            <Card>
              <CardHeader>
                <CardTitle>Logout</CardTitle>
                <CardDescription>Are you sure you want to log out?</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleLogout}>Confirm Logout</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
