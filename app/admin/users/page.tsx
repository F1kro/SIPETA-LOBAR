'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Edit2, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Search, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Calendar,
  UserCheck,
  UserCog
} from 'lucide-react'

interface Admin {
  id: string
  email: string
  role: 'SUPERADMIN' | 'PEGAWAI' 
  createdAt: string
}

export default function UsersListPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [currentAdminRole, setCurrentAdminRole] = useState<string | null>(null)

  useEffect(() => {
    fetchAdmins()
    const role = localStorage.getItem('role') // Sesuaikan dengan cara kamu simpan session
    setCurrentAdminRole(role)
  }, [])

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin')
      const data = await res.json()
      setAdmins(data)
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun admin ini?')) return

    try {
      const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' })
      if (res.ok) fetchAdmins()
    } catch (error) {
      console.error('Error deleting admin:', error)
    }
  }

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  // Filter Search
  const filteredAdmins = admins.filter((admin) => 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination Logic
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem)

  const isSuperAdmin = currentAdminRole === 'SUPERADMIN'

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Access Control</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Users / Admin
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">
            Kelola hak akses dan akun pengelola sistem SIPETA
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="CARI EMAIL ADMIN..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-11 pr-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
          
          {/* TOMBOL TAMBAH: Hanya muncul untuk Superadmin */}
          {isSuperAdmin && (
            <Link href="/admin/users/tambah">
              <Button className="bg-blue-600 hover:bg-slate-900 text-white px-6 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3">
                <Plus size={18} /> Tambah Admin
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Table Card Section */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Admin tidak ditemukan</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <table className="w-full border-separate border-spacing-0">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:rounded-tl-[2.5rem]">Informasi Akun</th>
                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Otoritas Role</th>
                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal Registrasi</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] last:rounded-tr-[2.5rem]">Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentItems.map((admin) => (
                    <tr key={admin.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Mail size={14} className="text-blue-600" />
                          </div>
                          <span className="font-black text-slate-900 uppercase tracking-tight text-sm group-hover:text-blue-600 transition-colors">
                            {admin.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {admin.role === 'SUPERADMIN' ? (
                            <ShieldCheck size={14} className="text-blue-500" />
                          ) : (
                            <UserCog size={14} className="text-slate-400" />
                          )}
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            admin.role === 'SUPERADMIN' 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-slate-100 text-slate-600"
                          }`}>
                            {admin.role === 'SUPERADMIN' ? 'Superadmin' : 'Pegawai'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={14} />
                          <span className="text-xs font-bold uppercase tracking-wide">
                            {new Date(admin.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {/* AKSI: Hanya muncul jika user yang login adalah SUPERADMIN */}
                        {isSuperAdmin ? (
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/users/${admin.id}`}>
                              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-black text-[10px] uppercase tracking-widest gap-2">
                                <Edit2 className="w-3 h-3" /> Edit
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(admin.id)}
                              className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Read Only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Component */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50 border-t border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-0">
                  Menampilkan <span className="text-slate-900">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredAdmins.length)}</span> Dari <span className="text-slate-900">{filteredAdmins.length}</span> Akun Admin
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-blue-600 hover:text-white transition-all p-0"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`h-10 w-10 rounded-xl font-black text-xs transition-all p-0 ${
                          currentPage === page 
                            ? "bg-blue-600 shadow-lg shadow-blue-200 border-blue-600 text-white" 
                            : "bg-white border-slate-200 text-slate-400 hover:text-blue-600"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-blue-600 hover:text-white transition-all p-0"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}