import React from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import type { Scene, PlotThread } from "@/types"

interface NodeProps {
  data: {
    label: string
    scene: Scene
    threads: PlotThread[]
    onDelete: () => void
  }
}

const NodeContent: React.FC<{ label: string }> = ({ label }) => (
  <div className="max-w-[200px] overflow-hidden">
    <div className="truncate text-sm font-medium">{label}</div>
  </div>
)

const createHandles = (threads: PlotThread[], position: Position) => {
  const handleCount = threads.length
  if (handleCount === 0) {
    // Create a default handle if no threads
    return (
      <Handle
        key="default"
        type={position === Position.Left ? "target" : "source"}
        position={position}
        id={`${position}-default`}
        style={{
          background: "#888",
          top: "50%",
        }}
      />
    )
  }

  //new
  return threads.map((thread, index) => {
    const topOffset = handleCount === 1 ? 50 : (index * (100 / (handleCount - 1)))
    return (
      <Handle
        key={`${position}-${thread.id}`}
        type={position === Position.Left ? "target" : "source"}
        position={position}
        id={`${position === Position.Left ? "Left" : "Right"}-${thread.id}`}
        style={{
          background: thread.color,
          top: `${topOffset}%`,
          width: thread.isMain ? "10px" : "7px",
          height: thread.isMain ? "10px" : "7px",
        }}
      />
    )
  })
}


const NodeBase: React.FC<NodeProps & { className: string }> = ({ data, className }) => (
  <div className="relative group">
    <div className={className}>
      {createHandles(data.threads, Position.Left)}
      {createHandles(data.threads, Position.Right)}
    </div>
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
      <NodeContent label={data.label} />
    </div>
    <Button
      variant="destructive"
      size="icon"
      className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => {
        e.stopPropagation()
        data.onDelete()
      }}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
)

export const LocalNode: React.FC<NodeProps> = (props) => (
  <NodeBase {...props} className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center" />
)

export const ExpressNode: React.FC<NodeProps> = (props) => (
  <NodeBase {...props} className="w-12 h-12 rounded-full bg-black flex items-center justify-center" />
)

