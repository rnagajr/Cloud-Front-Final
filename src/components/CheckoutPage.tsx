'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Navbar from './Navbar'

type CartItem = {
  car: { name: string, model: string, pricePerDay: number }
  startDate: string
  endDate: string
  days: number
}

type Cart = {
  items: CartItem[]
  totalAmount: number
}

export default function BookingPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pickupAddress, setPickupAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolderName: "",
    expirationDate: "",
    cvv: ""
  })
  const [bookingStatus, setBookingStatus] = useState<string | null>(null)

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

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found, redirecting to login");
        return;
    }

    const bookingData = {
        paymentMethod,
        pickupAddress,
        cardInfo: paymentMethod === "card" ? cardInfo : null,
    };

    try {
        const response = await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bookingData),
        });

        if (response.status === 201) {
            const data = await response.json();
            setBookingStatus(
                "Booking confirmed successfully! Check your email for confirmation."
            );
        } else {
            const errorData = await response.json();
            setBookingStatus(`Booking failed: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Error during booking:", error);
        setBookingStatus("Booking failed. Please try again.");
    }
};

  

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Car Booking</h1>
        {cart && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {cart.items.map((item, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{item.car.name}</h3>
                    <p className="text-sm text-gray-600">{item.car.model}</p>
                    <p className="text-lg font-bold mt-2">${item.car.pricePerDay.toFixed(2)} per day</p>
                    <p className="text-md">Duration: {item.days} days</p>
                    <p className="text-sm">From: {new Date(item.startDate).toLocaleDateString()}</p>
                    <p className="text-sm">To: {new Date(item.endDate).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${cart.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Pickup Address"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <div className="mt-2">
                      <label className="mr-2">Payment Method:</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="card">Card</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          placeholder="Card Number"
                          value={cardInfo.cardNumber}
                          onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="Card Holder Name"
                          value={cardInfo.cardHolderName}
                          onChange={(e) => setCardInfo({...cardInfo, cardHolderName: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="Expiration Date (MM/YY)"
                          value={cardInfo.expirationDate}
                          onChange={(e) => setCardInfo({...cardInfo, expirationDate: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleBooking}>Confirm Booking</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty</p>
          </div>
        )}
        {bookingStatus && (
          <div className="mt-4 text-center text-lg font-semibold">
            {bookingStatus}
          </div>
        )}
      </main>
    </div>
  )
}

