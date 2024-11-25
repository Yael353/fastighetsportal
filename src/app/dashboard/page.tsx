'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { setProperties } from '@/lib/slices/propertySlice'
import { AppDispatch, RootState } from '@/lib/store'

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const properties = useSelector((state: RootState) => state.property.properties)

  useEffect(() => {
    // Simulerar ett API-anrop för att hämta fastighetsdata
    const fetchProperties = async () => {
      // I en riktig applikation skulle du hämta denna data från ett API
      const data = [
        { id: '1', name: 'Tornhuset', address: 'Storgatan 1, Stockholm', type: 'Kontor' },
        { id: '2', name: 'Sjövillan', address: 'Strandvägen 10, Göteborg', type: 'Bostad' },
        { id: '3', name: 'Industriporten', address: 'Fabriksgatan 5, Malmö', type: 'Industri' },
        { id: '4', name: 'Industriporten', address: 'Fabriksgatan 5, Malmö', type: 'Industri' },
        { id: '5', name: 'Industriporten', address: 'Fabriksgatan 5, Malmö', type: 'Industri' },
        { id: '6', name: 'Industriporten', address: 'Fabriksgatan 5, Malmö', type: 'Industri' },
        { id: '7', name: 'Industriporten', address: 'Fabriksgatan 5, Malmö', type: 'Industri' },
        { id: '8', name: 'Industriporten', address: 'Fabriksgatan 5, Malmö', type: 'Industri' },
        { id: '9', name: 'Industriporten', address: 'Fabriksgatan 5, Malmö', type: 'Industri' },
      ]
      dispatch(setProperties(data))
    }

    fetchProperties()
  }, [dispatch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fastighetsöversikt</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle>{property.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Adress:</strong> {property.address}</p>
              <p><strong>Typ:</strong> {property.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

