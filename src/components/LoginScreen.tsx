import React, { useState } from 'react';
import { LogIn, AlertCircle, User, Building2, ArrowRight } from 'lucide-react';
import { UserSession } from '../data/kinerjaData';

interface LoginScreenProps {
  recentUsers: UserSession[];
  onLogin: (session: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  recentUsers,
  onLogin,
}) => {
  const [nama, setNama] = useState('');
  const [unitKerja, setUnitKerja] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNama = nama.trim();
    const trimmedUnit = unitKerja.trim();

    if (!trimmedNama) {
      setError('Mohon isi Nama terlebih dahulu.');
      return;
    }
    if (!trimmedUnit) {
      setError('Mohon isi Unit Kerja terlebih dahulu.');
      return;
    }

    setError('');
    onLogin({
      nama: trimmedNama,
      unitKerja: trimmedUnit,
      loggedInAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <span className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0">
            KinerjaGuru
          </span>
          <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
            Soal Menjodohkan Kinerja Guru
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Masuk Peserta
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Masukkan Nama dan Unit Kerja Anda untuk mengerjakan soal menjodohkan Pengelolaan Kinerja Guru dan mengunduh hasilnya.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-nama"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Nama Lengkap <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-nama"
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Contoh: Yulianto Harsono, S.Pd."
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-unit-kerja"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Unit Kerja <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-unit-kerja"
                  type="text"
                  required
                  value={unitKerja}
                  onChange={(e) => {
                    setUnitKerja(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Contoh: SMA Negeri 1 Nusantara"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              Masuk &amp; Mulai Soal
            </button>
          </form>

          {recentUsers.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <p className="text-xs font-semibold text-slate-500">
                Masuk Cepat (Akun Terakhir)
              </p>
              <div className="space-y-2">
                {recentUsers.map((u) => (
                  <button
                    key={`${u.nama}-${u.unitKerja}`}
                    type="button"
                    onClick={() =>
                      onLogin({
                        ...u,
                        loggedInAt: new Date().toISOString(),
                      })
                    }
                    className="w-full flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 px-3.5 py-2.5 text-left transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {u.nama}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {u.unitKerja}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
