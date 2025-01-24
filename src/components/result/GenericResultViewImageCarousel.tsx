import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useEffect, useState } from "react"

export function GenericResultViewImageCarousel({ images, title }: { images: string[]; title?: string }) {
    const [api, setApi] = useState<CarouselApi>()
    const [slide, setSlide] = useState<number>(0)

    useEffect(() => {
        if (api) {
            api.on("select", () => setSlide(api.selectedScrollSnap()))
        }
    }, [api])

    return (
        <Carousel className="w-full max-w-xs" setApi={setApi}>
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <img
                            className="md:rfs-size-[200px]"
                            src={image}
                            alt={`Preview ${index + 1} of ${images.length} for ${title ?? "unnamed result"}`}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className={"rfs-opacity-0 group-hover/resultView:rfs-opacity-100 rfs-transition-opacity"}>
                <CarouselPrevious />
                <CarouselNext />
            </div>
            <div className="rfs-text-muted-foreground rfs-text-center rfs-text-xs rfs-mt-2">
                Image {slide + 1} of {images.length}
            </div>
        </Carousel>
    )
}
