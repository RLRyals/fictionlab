"use client"

import { useState, useCallback } from "react"
import StoryMap from "@/components/StoryMap"
import Sidebar from "@/components/Sidebar"
import PlotThreadManager from "@/components/PlotThreadManager"
import SceneDetails from "@/components/SceneDetails"
import { FileManager } from "@/components/FileManager"
import { SceneEditor } from "@/components/SceneEditor"
import type { PlotThread, Scene } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [plotThreads, setPlotThreads] = useState<PlotThread[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)

  const addPlotThread = useCallback((thread: PlotThread) => {
    setPlotThreads((prev) => {
      if (prev.length === 0) {
        return [{ ...thread, isMain: true }]
      }
      return [...prev, thread]
    })
  }, [])

  const updatePlotThread = useCallback((updatedThread: PlotThread) => {
    setPlotThreads((prev) => {
      const newThreads = prev.map((thread) => (thread.id === updatedThread.id ? updatedThread : thread))

      if (updatedThread.isMain) {
        return newThreads.map((thread) => (thread.id === updatedThread.id ? thread : { ...thread, isMain: false }))
      }

      return newThreads
    })
  }, [])

  const deletePlotThread = useCallback((threadId: string) => {
    setPlotThreads((prev) => prev.filter((thread) => thread.id !== threadId))
    setScenes((prev) =>
      prev.map((scene) => ({
        ...scene,
        plotThreads: scene.plotThreads.filter((id) => id !== threadId),
      })),
    )
  }, [])

  const addScene = useCallback((scene: Scene) => {
    setScenes((prev) => [...prev, scene])
  }, [])

  const updateScene = useCallback((updatedScene: Scene) => {
    setScenes((prev) =>
      prev.map((scene) =>
        scene.id === updatedScene.id
          ? {
              ...updatedScene,
              position: updatedScene.position || scene.position,
            }
          : scene,
      ),
    )
  }, [])

  const deleteScene = useCallback(
    (sceneId: string) => {
      setScenes((prev) => prev.filter((scene) => scene.id !== sceneId))
      if (selectedScene && selectedScene.id === sceneId) {
        setSelectedScene(null)
      }
    },
    [selectedScene],
  )

  const handleDataImport = useCallback((importedScenes: Scene[], importedPlotThreads: PlotThread[]) => {
    setScenes(importedScenes)
    setPlotThreads(importedPlotThreads)
  }, [])

  const updateScenes = useCallback((updatedScenes: Scene[]) => {
    setScenes(updatedScenes)
  }, [])

  return (
    <main className="flex h-screen">
      <div className="flex-1">
        <StoryMap
          plotThreads={plotThreads}
          scenes={scenes}
          onSceneSelect={setSelectedScene}
          onSceneUpdate={updateScene}
          onSceneAdd={addScene}
          onSceneDelete={deleteScene}
        />
      </div>
      <Sidebar>
        <Tabs defaultValue="edit">
          <TabsList className="w-full">
            <TabsTrigger value="edit" className="flex-1">
              Edit
            </TabsTrigger>
            <TabsTrigger value="file" className="flex-1">
              Files
            </TabsTrigger>
            <TabsTrigger value="threads" className="flex-1">
              Plot Threads
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <SceneEditor
              scenes={scenes}
              plotThreads={plotThreads}
              onSceneUpdate={updateScene}
              onScenesUpdate={updateScenes}
              onSceneDelete={deleteScene}
            />
          </TabsContent>
          <TabsContent value="file">
            <FileManager scenes={scenes} plotThreads={plotThreads} onDataImport={handleDataImport} />
          </TabsContent>
          <TabsContent value="threads">
            <PlotThreadManager
              plotThreads={plotThreads}
              onAddPlotThread={addPlotThread}
              onUpdatePlotThread={updatePlotThread}
              onDeletePlotThread={deletePlotThread}
            />
          </TabsContent>
        </Tabs>
        {selectedScene && <SceneDetails scene={selectedScene} plotThreads={plotThreads} onUpdate={updateScene} />}
      </Sidebar>
    </main>
  )
}

