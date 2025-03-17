"use client"

import { useState } from "react"
import { Search, Calendar, Trash, Edit, Clock, CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusButton } from "@/components/ui/plus-button"
import { CreateFileDialog } from "@/components/create-file-dialog"

type Medication = {
  id: string
  name: string
  dosage: string
  days: number
  times: {
    time: string
    relation: string
  }[]
}

export function RemindersPage() {
  const [medications] = useState<Medication[]>([
    {
      id: "1",
      name: "Paracetamol",
      dosage: "500mg",
      days: 22,
      times: [
        { time: "Noon", relation: "Before Meal" },
        { time: "09:24", relation: "After Meal" },
      ],
    },
    {
      id: "2",
      name: "Vasograin",
      dosage: "20mg",
      days: 12,
      times: [
        { time: "Noon", relation: "Before Meal" },
        { time: "09:24", relation: "After Meal" },
      ],
    },
    {
      id: "3",
      name: "Paracetamol",
      dosage: "500mg",
      days: 22,
      times: [
        { time: "Noon", relation: "Before Meal" },
        { time: "09:24", relation: "After Meal" },
      ],
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-400">My Reminders</h1>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search your meds..."
            className="pl-10 bg-white dark:bg-gray-800 border-teal-100 dark:border-gray-700"
          />
        </div>

        <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-800">
          <Calendar size={16} />
          <span>Date</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med) => (
          <Card key={med.id} className="bg-teal-500/90 text-white overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium">{med.name}</h3>
                  <Badge variant="outline" className="mt-1 bg-white/20 text-white border-none">
                    {med.dosage}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Trash size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Edit size={18} />
                  </Button>
                </div>
              </div>

              <div className="px-4 py-3 flex items-center justify-between bg-teal-600/50">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Dosage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  <span>{med.days} Days</span>
                </div>
              </div>

              {med.times.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-teal-600/30 border-t border-teal-400/20"
                >
                  <div className="bg-teal-600/50 px-3 py-1 rounded-full text-sm">{time.time}</div>
                  <div className="text-sm">{time.relation}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <PlusButton onClick={() => setShowCreateDialog(true)} />
      <CreateFileDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          setShowCreateDialog(false)
          // Handle success
        }}
      />
    </div>
  )
}
