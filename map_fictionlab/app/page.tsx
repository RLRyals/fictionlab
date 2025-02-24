"use client"

import { useState, useCallback } from "react"
import StoryMap from "@/components/StoryMap"
import Sidebar from "@/components/Sidebar"
import PlotThreadManager from "@/components/PlotThreadManager"
import SceneDetails from "@/components/SceneDetails"
import { FileManager } from "@/components/FileManager"
import { SceneEditor } from "@/components/SceneEditor"
import { StoryStructureManager } from "@/components/StoryStructureManager"
import StoryStructureGuide from "@/components/StoryStructureGuide"
import type { PlotThread, Scene, StoryStructure, StoryBeat } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { storyStructures } from "@/storyStructures"

const HORIZONTAL_SPACING = 250
const VERTICAL_SPACING = 100

export default function Home() {
  const [plotThreads, setPlotThreads] = useState<PlotThread[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [selectedStructure, setSelectedStructure] = useState<StoryStructure | null>(null)
  const [activeTab, setActiveTab] = useState("scene-editor")

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

  const handleSuggestScene = useCallback(
    (beat: StoryBeat) => {
      const nextOrder = Math.max(...scenes.map((s) => s.order), 0) + 1
      const lastScene =
        scenes.length > 0 ? scenes.reduce((prev, current) => (prev.order > current.order ? prev : current)) : null

      const newPosition = lastScene
        ? { x: lastScene.position.x + HORIZONTAL_SPACING, y: lastScene.position.y }
        : { x: HORIZONTAL_SPACING, y: VERTICAL_SPACING }

      const newScene: Scene = {
        id: `scene-${Date.now()}`,
        order: nextOrder,
        title: beat.name,
        description: beat.description,
        plotThreads: beat.requiredThreads,
        position: newPosition,
        type: beat.requiredThreads.length > 1 ? "express" : "local",
        selectedBeat: beat.id,
      }
      addScene(newScene)
      setSelectedScene(newScene)
      setActiveTab("scene-details")
    },
    [scenes, addScene],
  )

  const handleSceneSelect = useCallback((scene: Scene) => {
    setSelectedScene(scene)
    setActiveTab("scene-details")
  }, [])

  return (
    <main className="flex h-screen">
      <div className="flex-1">
        <StoryMap
          plotThreads={plotThreads}
          scenes={scenes}
          onSceneSelect={handleSceneSelect}
          onSceneUpdate={updateScene}
          onSceneAdd={addScene}
          onSceneDelete={deleteScene}
          onScenesUpdate={updateScenes}
          selectedStructure={selectedStructure}
        />
      </div>
      <Sidebar>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="scene-details" className="flex-1">
              Scene Details
            </TabsTrigger>
            <TabsTrigger value="scene-editor" className="flex-1">
              Scene Editor
            </TabsTrigger>
            <TabsTrigger value="story-structure" className="flex-1">
              Story Structure
            </TabsTrigger>
            <TabsTrigger value="plot-threads" className="flex-1">
              Plot Threads
            </TabsTrigger>
            <TabsTrigger value="file" className="flex-1">
              Files
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scene-details">
            {selectedScene && (
              <SceneDetails
                scene={selectedScene}
                plotThreads={plotThreads}
                onUpdate={updateScene}
                selectedStructure={selectedStructure}
              />
            )}
          </TabsContent>
          <TabsContent value="scene-editor">
            <SceneEditor
              scenes={scenes}
              plotThreads={plotThreads}
              selectedStructure={selectedStructure}
              onSceneUpdate={updateScene}
              onScenesUpdate={updateScenes}
              onSceneDelete={deleteScene}
            />
          </TabsContent>
          <TabsContent value="story-structure">
            <div className="space-y-4">
              <StoryStructureManager
                structures={storyStructures}
                selectedStructure={selectedStructure}
                onSelectStructure={setSelectedStructure}
              />
              {selectedStructure && (
                <StoryStructureGuide
                  structure={selectedStructure}
                  totalScenes={scenes.length}
                  scenes={scenes}
                  onSuggestScene={handleSuggestScene}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="plot-threads">
            <PlotThreadManager
              plotThreads={plotThreads}
              onAddPlotThread={addPlotThread}
              onUpdatePlotThread={updatePlotThread}
              onDeletePlotThread={deletePlotThread}
            />
          </TabsContent>
          <TabsContent value="file">
            <FileManager scenes={scenes} plotThreads={plotThreads} onDataImport={handleDataImport} />
          </TabsContent>
        </Tabs>
      </Sidebar>
    </main>
  )
}

