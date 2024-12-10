import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Navbar from './Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Welcome to Car Rentals</h1>
          <p className="text-xl text-gray-600 mb-8">Discover the perfect car for your next adventure</p>
          <Link to="/cars">
            <Button size="lg">Browse Our Cars</Button>
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Wide Selection</h2>
            <p className="text-gray-600">Choose from our diverse fleet of vehicles to suit any occasion.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Affordable Rates</h2>
            <p className="text-gray-600">Enjoy competitive pricing and special deals on long-term rentals.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">24/7 Support</h2>
            <p className="text-gray-600">Our customer service team is always ready to assist you.</p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to hit the road?</h2>
          <p className="text-xl text-gray-600 mb-8">Book your car rental today and start your journey!</p>
          <Link to="/cars">
            <Button size="lg" variant="outline">View Available Cars</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
