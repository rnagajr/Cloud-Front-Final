'use client'

import { useState, useEffect } from 'react'
import { Trash2, Calendar } from 'lucide-react'
import { Button } from "./ui/button"
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Navbar from './Navbar'

type Car = {
  _id: string
  name: string
  model: string
  pricePerDay: number
}

type CartItem = {
  car: Car
  startDate: string
  endDate: string
  days: number
  pricePerDay: number
}

type Cart = {
  _id: string
  user: string
  items: CartItem[]
  totalAmount: number
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found, redirecting to login')
        return
      }
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const cartData = await response.json()
        setCart(cartData)
      } else {
        console.error('Failed to fetch cart, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (carId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart/item', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ carId }),
        });
        if (response.ok) {
            const updatedCart = await response.json();
            setCart(updatedCart); // Update the cart state with the new data
        } else {
            console.error('Failed to remove item from cart, status:', response.status);
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
};

  

  const updateDates = (carId: string, newStartDate: string, newEndDate: string) => {
    if (!cart) return

    const updatedItems = cart.items.map((item) => {
      if (item.car._id === carId) {
        const startDate = new Date(newStartDate)
        const endDate = new Date(newEndDate)
        const days = Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

        return {
          ...item,
          startDate: newStartDate,
          endDate: newEndDate,
          days,
        }
      }
      return item
    })

    const updatedTotalAmount = updatedItems.reduce(
      (total, item) => total + item.days * item.pricePerDay,
      0
    )

    setCart({
      ...cart,
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    })
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Rental Cart</h1>
        {cart && cart.items && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.car._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.car.name}</h3>
                        <p className="text-sm text-gray-600">{item.car.model}</p>
                        <p className="text-lg font-bold mt-2">
                          ${item.pricePerDay.toFixed(2)} per day
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.car._id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`start-date-${item.car._id}`}>Start Date</Label>
                        <div className="relative">
                          <Input
                            id={`start-date-${item.car._id}`}
                            type="date"
                            value={item.startDate.split('T')[0]}
                            onChange={(e) => updateDates(item.car._id, e.target.value, item.endDate)}
                            className="pl-10"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`end-date-${item.car._id}`}>End Date</Label>
                        <div className="relative">
                          <Input
                            id={`end-date-${item.car._id}`}
                            type="date"
                            value={item.endDate.split('T')[0]}
                            onChange={(e) => updateDates(item.car._id, item.startDate, e.target.value)}
                            className="pl-10"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Duration: {item.days} days
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Rental Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${cart.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/checkout">
                    <Button className="w-full">Proceed to Booking</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Your rental cart is empty</p>
            <Button asChild>
              <Link to="/cars">Browse Available Cars</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
