import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export function SliderFacet() {
    const [value, setValue] = useState<number[]>([0, 1000])

    return (
        <div className="rfs:px-4 rfs:pt-0 rfs:pb-8">
            <div className="rfs:text-sm rfs:font-bold rfs:pb-7">Compound</div>
            <Slider value={value} onValueChange={setValue} min={0} max={1000} step={0.1} className="rfs:w-full" />
        </div>
    )
}
