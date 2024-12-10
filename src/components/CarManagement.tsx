'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import Modal from './ui/modal'; // Import the Modal component

interface Car {
  _id: string;
  name: string;
  model: string;
  description: string;
  pricePerDay: number;
  available: boolean;
  picture?: string; // URL or path to the car's picture
}

export default function CarManagement() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deleteCarId, setDeleteCarId] = useState<string | null>(null);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    name: '',
    model: '',
    description: '',
    pricePerDay: 0,
    available: true,
  });
  const [newCarImage, setNewCarImage] = useState<File | null>(null); // For new car image upload
  const [editingCarImage, setEditingCarImage] = useState<File | null>(null); // For editing car image upload

  const fetchCars = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cars', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status}`);
      }

      const data: Car[] = await response.json();
      setCars(data);
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleCreateCar = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }

    const formData = new FormData();
    Object.keys(newCar).forEach((key) => {
      formData.append(key, newCar[key as keyof Car] as string | Blob);
    });

    if (newCarImage) {
      formData.append('picture', newCarImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const createdCar = await response.json();
        setCars([...cars, createdCar]);
        setNewCar({ name: '', model: '', description: '', pricePerDay: 0, available: true });
        setNewCarImage(null);
        alert('Car created successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Error creating car.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while creating the car. Please try again.');
    }
  };

  const handleUpdateCar = async () => {
    if (!editingCar) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }

    const formData = new FormData();
    Object.keys(editingCar).forEach((key) => {
      formData.append(key, editingCar[key as keyof Car] as string | Blob);
    });

    if (editingCarImage) {
      formData.append('picture', editingCarImage);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cars/${editingCar._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const updatedCar = await response.json();
        setCars(cars.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
        setEditingCar(null);
        setEditingCarImage(null);
        alert('Car updated successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Error updating car.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while updating the car. Please try again.');
    }
  };

  const handleDeleteCar = async () => {
    if (!deleteCarId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cars/${deleteCarId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCars(cars.filter((car) => car._id !== deleteCarId));
        alert('Car deleted successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Error deleting car.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while deleting the car. Please try again.');
    } finally {
      setDeleteCarId(null); // Close the modal
    }
  };

  if (loading) return <p>Loading cars...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Car Management</CardTitle>
          <CardDescription>Add, edit, or delete cars in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add New Car Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Car</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCar.name}
                  onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pricePerDay">Price per Day</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  value={newCar.pricePerDay || ''}
                  onChange={(e) => setNewCar({ ...newCar, pricePerDay: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="available">Available</Label>
                <Input
                  id="available"
                  type="checkbox"
                  checked={newCar.available}
                  onChange={(e) => setNewCar({ ...newCar, available: e.target.checked })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCar.description}
                onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="picture">Upload Picture</Label>
              <Input
                id="picture"
                type="file"
                onChange={(e) => setNewCarImage(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleCreateCar}>Add Car</Button>
          </div>
  
          {/* Existing Cars Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Existing Cars</h3>
            {cars.length === 0 ? (
              <p>No cars available. Add one above!</p>
            ) : (
              cars.map((car) => (
                <div key={car._id} className="mb-4 p-4 border rounded">
                  {editingCar && editingCar._id === car._id ? (
                    <div className="space-y-4">
                      <Input
                        value={editingCar.name}
                        onChange={(e) => setEditingCar({ ...editingCar, name: e.target.value })}
                      />
                      <Input
                        value={editingCar.model}
                        onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                      />
                      <Textarea
                        value={editingCar.description}
                        onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                      />
                      <Input
                        type="number"
                        value={editingCar.pricePerDay}
                        onChange={(e) =>
                          setEditingCar({ ...editingCar, pricePerDay: parseFloat(e.target.value) })
                        }
                      />
                      <div>
                        <Label htmlFor={`available-${car._id}`}>Available</Label>
                        <Input
                          id={`available-${car._id}`}
                          type="checkbox"
                          checked={editingCar.available}
                          onChange={(e) =>
                            setEditingCar({ ...editingCar, available: e.target.checked })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`picture-${car._id}`}>Upload Picture</Label>
                        <Input
                          id={`picture-${car._id}`}
                          type="file"
                          onChange={(e) =>
                            setEditingCarImage(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                      <Button onClick={handleUpdateCar}>Save Changes</Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingCar(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4">
                        {car.picture && (
                          <img
                            src={car.picture}
                            alt={`${car.name} ${car.model}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-semibold">
                            {car.name} {car.model}
                          </h4>
                          <p>{car.description}</p>
                          <p>Price per day: ${car.pricePerDay}</p>
                          <p>Available: {car.available ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button onClick={() => setEditingCar(car)}>Edit</Button>
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteCarId(car._id)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
  
      {/* Delete Confirmation Modal */}
      {deleteCarId && (
        <Modal
          title="Confirm Delete"
          onClose={() => setDeleteCarId(null)}
          onConfirm={handleDeleteCar}
        >
          Are you sure you want to delete this car?
        </Modal>
      )}
    </>
  );
  
}