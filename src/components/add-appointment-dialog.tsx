"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface AddAppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (appointment: {
    doctor: string
    speciality: string
    date: string
    time: string
    location: string
    id?: string
  }) => void
  appointmentToEdit?: {
    $id: string
    doctor: string
    speciality: string
    date: string
    time: string
    location: string
  }
}

export function AddAppointmentDialog({ isOpen, onClose, onAdd, appointmentToEdit }: AddAppointmentDialogProps) {
  const [appointmentData, setAppointmentData] = useState({
    doctor: "",
    speciality: "",
    date: "",
    time: "",
    location: ""
  })

  useEffect(() => {
    if (appointmentToEdit) {
      setAppointmentData({
        doctor: appointmentToEdit.doctor,
        speciality: appointmentToEdit.speciality,
        date: appointmentToEdit.date,
        time: appointmentToEdit.time,
        location: appointmentToEdit.location
      })
    } else {
      setAppointmentData({
        doctor: "",
        speciality: "",
        date: "",
        time: "",
        location: ""
      })
    }
  }, [appointmentToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...appointmentData,
      ...(appointmentToEdit && { id: appointmentToEdit.$id })
    })
    setAppointmentData({ doctor: "", speciality: "", date: "", time: "", location: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{appointmentToEdit ? 'Edit Appointment' : 'Add New Appointment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor Name</Label>
            <Input
              id="doctor"
              value={appointmentData.doctor}
              onChange={(e) => setAppointmentData({ ...appointmentData, doctor: e.target.value })}
              placeholder="Enter doctor's name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speciality">Speciality</Label>
            <Input
              id="speciality"
              value={appointmentData.speciality}
              onChange={(e) => setAppointmentData({ ...appointmentData, speciality: e.target.value })}
              placeholder="e.g., Cardiologist"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={appointmentData.date}
              onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={appointmentData.time}
              onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={appointmentData.location}
              onChange={(e) => setAppointmentData({ ...appointmentData, location: e.target.value })}
              placeholder="Enter clinic/hospital name"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{appointmentToEdit ? 'Update Appointment' : 'Add Appointment'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}