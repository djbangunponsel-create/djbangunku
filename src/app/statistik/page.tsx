'use client';

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { readStored, KEYS } from "@/lib/storage"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Anggota {
  No_Anggota: string
  NAMA_ANGGOTA: string
  Tanggal_Masuk: string
}

interface Simpanan {
  id: string
  noAnggota: string
  namaAnggota: string
  tipe: 'Pokok' | 'Wajib' | 'Sibuhar' | 'Sisujang' | 'Simapan' | 'Sihat' | 'Sihar'
  jumlah: number
  tanggalSetor: string
  status: 'Aktif' | 'Ditarik'
}

// ── Helper: Get month name ─────────────────────────────────────────────────────
function getMonthName(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
  return months[date.getMonth()]
}

// ── Helper: Format date for comparison ─────────────────────────────────────────
function getYearMonth(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function StatistikPage() {
  const [anggotaData, setAnggotaData] = useState<Anggota[]>([])
  const [simpananData, setSimpananData] = useState<Simpanan[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const anggota = readStored<Anggota[]>(KEYS.ANGGOTA, [])
    const simpanan = readStored<Simpanan[]>(KEYS.SIMPAN, [])
    setAnggotaData(anggota)
    setSimpananData(simpanan)
  }, [])

  // ── Calculate member growth for last 12 months ─────────────────────────────────
  const calculateMemberGrowth = () => {
    const now = new Date()
    const monthlyData: { month: string; count: number }[] = []
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const safeAnggotaData = Array.isArray(anggotaData) ? anggotaData : []
      const count = safeAnggotaData.filter(a => getYearMonth(a.Tanggal_Masuk) === yearMonth).length
      monthlyData.push({
        month: getMonthName(d),
        count
      })
    }
    return monthlyData
  }

  // ── Calculate monthly savings for last 6 months ─────────────────────────────────
  const calculateMonthlySavings = () => {
    const now = new Date()
    const monthlyData: { month: string; count: number; total?: number }[] = []
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const total = simpananData
        .filter(s => getYearMonth(s.tanggalSetor) === yearMonth && s.status === 'Aktif')
        .reduce((sum, s) => sum + (s.jumlah || 0), 0)
      monthlyData.push({
        month: getMonthName(d),
        count: total
      })
    }
    return monthlyData
  }

  // ── Calculate savings composition by type ─────────────────────────────────────
  const calculateSavingsComposition = () => {
    const types: Record<string, number> = {
      Pokok: 0,
      Wajib: 0,
      Sibuhar: 0,
      Sisujang: 0,
      Simapan: 0,
      Sihat: 0,
      Sihar: 0
    }
    
    simpananData
      .filter(s => s.status === 'Aktif')
      .forEach(s => {
        if (types.hasOwnProperty(s.tipe)) {
          types[s.tipe] += s.jumlah || 0
        }
      })
    
    return Object.entries(types)
      .filter(([_, value]) => value > 0)
      .map(([type, value]) => ({ type, value }))
  }

  const memberGrowth = calculateMemberGrowth()
  const monthlySavings = calculateMonthlySavings()
  const savingsComposition = calculateSavingsComposition()

  // ── Simple Bar Chart Component ───────────────────────────────────────────────
  const BarChart = ({ data, title, colorClass }: { data: { month: string; count: number; total?: number }[]; title: string; colorClass: string }) => {
    const maxValue = Math.max(...data.map(d => d.count ?? d.total ?? 0), 1)
    
    return (
      <div className="w-full">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
        <div className="flex items-end justify-between h-40 gap-1">
          {data.map((item, idx) => {
            const value = item.count ?? item.total ?? 0
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full ${colorClass} rounded-t transition-all duration-300`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${item.month}: ${value}`}
                />
                <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                <span className="text-xs font-medium">{value}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Simple Pie Chart Component ────────────────────────────────────────────────
  const PieChart = ({ data }: { data: { type: string; value: number }[] }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280']
    
    let cumulative = 0
    const segments = data.map((item, idx) => {
      const percentage = (item.value / total) * 100
      const start = cumulative
      cumulative += percentage
      const largeArc = percentage > 50 ? 1 : 0
      const startX = Math.cos(2 * Math.PI * start / 100 - Math.PI / 2) * 40 + 50
      const startY = Math.sin(2 * Math.PI * start / 100 - Math.PI / 2) * 40 + 50
      const endX = Math.cos(2 * Math.PI * cumulative / 100 - Math.PI / 2) * 40 + 50
      const endY = Math.sin(2 * Math.PI * cumulative / 100 - Math.PI / 2) * 40 + 50
      
      return {
        ...item,
        percentage,
        startX,
        startY,
        endX,
        endY,
        largeArc,
        color: colors[idx % colors.length]
      }
    })

    return (
      <div className="flex flex-col items-center">
        <svg width="120" height="120" viewBox="0 0 100 100">
          {segments.map((seg, idx) => (
            <path
              key={idx}
              d={`M 50 50 L ${seg.startX} ${seg.startY} A 40 40 0 ${seg.largeArc} 1 ${seg.endX} ${seg.endY} Z`}
              fill={seg.color}
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div className="mt-2 text-xs">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="w-3 h-3 inline-block rounded-sm" style={{ backgroundColor: seg.color }} />
              <span>{seg.type}: {seg.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Statistik</h1>
              <p className="text-sm text-gray-600">Grafik dan statistik KSP Mulia Dana Sejahtera</p>
            </div>
            <Link href="/">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <nav className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            <Button variant="ghost" asChild><Link href="/">Dashboard</Link></Button>
            <Button variant="ghost" asChild><Link href="/anggota">Data Anggota</Link></Button>
            <Button variant="ghost" asChild><Link href="/simpanan">Simpanan</Link></Button>
            <Button variant="ghost" asChild><Link href="/pinjaman">Pinjaman</Link></Button>
            <Button variant="ghost" asChild><Link href="/laporan">Laporan</Link></Button>
            <Button variant="ghost" asChild><Link href="/statistik">Statistik</Link></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Grafik Pertumbuhan Anggota */}
          <Card>
            <CardHeader>
              <CardTitle>Grafik Pertumbuhan Anggota</CardTitle>
              <CardDescription>Grafik pertumbuhan 12 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              {anggotaData.length > 0 ? (
                <BarChart data={memberGrowth} title="Anggota Baru per Bulan" colorClass="bg-blue-500" />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <p>Belum ada data anggota</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Grafik Simpanan per Bulan */}
          <Card>
            <CardHeader>
              <CardTitle>Grafik Simpanan per Bulan</CardTitle>
              <CardDescription>Riwayat simpanan 6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              {simpananData.length > 0 ? (
                <BarChart data={monthlySavings} title="Total Simpanan per Bulan" colorClass="bg-emerald-500" />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <p>Belum ada data simpanan</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Komposisi Simpanan */}
          <Card>
            <CardHeader>
              <CardTitle>Komposisi Simpanan</CardTitle>
              <CardDescription>Persentase tipe simpanan</CardDescription>
            </CardHeader>
            <CardContent>
              {savingsComposition.length > 0 ? (
                <PieChart data={savingsComposition} />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <p>Belum ada data simpanan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}