"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Scene, PlotThread, StoryStructure } from "@/types"

interface SceneDetailsProps {
  scene: Scene
  plotThreads: PlotThread[]
  onUpdate: (scene: Scene) => void
  selectedStructure: StoryStructure | null
}

const SceneDetails: React.FC<SceneDetailsProps> = ({ scene, plotThreads, onUpdate, selectedStructure }) => {
  const [title, setTitle] = useState(scene.title)
  const [description, setDescription] = useState(scene.description)
  const [selectedThreads, setSelectedThreads] = useState(scene.plotThreads)
  const [selectedBeat, setSelectedBeat] = useState(scene.selectedBeat || "")

  useEffect(() => {
    setTitle(scene.title)
    setDescription(scene.description)
    setSelectedThreads(scene.plotThreads)
    setSelectedBeat(scene.selectedBeat || "")
  }, [scene])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedScene: Scene = {
      ...scene,
      title,
      description,
      plotThreads: selectedThreads,
      type: selectedThreads.length > 1 ? "express" : "local",
      selectedBeat,
    }
    onUpdate(updatedScene)
  }

  const handleBeatChange = (beatId: string) => {
    setSelectedBeat(beatId)
    if (selectedStructure) {
      const beat = selectedStructure.beats.find((b) => b.id === beatId)
      if (beat) {
        if (!title) setTitle(beat.name)
        if (!description) setDescription(beat.description)
        setSelectedThreads((prev) => [...new Set([...prev, ...beat.requiredThreads])])
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Scene Details</h2>
      <div>
        <label htmlFor="scene-title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="scene-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Scene title"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="scene-description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="scene-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Scene description"
          rows={4}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Associated Plot Threads</label>
        <div className="space-y-2">
          {plotThreads.map((thread) => (
            <label key={thread.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedThreads.includes(thread.id)}
                onChange={(e) => {
                  const updatedThreads = e.target.checked
                    ? [...selectedThreads, thread.id]
                    : selectedThreads.filter((id) => id !== thread.id)
                  setSelectedThreads(updatedThreads)
                }}
                className="mr-2"
              />
              <span>{thread.name}</span>
            </label>
          ))}
        </div>
      </div>
      {selectedStructure && (
        <div>
          <label htmlFor="scene-beat" className="block text-sm font-medium text-gray-700">
            Story Beat
          </label>
          <Select value={selectedBeat} onValueChange={handleBeatChange}>
            <SelectTrigger id="scene-beat" className="w-full mt-1">
              <SelectValue placeholder="Select a beat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {selectedStructure.beats.map((beat) => (
                <SelectItem key={beat.id} value={beat.id}>
                  {beat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button type="submit" className="w-full">
        Update Scene
      </Button>
    </form>
  )
}

export default SceneDetails

