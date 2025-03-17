"use client"

import { useState, useEffect } from "react"
import {
  createMedication,
  createAppointment,
  listMedications,
  listAppointments,
  updateMedication,
  type MedicationDocument,
  type AppointmentDocument
} from "@/lib/appwrite"
import { Search, Plus, Pill, Activity, Stethoscope } from "lucide-react"
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
        const [medsData, apptsData] = await Promise.all([
          listMedications(),
          listAppointments()
        ]);
        setMedications(medsData);
        setAppointments(apptsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const sortedAppointments = [...appointments].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const incrementMedicationDay = async (medicationId: string) => {
    const medication = medications.find(m => m.$id === medicationId);
    if (medication && medication.remaining < medication.totalDays) {
      try {
        const updated = await updateMedication(medicationId, {
          remaining: medication.remaining + 1
        }) as MedicationDocument;
        setMedications(medications.map(m => 
          m.$id === medicationId ? updated : m
        ));
      } catch (error) {
        console.error('Error updating medication:', error);
      }
    }
  };

  const handleAddMedication = async (data: {
    name: string
    dosage: string
    totalDays: number
    schedule: string
  }) => {
    try {
      const newMedication = await createMedication({
        name: data.name,
        dosage: data.dosage,
        totalDays: data.totalDays,
        remaining: data.totalDays,
        schedule: data.schedule
      }) as MedicationDocument;
      setMedications([...medications, newMedication]);
      setShowMedicationDialog(false);
    } catch (error) {
      console.error('Error adding medication:', error);
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
      const newAppointment = await createAppointment({
        doctor: data.doctor,
        speciality: data.speciality,
        date: data.date,
        time: data.time,
        location: data.location
      }) as AppointmentDocument;
      setAppointments([...appointments, newAppointment]);
      setShowAppointmentDialog(false);
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  }

  const handlePlusClick = () => {
    if (activeTab === "medications") {
      setShowMedicationDialog(true);
    } else if (activeTab === "appointments") {
      setShowAppointmentDialog(true);
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
              <Card key={med.$id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{med.name}</CardTitle>
                      <CardDescription>
                        {med.dosage} - {med.schedule}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500"
                      onClick={() => incrementMedicationDay(med.$id)}
                      disabled={med.remaining >= med.totalDays}
                    >
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
            {sortedAppointments.map((apt) => (
              <Card key={apt.$id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg">{apt.doctor}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{apt.speciality}</p>
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
                        <p className="text-teal-600 dark:text-teal-500 text-sm">{formatTime(apt.time)}</p>
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
