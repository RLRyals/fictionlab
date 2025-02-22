import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { PlotThread } from "@/types"

interface PlotThreadEditorProps {
  thread: PlotThread
  onUpdate: (updatedThread: PlotThread) => void
  onDelete: (threadId: string) => void
}

const PlotThreadEditor: React.FC<PlotThreadEditorProps> = ({ thread, onUpdate, onDelete }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...thread, name: e.target.value })
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...thread, color: e.target.value })
  }

  const handleMainToggle = (checked: boolean) => {
    onUpdate({ ...thread, isMain: checked })
  }

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div>
        <Label htmlFor={`thread-name-${thread.id}`}>Name</Label>
        <Input id={`thread-name-${thread.id}`} value={thread.name} onChange={handleNameChange} />
      </div>
      <div>
        <Label htmlFor={`thread-color-${thread.id}`}>Color</Label>
        <Input id={`thread-color-${thread.id}`} type="color" value={thread.color} onChange={handleColorChange} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id={`thread-main-${thread.id}`} checked={thread.isMain} onCheckedChange={handleMainToggle} />
        <Label htmlFor={`thread-main-${thread.id}`}>Main Thread</Label>
      </div>
      <Button variant="destructive" onClick={() => onDelete(thread.id)}>
        Delete Thread
      </Button>
    </div>
  )
}

export default PlotThreadEditor

