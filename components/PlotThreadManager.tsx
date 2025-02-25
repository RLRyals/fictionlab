"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PlotThread } from "@/types"
import PlotThreadEditor from "./PlotThreadEditor"

interface PlotThreadManagerProps {
  plotThreads: PlotThread[]
  onAddPlotThread: (thread: PlotThread) => void
  onUpdatePlotThread: (updatedThread: PlotThread) => void
  onDeletePlotThread: (threadId: string) => void
}

const PlotThreadManager: React.FC<PlotThreadManagerProps> = ({
  plotThreads,
  onAddPlotThread,
  onUpdatePlotThread,
  onDeletePlotThread,
}) => {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#000000")
  const [mdq, setMdq] = useState("")
  const [ldq, setLdq] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      onAddPlotThread({
        id: Date.now().toString(),
        name,
        color,
        isMain: plotThreads.length === 0, // First thread is main by default
        mdq,
        ldq,
      })
      setName("")
      setColor("#000000")
      setMdq("")
      setLdq("")
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Plot Threads</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div>
          <Label htmlFor="thread-name">Thread Name</Label>
          <Input
            id="thread-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter thread name"
          />
        </div>
        <div>
          <Label htmlFor="thread-color">Thread Color</Label>
          <Input id="thread-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="thread-mdq">Main Dramatic Question</Label>
        </div>
        <div>
          <Label htmlFor="thread-mdq">Main Dramatic Question</Label>
          <Input
            id="thread-mdq"
            type="text"
            value={mdq}
            onChange={(e) => setMdq(e.target.value)}
            placeholder="Enter main dramatic question"
          />
        </div>
        <div>
          <Label htmlFor="thread-ldq">Lesser Dramatic Question</Label>
          <Input
            id="thread-ldq"
            type="text"
            value={ldq}
            onChange={(e) => setLdq(e.target.value)}
            placeholder="Enter lesser dramatic question"
          />
        </div>
        <Button type="submit" className="w-full">
          Add Plot Thread
        </Button>
      </form>
      <div className="space-y-4">
        {plotThreads.map((thread) => (
          <PlotThreadEditor
            key={thread.id}
            thread={thread}
            onUpdate={onUpdatePlotThread}
            onDelete={onDeletePlotThread}
          />
        ))}
      </div>
    </div>
  )
}

export default PlotThreadManager

