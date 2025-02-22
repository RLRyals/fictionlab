"use client"

import type React from "react"
import { useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import type { PlotThread, Scene } from "@/types"
import { LocalNode, ExpressNode } from "./CustomNodes"

interface StoryMapProps {
  plotThreads: PlotThread[]
  scenes: Scene[]
  onSceneSelect: (scene: Scene) => void
  onSceneUpdate: (scene: Scene) => void
  onSceneAdd: (scene: Scene) => void
}

const nodeTypes = {
  localNode: LocalNode,
  expressNode: ExpressNode,
}

const VERTICAL_SPACING = 150
const HORIZONTAL_SPACING = 250
const MAIN_THREAD_Y = 300

const StoryMap: React.FC<StoryMapProps> = ({ plotThreads, scenes, onSceneSelect, onSceneUpdate, onSceneAdd }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    const sortedScenes = [...scenes].sort((a, b) => a.order - b.order)

    const newNodes: Node[] = sortedScenes.map((scene) => ({
      id: scene.id,
      type: scene.plotThreads.length > 1 ? "expressNode" : "localNode",
      data: {
        label: `${scene.order}. ${scene.title}`,
        scene,
      },
      position: scene.position,
      draggable: true,
    }))

    setNodes(newNodes)
  }, [scenes, setNodes])

  useEffect(() => {
    const newEdges: Edge[] = plotThreads.flatMap((thread) => {
      const threadScenes = scenes
        .filter((scene) => scene.plotThreads.includes(thread.id))
        .sort((a, b) => a.order - b.order)

      return threadScenes.slice(1).map((scene, index) => ({
        id: `${thread.id}-${threadScenes[index].id}-${scene.id}`,
        source: threadScenes[index].id,
        target: scene.id,
        type: "smoothstep",
        style: {
          stroke: thread.color,
          strokeWidth: thread.isMain ? 4 : 3,
        },
        markerEnd: {
          type: MarkerType.Arrow,
          color: thread.color,
        },
      }))
    })
    setEdges(newEdges)
  }, [plotThreads, scenes, setEdges])

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const updatedScene = {
        ...node.data.scene,
        position: node.position,
      }
      onSceneUpdate(updatedScene)
    },
    [onSceneUpdate],
  )

  const handleAddScene = useCallback(() => {
    const maxOrder = Math.max(...scenes.map((s) => s.order), 0)
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      order: maxOrder + 1,
      title: "New Scene",
      description: "",
      plotThreads: [],
      position: {
        x: (maxOrder + 1) * HORIZONTAL_SPACING,
        y: MAIN_THREAD_Y,
      },
      type: "local",
    }
    onSceneAdd(newScene)
  }, [onSceneAdd, scenes])

  return (
    <div className="relative w-full h-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(event, node) => onSceneSelect(node.data.scene)}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
        }}
      >
        <Controls />
        <Background color="#f0f0f0" gap={16} />
      </ReactFlow>
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Button onClick={handleAddScene}>Add Scene</Button>
      </div>
      <div className="absolute bottom-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
            <span>Local stops: scenes that appear on only one story thread</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-black" />
            <span>Express stops: scenes that appear in multiple threads</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryMap

