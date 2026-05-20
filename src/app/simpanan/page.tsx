import { Metadata } from "next"
import SimpananClientContent from "@/components/SimpananClientContent"

export const metadata: Metadata = {
  title: "Simpanan - KSP Mulia Dana Sejahtera",
}

export default function SimpananPage() {
  return (
    <div className="min-h-screen">
      <SimpananClientContent />
    </div>
  )
}