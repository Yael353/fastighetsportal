'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Mockdata (oförändrad)
const allProperties = [
  { id: 1, name: "Tornhuset", address: "Storgatan 1, Stockholm", type: "Kontor", size: 5000 },
  { id: 2, name: "Sjövillan", address: "Strandvägen 10, Göteborg", type: "Bostad", size: 200 },
  { id: 3, name: "Industriporten", address: "Fabriksgatan 5, Malmö", type: "Industri", size: 10000 },
  { id: 4, name: "Centrumgallerian", address: "Kungsgatan 22, Uppsala", type: "Handel", size: 15000 },
  { id: 5, name: "Parkvillan", address: "Grönvägen 8, Linköping", type: "Bostad", size: 180 },
  { id: 6, name: "Kontorspalatset", address: "Företagsgatan 15, Stockholm", type: "Kontor", size: 8000 },
  { id: 7, name: "Havsutsikten", address: "Klippvägen 3, Helsingborg", type: "Bostad", size: 220 },
  { id: 8, name: "Lagerhallen", address: "Industrivägen 7, Västerås", type: "Industri", size: 12000 },
  { id: 9, name: "Shoppingcentret", address: "Köpmansgatan 11, Örebro", type: "Handel", size: 20000 },
  { id: 10, name: "Villaområdet", address: "Villavägen 1-10, Umeå", type: "Bostad", size: 1500 },
  { id: 11, name: "Kontorskomplexet", address: "Affärsgatan 20, Jönköping", type: "Kontor", size: 6000 },
  { id: 12, name: "Strandvillan", address: "Strandpromenaden 5, Ystad", type: "Bostad", size: 250 },
  { id: 13, name: "Fabriksområdet", address: "Produktionsvägen 8, Norrköping", type: "Industri", size: 15000 },
  { id: 14, name: "Gallerian", address: "Butiksgatan 30, Luleå", type: "Handel", size: 18000 },
  { id: 15, name: "Radhusområdet", address: "Grannskapsvägen 1-20, Växjö", type: "Bostad", size: 2000 },
]

export function PropertyList() {
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 10
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = allProperties.slice(indexOfFirstProperty, indexOfLastProperty)
  const totalPages = Math.ceil(allProperties.length / propertiesPerPage)

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto">
        <Table>
{/*           <TableCaption>En lista över fastigheter</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Namn</TableHead>
              <TableHead className="w-1/4">Adress</TableHead>
              <TableHead className="w-1/4">Typ</TableHead>
              <TableHead className="w-1/4 text-right">Storlek (m²)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell className="text-right">{property.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex justify-between items-center p-4 border-t">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Föregående
        </Button>
        <span>Sida {currentPage} av {totalPages}</span>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Nästa <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

