import { Metadata } from "next"
import PinjamanClientContent from "@/components/PinjamanClientContent"

export const metadata: Metadata = {
  title: "Pinjaman - KSP Mulia Dana Sejahtera",
}

export default function PinjamanPage() {
  return (
    <div className="min-h-screen">
      <PinjamanClientContent />
    </div>
  )
}