"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Scene, PlotThread } from "@/types"
import saveAs from "file-saver"

interface FileManagerProps {
  scenes: Scene[]
  plotThreads: PlotThread[]
  onDataImport: (scenes: Scene[], plotThreads: PlotThread[]) => void
}

export function FileManager({ scenes, plotThreads, onDataImport }: FileManagerProps) {
  const [jsonContent, setJsonContent] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setJsonContent(text)

        try {
          const data = JSON.parse(text)
          onDataImport(data.scenes, data.plotThreads)
        } catch (error) {
          console.error("Error parsing JSON:", error)
          alert("Error parsing JSON file. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  const exportData = () => {
    const data = {
      scenes,
      plotThreads,
    }
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" })
    saveAs(blob, "story_map_export.json")
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Input type="file" accept=".json" onChange={handleFileUpload} className="max-w-xs" />
        <Button onClick={exportData}>Export Data</Button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">JSON Format:</h3>
        <pre className="bg-muted p-2 rounded overflow-x-auto">
          {`{
  "scenes": [
    {
      "id": "scene-1",
      "order": 1,
      "title": "Scene 1",
      "description": "Description for scene 1",
      "plotThreads": ["thread1", "thread2"],
      "position": { "x": 100, "y": 300 },
      "type": "express"
    },
    // ... more scenes
  ],
  "plotThreads": [
    {
      "id": "thread1",
      "name": "Main Plot",
      "color": "#ff0000",
      "isMain": true,
      "mdq": "Will the hero save the world?",
      "ldq": "Can the hero overcome their fear?"
    },
    // ... more plot threads
  ]
}`}
        </pre>
      </div>
    </div>
  )
}

