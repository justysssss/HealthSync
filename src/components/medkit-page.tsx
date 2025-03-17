"use client"

import { useState } from "react"
import { Search, Plus, Pill, Activity, Stethoscope } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { PlusButton } from "@/components/ui/plus-button"
import { CreateFileDialog } from "@/components/create-file-dialog"

type Medication = {
  id: string
  name: string
  dosage: string
  remaining: number
  totalDays: number
  schedule: string
}

type Appointment = {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
}

export function MedkitPage() {
  const [medications] = useState<Medication[]>([
    { id: "1", name: "Paracetamol", dosage: "500mg", remaining: 15, totalDays: 30, schedule: "Twice daily" },
    { id: "2", name: "Vasograin", dosage: "20mg", remaining: 8, totalDays: 14, schedule: "Once daily" },
    { id: "3", name: "Amoxicillin", dosage: "250mg", remaining: 5, totalDays: 7, schedule: "Three times daily" },
  ])

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2023-04-15",
      time: "10:30 AM",
      location: "Heart Care Center",
    },
    {
      id: "2",
      doctor: "Dr. Michael Chen",
      specialty: "Neurologist",
      date: "2023-04-22",
      time: "2:15 PM",
      location: "Neurology Associates",
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-teal-700 dark:text-teal-400">Medkit</h1>

      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="bg-white dark:bg-gray-800 mb-4">
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill size={16} />
            <span>Medications</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Stethoscope size={16} />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <Activity size={16} />
            <span>Vitals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search medications..."
                className="pl-10 bg-white dark:bg-gray-800 border-teal-100 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med) => (
              <Card key={med.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{med.name}</CardTitle>
                      <CardDescription>
                        {med.dosage} - {med.schedule}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Plus size={18} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Remaining: {med.remaining} days</span>
                      <span>{Math.round((med.remaining / med.totalDays) * 100)}%</span>
                    </div>
                    <Progress value={(med.remaining / med.totalDays) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search appointments..."
                className="pl-10 bg-white dark:bg-gray-800 border-teal-100 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-4">
            {appointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg">{apt.doctor}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{apt.specialty}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      <div className="bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-md">
                        <p className="text-teal-700 dark:text-teal-400 font-medium">
                          {new Date(apt.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-teal-600 dark:text-teal-500 text-sm">{apt.time}</p>
                      </div>

                      <div>
                        <p className="text-gray-700 dark:text-gray-300">{apt.location}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Heart Rate</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-teal-600">72</p>
                    <p className="text-sm text-gray-500">BPM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blood Pressure</CardTitle>
                <CardDescription>Last reading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-teal-600">120/80</p>
                    <p className="text-sm text-gray-500">mmHg</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blood Glucose</CardTitle>
                <CardDescription>Last reading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-teal-600">98</p>
                    <p className="text-sm text-gray-500">mg/dL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
