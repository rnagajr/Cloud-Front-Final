import { useState, useEffect } from 'react';
import { Calendar, ShoppingCart } from 'lucide-react';
import { useParams } from 'react-router-dom'; // Changed to react-router-dom
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import Navbar from './Navbar';
import { addDays } from 'date-fns';

type Car = {
  _id: string;
  name: string;
  model: string;
  description: string;
  pricePerDay: number;
  available: boolean;
  picture: string;
};

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();  // Use react-router-dom's useParams
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`);
      if (!response.ok) {
        throw new Error(`Unable to fetch car details, status: ${response.status}`);
      }
      const data: Car = await response.json();
      setCar(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching car:', err);
      setError('Failed to load car details. Please try again later.');
    }
  };

  const addToCart = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first!');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId: id,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }),
      });

      if (response.ok) {
        console.log('Car added to cart');
        alert('Car added to cart successfully!');
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        alert(data.message || 'Error adding car to cart.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while adding the car to the cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!car || !dateRange.from || !dateRange.to) return 0;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return car.pricePerDay * days;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
    const newDate = new Date(e.target.value);
    setDateRange((prevRange) => ({
      ...prevRange,
      [type]: newDate,
    }));
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardHeader className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={car.picture ? `http://localhost:5000${car.picture}` : "/placeholder.svg"}
              alt={car.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="space-y-4">
              <CardTitle className="text-3xl font-bold">{car.name}</CardTitle>
              <p className="text-xl text-gray-600">{car.model}</p>
              <Badge>{car.available ? 'Available' : 'Not Available'}</Badge>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">${car.pricePerDay.toFixed(2)}</span>
                <span className="text-lg text-gray-500">per day</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={dateRange.from.toISOString().split('T')[0]}  // Format date to 'yyyy-mm-dd'
                    onChange={(e) => handleDateChange(e, 'from')}
                    min={new Date().toISOString().split('T')[0]}  // Prevent selecting past dates
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={dateRange.to.toISOString().split('T')[0]}  // Format date to 'yyyy-mm-dd'
                    onChange={(e) => handleDateChange(e, 'to')}
                    min={dateRange.from.toISOString().split('T')[0]}  // Prevent selecting end date before start date
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <p className="text-lg font-semibold">Total Price: ${calculateTotalPrice().toFixed(2)}</p>
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{car.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between mt-6">
            <Button onClick={addToCart} className="flex-1" disabled={!car.available || isLoading}>
              <ShoppingCart className="mr-2 h-4 w-4" /> {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
