import type React from "react"
import { Handle, Position } from "reactflow"
import type { Scene } from "@/types"

interface NodeProps {
  data: {
    label: string
    scene: Scene
  }
}

const NodeContent: React.FC<{ label: string }> = ({ label }) => (
  <div className="max-w-[200px] overflow-hidden">
    <div className="truncate text-sm font-medium">{label}</div>
  </div>
)

export const LocalNode: React.FC<NodeProps> = ({ data }) => (
  <div className="relative group">
    <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center">
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
    </div>
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
      <NodeContent label={data.label} />
    </div>
  </div>
)

export const ExpressNode: React.FC<NodeProps> = ({ data }) => (
  <div className="relative group">
    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
    </div>
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
      <NodeContent label={data.label} />
    </div>
  </div>
)

