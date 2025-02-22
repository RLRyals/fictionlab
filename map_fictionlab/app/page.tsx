"use client"

import { useState, useCallback } from "react"
import StoryMap from "@/components/StoryMap"
import Sidebar from "@/components/Sidebar"
import PlotThreadManager from "@/components/PlotThreadManager"
import SceneDetails from "@/components/SceneDetails"
import { SceneManager } from "@/components/SceneManager"
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
              position: updatedScene.position || scene.position, // Ensure position is always defined
            }
          : scene,
      ),
    )
  }, [])

  const updateScenes = useCallback((newScenes: Scene[]) => {
    setScenes(newScenes)
  }, [])

  const updatePlotThreads = useCallback((newPlotThreads: PlotThread[]) => {
    setPlotThreads(newPlotThreads)
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
        />
      </div>
      <Sidebar>
        <Tabs defaultValue="threads">
          <TabsList className="w-full">
            <TabsTrigger value="threads" className="flex-1">
              Plot Threads
            </TabsTrigger>
            <TabsTrigger value="scenes" className="flex-1">
              Scenes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="threads">
            <PlotThreadManager
              plotThreads={plotThreads}
              onAddPlotThread={addPlotThread}
              onUpdatePlotThread={updatePlotThread}
              onDeletePlotThread={deletePlotThread}
            />
          </TabsContent>
          <TabsContent value="scenes">
            <SceneManager
              scenes={scenes}
              plotThreads={plotThreads}
              onScenesUpdate={updateScenes}
              onSceneAdd={addScene}
              onPlotThreadsUpdate={updatePlotThreads}
            />
          </TabsContent>
        </Tabs>
        {selectedScene && <SceneDetails scene={selectedScene} plotThreads={plotThreads} onUpdate={updateScene} />}
      </Sidebar>
    </main>
  )
}

