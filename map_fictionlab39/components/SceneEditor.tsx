"use client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Scene, PlotThread } from "@/types"

interface SceneEditorProps {
  scenes: Scene[]
  plotThreads: PlotThread[]
  onSceneUpdate: (updatedScene: Scene) => void
  onScenesUpdate: (updatedScenes: Scene[]) => void
  onSceneDelete: (sceneId: string) => void
}

export function SceneEditor({ scenes, plotThreads, onSceneUpdate, onScenesUpdate, onSceneDelete }: SceneEditorProps) {
  const handleSceneUpdate = (updatedScene: Scene) => {
    const oldOrder = scenes.find((s) => s.id === updatedScene.id)?.order || 0
    const newOrder = updatedScene.order

    if (oldOrder !== newOrder) {
      const updatedScenes = scenes.map((scene) => {
        if (scene.id === updatedScene.id) {
          return updatedScene
        } else if (oldOrder < newOrder && scene.order > oldOrder && scene.order <= newOrder) {
          return { ...scene, order: scene.order - 1 }
        } else if (oldOrder > newOrder && scene.order >= newOrder && scene.order < oldOrder) {
          return { ...scene, order: scene.order + 1 }
        }
        return scene
      })
      onSceneUpdate(updatedScene)
      onScenesUpdate(updatedScenes.sort((a, b) => a.order - b.order))
    } else {
      onSceneUpdate(updatedScene)
    }
  }

  const handleOrderUpdate = (sceneId: string, newOrder: number) => {
    const scene = scenes.find((s) => s.id === sceneId)
    if (scene) {
      handleSceneUpdate({ ...scene, order: newOrder })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Plot Threads</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
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
                      {plotThreads.map((thread) => (
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
                          {thread.name}
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
                  <TableCell>
                    <Button variant="destructive" onClick={() => onSceneDelete(scene.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

