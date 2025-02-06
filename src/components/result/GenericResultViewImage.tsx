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
        <div className={`rfs-flex rfs-justify-center rfs-rounded md:rfs-items-center rfs-p-2 d ${invertImageInDarkMode ? "dark:rfs-invert" : ""} `}>
            {previewImage ? (
                Array.isArray(previewImage) ? (
                    <div className="rfs-relative">
                        <GenericResultViewImageCarousel images={previewImage} title={title} />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="icon"
                                    variant={"outline"}
                                    className="rfs-p-0 rfs-absolute rfs-right-0 rfs-top-0 rfs-bottom-0 rfs-m-auto rfs-translate-y-[50px] rfs-w-8 rfs-h-8 rfs-opacity-0 group-hover/resultView:rfs-opacity-100 rfs-transition-opacity"
                                >
                                    <Fullscreen className="rfs-size-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rfs-max-w-[90vw] rfs-max-h-[90vh] rfs-w-auto rfs-overflow-auto">
                                <DialogTitle>{title}</DialogTitle>
                                <GenericResultViewImageCarousel images={previewImage} title={title} fullSize />
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <Dialog>
                        <DialogTrigger className="rfs-justify-center rfs-flex">
                            <img
                                className="md:rfs-max-h-[200px] md:rfs-max-w-[200px] rfs-max-h-full rfs-object-contain"
                                src={previewImage}
                                alt={`Preview for ${title}`}
                            />
                        </DialogTrigger>
                        <DialogContent className="rfs-p-4 rfs-max-w-none !rfs-w-auto">
                            <DialogTitle>{title}</DialogTitle>
                            <div className="rfs-justify-center rfs-flex">
                                <img className="rfs-max-w-[90vw] rfs-max-h-[90vh]" src={previewImage} alt={`Preview for ${title}`} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            ) : (
                <div className="rfs-flex rfs-flex-col rfs-justify-center dark:rfs-text-background">
                    <ImageOff className="rfs-size-6 rfs-text-muted-foreground/50" />
                </div>
            )}
        </div>
    )
}
