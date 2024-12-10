'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Navbar from './Navbar';

type Car = {
  _id: string;
  name: string;
  model: string;
  pricePerDay: number;
  available: boolean;
  description: string;
  picture: string; 
};

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cars');
      const data: Car[] = await response.json();
      console.log(data);  // Log the full response to check if the picture URL is correct
      setCars(data);
      const uniqueModels: string[] = Array.from(new Set(data.map((car: Car) => car.model)));
      setModels(['All', ...uniqueModels]);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };
  

  const filteredCars = cars.filter(car => 
    (selectedModel === "All" || car.model === selectedModel) &&
    (car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     car.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const availableCars = filteredCars.filter(car => car.available);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-8">
            <aside className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      type="text"
                      placeholder="Search cars..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="col-span-3 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Available Cars</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCars.map(car => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">All Cars</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map(car => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function CarCard({ car }: { car: Car }) {
  const imageUrl = car.picture ? `http://localhost:5000${car.picture}` : "/placeholder.svg";
  return (
    <Card>
      <Link to={`/cars/${car._id}`} className="block">
        <CardHeader>
        <img src={imageUrl} alt={car.name} className="w-full h-48 object-cover" />
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold">{car.name}</h3>
          <p className="text-sm text-gray-600">{car.model}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold">${car.pricePerDay.toFixed(2)}/day</span>
            <Badge>{car.available ? 'Available' : 'Unavailable'}</Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
