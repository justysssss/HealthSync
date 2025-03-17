"use client"

import { useState, useEffect } from "react"
import {
  createMedication,
  createAppointment,
  listMedications,
  listAppointments,
  type MedicationDocument,
  type AppointmentDocument,
} from "@/lib/appwrite"
import { Search, Pill, Activity, Stethoscope, PenLine } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { PlusButton } from "@/components/ui/plus-button"
import { AddMedicationDialog } from "@/components/add-medication-dialog"
import { AddAppointmentDialog } from "@/components/add-appointment-dialog"

export function MedkitPage() {
  const [activeTab, setActiveTab] = useState("medications")
  const [medications, setMedications] = useState<MedicationDocument[]>([])
  const [appointments, setAppointments] = useState<AppointmentDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMedicationDialog, setShowMedicationDialog] = useState(false)
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medsData, apptsData] = await Promise.all([listMedications(), listAppointments()])
        setMedications(medsData)
        setAppointments(apptsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const sortedAppointments = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const handleAddMedication = async (data: {
    name: string
    dosage: string
    totalDays: number
    schedule: string
  }) => {
    try {
      const newMedication = (await createMedication({
        name: data.name,
        dosage: data.dosage,
        totalDays: data.totalDays,
        remaining: data.totalDays,
        schedule: data.schedule,
      })) as MedicationDocument
      setMedications([...medications, newMedication])
      setShowMedicationDialog(false)
    } catch (error) {
      console.error("Error adding medication:", error)
    }
  }

  const handleAddAppointment = async (data: {
    doctor: string
    speciality: string
    date: string
    time: string
    location: string
  }) => {
    try {
      const newAppointment = (await createAppointment({
        doctor: data.doctor,
        speciality: data.speciality,
        date: data.date,
        time: data.time,
        location: data.location,
      })) as AppointmentDocument
      setAppointments([...appointments, newAppointment])
      setShowAppointmentDialog(false)
    } catch (error) {
      console.error("Error adding appointment:", error)
    }
  }

  const handleEditAppointment = (appointmentId: string) => {
    const appointment = appointments.find((a) => a.$id === appointmentId)
    if (appointment) {
      setShowAppointmentDialog(true)
      // You would need to update the AddAppointmentDialog to handle editing mode
      // and pre-fill the form with existing appointment data
    }
  }

  const handleEditMedication = (medicationId: string) => {
    const medication = medications.find((m) => m.$id === medicationId)
    if (medication) {
      setShowMedicationDialog(true)
      // You would need to update the AddMedicationDialog to handle editing mode
      // and pre-fill the form with existing medication data
    }
  }

  const handlePlusClick = () => {
    if (activeTab === "medications") {
      setShowMedicationDialog(true)
    } else if (activeTab === "appointments") {
      setShowAppointmentDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-teal-700 dark:text-teal-400">Medkit</h1>

      <Tabs defaultValue="medications" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            <div className="flex-1" />
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search medications..."
                className="pl-10 bg-white dark:bg-gray-800 border-teal-100 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med) => (
              <Card key={med.$id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {med.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                        {med.dosage} - {med.schedule}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400"
                      onClick={() => handleEditMedication(med.$id)}
                    >
                      <PenLine size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        Remaining: {med.remaining} of {med.totalDays} days
                      </span>
                      <span className="font-medium">{Math.round((med.remaining / med.totalDays) * 100)}%</span>
                    </div>
                    <Progress
                      value={(med.remaining / med.totalDays) * 100}
                      className="h-2 bg-gray-100 dark:bg-gray-700"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <div className="flex items-center justify-end mb-4">
            <div className="relative w-64 transition-all duration-300 focus-within:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search appointments..."
                className="pl-10 pr-4 bg-white dark:bg-gray-800 border-teal-100 dark:border-gray-700 transition-all duration-300 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {sortedAppointments.map((apt) => (
              <Card
                key={apt.$id}
                className="overflow-hidden border-l-4 border-l-teal-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row items-stretch">
                  {/* Date/Time Column */}
                  <div className="flex-shrink-0 bg-teal-50 dark:bg-teal-900/30 p-4 sm:p-5 flex flex-col justify-center items-center sm:min-w-[120px]">
                    <p className="text-teal-700 dark:text-teal-300 font-bold text-lg">
                      {new Date(apt.date).toLocaleDateString("en-US", {
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">
                      {new Date(apt.date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </p>
                    <div className="mt-2 pt-2 border-t border-teal-200 dark:border-teal-700/50 w-full text-center">
                      <p className="text-teal-700 dark:text-teal-400 font-medium">{formatTime(apt.time)}</p>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-grow p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dr. {apt.doctor}</h3>
                        <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mt-1">{apt.speciality}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400"
                        onClick={() => handleEditAppointment(apt.$id)}
                      >
                        <PenLine size={16} />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
                        <span className="text-sm">{apt.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {sortedAppointments.length === 0 && (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No appointments scheduled</p>
                <Button
                  variant="outline"
                  className="mt-4 text-teal-600 border-teal-300 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-700 dark:hover:bg-teal-900/20"
                  onClick={() => setShowAppointmentDialog(true)}
                >
                  Schedule your first appointment
                </Button>
              </div>
            )}
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

      <PlusButton onClick={handlePlusClick} />
      <AddMedicationDialog
        isOpen={showMedicationDialog}
        onClose={() => setShowMedicationDialog(false)}
        onAdd={handleAddMedication}
      />
      <AddAppointmentDialog
        isOpen={showAppointmentDialog}
        onClose={() => setShowAppointmentDialog(false)}
        onAdd={handleAddAppointment}
      />
    </div>
  )
}

