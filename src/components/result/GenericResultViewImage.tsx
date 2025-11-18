import { GenericResultViewImageCarousel } from "@/components/result/GenericResultViewImageCarousel"
import { Fullscreen, ImageOff } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function GenericResultViewImage({
    previewImage,
    invertImageInDarkMode,
    title
}: {
    previewImage?: string | string[]
    invertImageInDarkMode?: boolean
    title?: string
}) {
    return (
        <div className={`rfs:flex rfs:justify-center rfs:rounded rfs:md:items-center rfs:p-2 d ${invertImageInDarkMode ? "rfs:dark:invert" : ""} `}>
            {previewImage ? (
                Array.isArray(previewImage) ? (
                    <div className="rfs:relative">
                        <GenericResultViewImageCarousel images={previewImage} title={title} />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="icon"
                                    variant={"outline"}
                                    className="rfs:p-0 rfs:absolute rfs:right-0 rfs:top-0 rfs:bottom-0 rfs:m-auto rfs:translate-y-[50px] rfs:w-8 rfs:h-8 rfs:opacity-0 rfs:group-hover/resultView:opacity-100 rfs:transition-opacity"
                                >
                                    <Fullscreen className="rfs:size-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rfs:max-w-[90vw] rfs:max-h-[90vh] rfs:w-fit rfs:p-0! rfs:overflow-auto">
                                <div className={"rfs:p-4"}>
                                    <GenericResultViewImageCarousel images={previewImage} title={title} fullSize />
                                </div>
                                <div className="rfs:bg-muted rfs:p-4 rfs:rounded-b-lg">
                                    <DialogTitle>{title}</DialogTitle>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <Dialog>
                        <DialogTrigger className="rfs:justify-center rfs:flex">
                            <img
                                className="rfs:md:max-h-[200px] rfs:md:max-w-[200px] rfs:max-h-full rfs:object-contain"
                                src={previewImage}
                                alt={`Preview for ${title}`}
                            />
                        </DialogTrigger>
                        <DialogContent className="rfs:p-0! rfs:max-w-[calc(100vw-40px)]! rfs:max-h-[calc(100vh-40px)]! rfs:w-fit! rfs:overflow-auto">
                            <div className="rfs:justify-center rfs:flex rfs:p-4">
                                <img src={previewImage} alt={`Preview for ${title}`} />
                            </div>
                            <div className="rfs:bg-muted rfs:p-4 rfs:rounded-b-lg">
                                <DialogTitle>{title}</DialogTitle>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            ) : (
                <div className="rfs:flex rfs:flex-col rfs:justify-center rfs:dark:text-background">
                    <ImageOff className="rfs:size-6 rfs:text-muted-foreground/50" />
                </div>
            )}
        </div>
    )
}
