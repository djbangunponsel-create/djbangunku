import { Metadata } from "next"
import Link from "next/link"
import AnggotaClientContent from "@/components/AnggotaClientContent"

export const metadata: Metadata = {
  title: "Data Anggota - KSP Mulia Dana Sejahtera",
}

export default function AnggotaPage() {
  return (
    <div className="min-h-screen">
      <AnggotaClientContent />
    </div>
  )
}