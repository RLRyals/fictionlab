"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Scene, PlotThread } from "@/types"

interface SceneDetailsProps {
  scene: Scene
  plotThreads: PlotThread[]
  onUpdate: (scene: Scene) => void
}

const SceneDetails: React.FC<SceneDetailsProps> = ({ scene, plotThreads, onUpdate }) => {
  const [title, setTitle] = useState(scene.title)
  const [description, setDescription] = useState(scene.description)
  const [selectedThreads, setSelectedThreads] = useState(scene.plotThreads)

  useEffect(() => {
    setTitle(scene.title)
    setDescription(scene.description)
    setSelectedThreads(scene.plotThreads)
  }, [scene])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedScene: Scene = {
      ...scene,
      title,
      description,
      plotThreads: selectedThreads,
      type: selectedThreads.length > 1 ? "express" : "local",
    }
    onUpdate(updatedScene)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Scene Details</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Scene title"
        className="w-full p-2 mb-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Scene description"
        className="w-full p-2 mb-2 border rounded h-32"
      ></textarea>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Associated Plot Threads</h3>
        {plotThreads.map((thread) => (
          <label key={thread.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedThreads.includes(thread.id)}
              onChange={(e) => {
                const updatedThreads = e.target.checked
                  ? [...selectedThreads, thread.id]
                  : selectedThreads.filter((id) => id !== thread.id)
                setSelectedThreads(updatedThreads)
                const updatedScene: Scene = {
                  ...scene,
                  plotThreads: updatedThreads,
                  type: updatedThreads.length > 1 ? "express" : "local",
                }
                onUpdate(updatedScene)
              }}
              className="mr-2"
            />
            <span>{thread.name}</span>
          </label>
        ))}
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Update Scene
      </button>
    </form>
  )
}

export default SceneDetails

