'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Edit, Trash2, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import RegisterAnggotaForm from '@/components/RegisterAnggotaForm';

interface Anggota {
  id: string;
  nama: string;
  nik: string;
  telepon: string;
  alamat: string;
  simpanan: number;
  pinjaman: number;
}

const anggotaData: Anggota[] = [];

export default function AnggotaClientContent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {showForm ? (
        <>
          <div className="mb-6">
            <Button variant="outline" asChild onClick={() => setShowForm(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Anggota
            </Button>
          </div>
          <RegisterAnggotaForm onComplete={() => setShowForm(false)} />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Anggota</CardTitle>
            <CardDescription>Total 0 anggota terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Cari anggota..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Anggota</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Simpanan</TableHead>
                  <TableHead>Pinjaman</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anggotaData.map((anggota) => (
                  <TableRow key={anggota.id}>
                    <TableCell className="font-medium">{anggota.id}</TableCell>
                    <TableCell>{anggota.nama}</TableCell>
                    <TableCell>{anggota.nik}</TableCell>
                    <TableCell>{anggota.telepon}</TableCell>
                    <TableCell>{anggota.alamat}</TableCell>
                    <TableCell>Rp {anggota.simpanan.toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp {anggota.pinjaman.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}