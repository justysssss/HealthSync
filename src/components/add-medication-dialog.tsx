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

interface AddMedicationDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (medication: {
    name: string
    dosage: string
    totalDays: number
    schedule: string
    id?: string
  }) => void
  medicationToEdit?: {
    $id: string
    name: string
    dosage: string
    totalDays: number
    schedule: string
    remaining: number
  }
}

export function AddMedicationDialog({ isOpen, onClose, onAdd, medicationToEdit }: AddMedicationDialogProps) {
  const [medicationData, setMedicationData] = useState({
    name: "",
    dosage: "",
    totalDays: "",
    schedule: ""
  })

  useEffect(() => {
    if (medicationToEdit) {
      setMedicationData({
        name: medicationToEdit.name,
        dosage: medicationToEdit.dosage,
        totalDays: medicationToEdit.totalDays.toString(),
        schedule: medicationToEdit.schedule
      })
    } else {
      setMedicationData({
        name: "",
        dosage: "",
        totalDays: "",
        schedule: ""
      })
    }
  }, [medicationToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      name: medicationData.name,
      dosage: medicationData.dosage,
      totalDays: parseInt(medicationData.totalDays),
      schedule: medicationData.schedule,
      ...(medicationToEdit && { id: medicationToEdit.$id })
    })
    setMedicationData({ name: "", dosage: "", totalDays: "", schedule: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{medicationToEdit ? 'Edit Medication' : 'Add New Medication'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medicine Name</Label>
            <Input
              id="name"
              value={medicationData.name}
              onChange={(e) => setMedicationData({ ...medicationData, name: e.target.value })}
              placeholder="Enter medicine name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={medicationData.dosage}
              onChange={(e) => setMedicationData({ ...medicationData, dosage: e.target.value })}
              placeholder="e.g., 500mg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalDays">Duration (days)</Label>
            <Input
              id="totalDays"
              type="number"
              value={medicationData.totalDays}
              onChange={(e) => setMedicationData({ ...medicationData, totalDays: e.target.value })}
              placeholder="Number of days"
              required
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              value={medicationData.schedule}
              onChange={(e) => setMedicationData({ ...medicationData, schedule: e.target.value })}
              placeholder="e.g., Twice daily"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{medicationToEdit ? 'Update Medication' : 'Add Medication'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}