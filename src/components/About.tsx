import { Car, Clock, Users } from 'lucide-react';
import Navbar from './Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Add Navbar */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">About Car Rentals</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 mb-8">
            Car Rentals has been providing top-quality car rental services since 2005. Our mission is to offer a wide range of vehicles to suit every need and budget, ensuring our customers have the best possible experience on the road.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Car className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">200+ Vehicles</h2>
              <p className="text-gray-600">A diverse fleet to choose from</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">50,000+ Customers</h2>
              <p className="text-gray-600">Satisfied clients and counting</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">24/7 Support</h2>
              <p className="text-gray-600">Always here when you need us</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="text-lg text-gray-600 mb-8">
            At Car Rentals, we're committed to providing exceptional service, maintaining a modern and well-serviced fleet, and ensuring the utmost convenience for our customers. Whether you're traveling for business or pleasure, we've got the perfect vehicle for your journey.
          </p>
          <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-lg text-gray-600 mb-8">
            <li>Competitive rates and flexible rental options</li>
            <li>Easy online booking and fast pick-up process</li>
            <li>Well-maintained, clean, and safe vehicles</li>
            <li>Convenient locations across the country</li>
            <li>Excellent customer service and support</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
