import type React from "react"
import type { StoryStructure, Scene, StoryBeat } from "@/types"
import { Button } from "@/components/ui/button"

interface StoryStructureGuideProps {
  structure: StoryStructure
  scenes: Scene[]
  onSuggestScene: (beat: StoryBeat) => void
}

const StoryStructureGuide: React.FC<StoryStructureGuideProps> = ({ structure, scenes, onSuggestScene }) => {
  const missingBeats = structure.beats.filter((beat) => {
    const sceneWithBeat = scenes.find((scene) => scene.selectedBeat === beat.id)
    return !sceneWithBeat
  })

  return (
    <div className="story-structure-guide">
      <h3 className="text-lg font-semibold mb-2">{structure.name} Structure</h3>
      <div className="timeline relative h-8 bg-gray-200 rounded-full mb-4">
        {structure.beats.map((beat) => {
          const position = `${beat.percentagePosition}%`
          const isMissing = missingBeats.includes(beat)
          const sceneWithBeat = scenes.find((scene) => scene.selectedBeat === beat.id)

          return (
            <div
              key={beat.id}
              className={`beat-marker absolute w-4 h-4 rounded-full -mt-2 ${
                isMissing ? "bg-red-500" : "bg-green-500"
              } cursor-pointer group`}
              style={{ left: position }}
              onClick={() => isMissing && onSuggestScene(beat)}
            >
              <div className="beat-info absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white p-2 rounded shadow-lg text-sm hidden group-hover:block z-10">
                <h4 className="font-semibold">{beat.name}</h4>
                <p className="text-xs">{beat.description}</p>
                {sceneWithBeat && (
                  <p className="text-xs mt-1">
                    Scene: {sceneWithBeat.order}. {sceneWithBeat.title}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="missing-beats mt-4">
        <h4 className="font-semibold mb-2">Missing Beats:</h4>
        {missingBeats.length > 0 ? (
          <ul className="list-disc pl-5">
            {missingBeats.map((beat) => (
              <li key={beat.id} className="text-sm mb-1 flex items-center justify-between">
                <span>
                  {beat.name} - {beat.description}
                </span>
                <Button size="sm" onClick={() => onSuggestScene(beat)}>
                  Add Scene
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">All beats are present in the story.</p>
        )}
      </div>
    </div>
  )
}

export default StoryStructureGuide

