export interface PlotThread {
  id: string
  name: string
  color: string
  isMain: boolean
}

export interface Scene {
  id: string
  order: number
  title: string
  description: string
  plotThreads: string[]
  position: { x: number; y: number }
  type: "local" | "express"
}

