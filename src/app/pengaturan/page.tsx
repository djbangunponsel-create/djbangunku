import { Metadata } from "next";
import PengaturanClientContent from '@/components/PengaturanClientContent';

export const metadata: Metadata = {
  title: "Pengaturan - KSP Mulia Dana Sejahtera",
};

export default function PengaturanPage() {
  return <PengaturanClientContent />;
}
