export interface PlotThread {
  id: string
  name: string
  color: string
  isMain: boolean
  mdq?: string // Main Dramatic Question
  ldq?: string // Lesser Dramatic Question
}

export interface Scene {
  id: string
  order: number
  title: string
  description: string
  plotThreads: string[]
  position: { x: number; y: number }
  type: "local" | "express"
  selectedBeat?: string
}

export interface StoryBeat {
  id: string
  name: string
  description: string
  percentagePosition: number // where in the story this should occur (0-100)
  requiredThreads: string[] // which plot threads this beat typically affects
  genreSpecific?: boolean
}

export interface StoryStructure {
  id: string
  name: string
  genre: string
  description: string
  beats: StoryBeat[]
  commonThreads: {
    name: string
    description: string
    color: string
    isMain: boolean
  }[]
}

