import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StoryStructure } from "@/types"

interface StoryStructureManagerProps {
  structures: StoryStructure[]
  selectedStructure: StoryStructure | null
  onSelectStructure: (structure: StoryStructure | null) => void
}

export const StoryStructureManager: React.FC<StoryStructureManagerProps> = ({
  structures,
  selectedStructure,
  onSelectStructure,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Story Structure</h2>
      <Select
        value={selectedStructure?.id || "none"}
        onValueChange={(value) => onSelectStructure(structures.find((s) => s.id === value) || null)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a story structure" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {structures.map((structure) => (
            <SelectItem key={structure.id} value={structure.id}>
              {structure.name} ({structure.genre})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedStructure && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">{selectedStructure.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{selectedStructure.description}</p>
          <h4 className="text-sm font-semibold mb-2">Beats:</h4>
          <ul className="list-disc list-inside space-y-2">
            {selectedStructure.beats.map((beat) => (
              <li key={beat.id} className="text-sm">
                <span className="font-medium">{beat.name}</span>: {beat.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

