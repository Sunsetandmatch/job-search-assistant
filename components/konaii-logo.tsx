import { cn } from "@/lib/utils"
import Image from "next/image"

interface KonaiiLogoProps {
  className?: string
}

export function KonaiiLogo({ className }: KonaiiLogoProps) {
  return (
    <Image
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/konaii_200-sb6JZCBZBRF6H4nswJd0A821unhxir.png"
      alt="Konaii Jobs"
      width={200}
      height={50}
      className={cn("h-auto w-auto", className)}
      priority
    />
  )
}

