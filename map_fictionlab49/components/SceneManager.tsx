"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Scene, PlotThread } from "@/types"
import saveAs from "file-saver"

interface SceneManagerProps {
  scenes: Scene[]
  plotThreads: PlotThread[]
  onScenesUpdate: (scenes: Scene[]) => void
  onSceneAdd: (scene: Scene) => void
  onPlotThreadsUpdate?: (plotThreads: PlotThread[]) => void
}

export function SceneManager({
  scenes,
  plotThreads,
  onScenesUpdate,
  onSceneAdd,
  onPlotThreadsUpdate = () => {},
}: SceneManagerProps) {
  const [csvContent, setCsvContent] = useState("")
  const [tempThreads, setTempThreads] = useState<string[]>([])

  useEffect(() => {
    const allThreadIds = new Set(scenes.flatMap((scene) => scene.plotThreads))
    const newTempThreads = Array.from(allThreadIds).filter((id) => !plotThreads.some((thread) => thread.id === id))
    setTempThreads(newTempThreads)
  }, [scenes, plotThreads])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setCsvContent(text)

        // Parse CSV and create scenes
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",")
        const newScenes: Scene[] = lines.slice(1).map((line, index) => {
          const values = line.split(",")
          const plotThreadIds = values[4] ? values[4].split(";") : []
          return {
            id: values[0] || `scene-${Date.now()}-${index}`,
            order: Number.parseInt(values[1]) || index + 1,
            title: values[2] || `Scene ${index + 1}`,
            description: values[3] || "",
            plotThreads: plotThreadIds,
            position: {
              x: Number.parseFloat(values[6]) || index * 200,
              y: Number.parseFloat(values[7]) || 300,
            },
            type: (values[5] as "local" | "express") || (plotThreadIds.length > 1 ? "express" : "local"),
          }
        })
        onScenesUpdate(newScenes)

        // Update plot threads
        const allThreadIds = new Set(newScenes.flatMap((scene) => scene.plotThreads))
        const newPlotThreads = Array.from(allThreadIds).map((id) => {
          const existingThread = plotThreads.find((thread) => thread.id === id)
          return (
            existingThread || {
              id,
              name: `Thread ${id}`,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              isMain: false,
            }
          )
        })
        if (onPlotThreadsUpdate) {
          onPlotThreadsUpdate(newPlotThreads)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleSceneUpdate = (updatedScene: Scene) => {
    const updatedScenes = scenes.map((scene) => (scene.id === updatedScene.id ? updatedScene : scene))
    onScenesUpdate(updatedScenes)
  }

  const handleOrderUpdate = (sceneId: string, newOrder: number) => {
    const updatedScenes = [...scenes]
      .map((scene) => ({
        ...scene,
        order: scene.id === sceneId ? newOrder : scene.order,
      }))
      .sort((a, b) => a.order - b.order)
    onScenesUpdate(updatedScenes)
  }

  const addNewScene = () => {
    const maxOrder = Math.max(...scenes.map((s) => s.order), 0)
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      order: maxOrder + 1,
      title: `New Scene ${maxOrder + 1}`,
      description: "",
      plotThreads: [],
      position: { x: (maxOrder + 1) * 200, y: 300 },
      type: "local",
    }
    onSceneAdd(newScene)
  }

  const exportScenes = () => {
    const headers = ["ID", "Order", "Title", "Description", "Plot Threads", "Type", "Position X", "Position Y"]
    const csvContent = [
      headers.join(","),
      ...scenes.map((scene) =>
        [
          scene.id,
          scene.order,
          scene.title,
          scene.description,
          scene.plotThreads.join(";"),
          scene.type,
          scene.position.x,
          scene.position.y,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    saveAs(blob, "scenes_export.csv")
  }

  const handleThreadUpdate = (threadId: string, newName: string) => {
    const updatedThreads = plotThreads.map((thread) => (thread.id === threadId ? { ...thread, name: newName } : thread))
    if (onPlotThreadsUpdate) {
      onPlotThreadsUpdate(updatedThreads)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="max-w-xs" />
        <Button onClick={addNewScene}>Add New Scene</Button>
        <Button onClick={exportScenes}>Export Scenes</Button>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Plot Threads</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...scenes]
              .sort((a, b) => a.order - b.order)
              .map((scene) => (
                <TableRow key={scene.id}>
                  <TableCell>
                    <Input
                      type="number"
                      value={scene.order}
                      onChange={(e) => handleOrderUpdate(scene.id, Number.parseInt(e.target.value))}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={scene.title}
                      onChange={(e) => handleSceneUpdate({ ...scene, title: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={scene.description}
                      onChange={(e) => handleSceneUpdate({ ...scene, description: e.target.value })}
                      rows={2}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {plotThreads
                        .concat(tempThreads.map((id) => ({ id, name: `Temp ${id}`, color: "#cccccc", isMain: false })))
                        .map((thread) => (
                          <label key={thread.id} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={scene.plotThreads.includes(thread.id)}
                              onChange={(e) => {
                                const updatedThreads = e.target.checked
                                  ? [...scene.plotThreads, thread.id]
                                  : scene.plotThreads.filter((id) => id !== thread.id)
                                handleSceneUpdate({
                                  ...scene,
                                  plotThreads: updatedThreads,
                                  type: updatedThreads.length > 1 ? "express" : "local",
                                })
                              }}
                            />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: thread.color }} />
                            <Input
                              value={thread.name}
                              onChange={(e) => handleThreadUpdate(thread.id, e.target.value)}
                              className="w-24 h-6 text-xs"
                            />
                          </label>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={scene.type}
                      onValueChange={(value: "local" | "express") => handleSceneUpdate({ ...scene, type: value })}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">CSV Format:</h3>
        <code className="block bg-muted p-2 rounded">
          ID,Order,Title,Description,Plot Threads,Type,Position X,Position Y scene-1,1,Scene 1,Description for scene
          1,thread1;thread2,express,100,300 scene-2,2,Scene 2,Description for scene 2,thread1,local,300,300
        </code>
      </div>
    </div>
  )
}

