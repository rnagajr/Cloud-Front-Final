import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Navbar from './Navbar';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Add Navbar */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input id="name" type="text" placeholder="Your Name" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                placeholder="Your message here..."
                rows={5}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
          <p className="text-gray-600 mb-2">Phone: (123) 456-7890</p>
          <p className="text-gray-600 mb-2">Email: support@carrentals.com</p>
          <p className="text-gray-600">Address: 123 Car Street, Auto City, AC 12345</p>
        </div>
      </main>
    </div>
  );
}
