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
  MiniMap,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import type { PlotThread, Scene, StoryStructure } from "@/types"
import { LocalNode, ExpressNode } from "./CustomNodes"

interface StoryMapProps {
  plotThreads: PlotThread[]
  scenes: Scene[]
  onSceneSelect: (scene: Scene) => void
  onSceneUpdate: (scene: Scene) => void
  onSceneAdd: (scene: Scene) => void
  onSceneDelete: (sceneId: string) => void
  onScenesUpdate: (scenes: Scene[]) => void
  selectedStructure: StoryStructure | null
}

const nodeTypes = {
  localNode: LocalNode,
  expressNode: ExpressNode,
}

const StoryMap: React.FC<StoryMapProps> = ({
  plotThreads,
  scenes,
  onSceneSelect,
  onSceneUpdate,
  onSceneAdd,
  onSceneDelete,
  onScenesUpdate,
  selectedStructure,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const createNodesAndEdges = useCallback(() => {
    const newNodes: Node[] = scenes.map((scene) => ({
      id: scene.id,
      type: scene.plotThreads.length > 1 ? "expressNode" : "localNode",
      data: {
        label: `${scene.order}. ${scene.title}`,
        scene,
        threads: plotThreads.filter((thread) => scene.plotThreads.includes(thread.id)),
        onDelete: () => onSceneDelete(scene.id),
      },
      position: scene.position,
      draggable: true,
    }))

    const newEdges: Edge[] = []
    plotThreads.forEach((thread) => {
      const threadScenes = scenes.filter((scene) => scene.plotThreads.includes(thread.id))
      threadScenes.sort((a, b) => a.order - b.order)

      for (let i = 0; i < threadScenes.length - 1; i++) {
        const sourceScene = threadScenes[i]
        const targetScene = threadScenes[i + 1]

        newEdges.push({
          id: `edge-${thread.id}-${sourceScene.id}-${targetScene.id}`,
          source: sourceScene.id,
          target: targetScene.id,
          sourceHandle: `Right-${thread.id}`,
          targetHandle: `Left-${thread.id}`,
          type: "smoothstep",
          animated: true,
          style: {
            stroke: thread.color,
            strokeWidth: thread.isMain ? 4 : 2,
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: thread.color,
          },
        })
      }
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [scenes, plotThreads, setNodes, setEdges, onSceneDelete])

  useEffect(() => {
    createNodesAndEdges()
  }, [createNodesAndEdges])

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
    const nextOrder = Math.max(...scenes.map((s) => s.order), 0) + 1
    const lastScene =
      scenes.length > 0 ? scenes.reduce((prev, current) => (prev.order > current.order ? prev : current)) : null

    const newPosition = lastScene ? { x: lastScene.position.x + 250, y: lastScene.position.y } : { x: 250, y: 100 }

    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      order: nextOrder,
      title: "New Scene",
      description: "",
      plotThreads: [],
      position: newPosition,
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
        <MiniMap
          zoomable
          pannable
          nodeColor={(node) => {
            return node.type === "expressNode" ? "#000" : "#fff"
          }}
          nodeStrokeColor={(node) => {
            return "#000"
          }}
        />
        <Panel position="top-left">
          <Button onClick={handleAddScene}>Add Scene</Button>
        </Panel>
      </ReactFlow>
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

