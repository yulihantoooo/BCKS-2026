export type ModuleKey = 'praktik' | 'perilaku' | 'kompetensi';

export interface CategoryGroup {
  id: string;
  section: ModuleKey;
  superGroup?: string; // e.g., "D1 – Praktik Pembelajaran"
  title: string;
  subtitle: string;
  requiredCount: number;
}

export interface IndicatorItem {
  id: string;
  section: ModuleKey;
  groupId: string;
  text: string;
  description: string;
  poinSuggestion?: number;
}

export interface UserSession {
  nama: string;
  unitKerja: string;
  nip?: string;
  loggedInAt: string;
}

export interface TeacherPlan {
  namaGuru: string;
  nip: string;
  satuanPendidikan: string;
  jenjang: string;
  periode: string;
  selectedPraktikId: string;
  targetPraktikCatatan: string;
  selectedPerilakuFocusIds: string[];
  perilakuCatatan: Record<string, string>;
  selectedKompetensiIds: string[];
  targetPoinKompetensi: number;
  rencanaKegiatanKompetensi: string;
}

export const MODULE_METADATA: Record<
  ModuleKey,
  {
    number: string;
    title: string;
    shortTitle: string;
    subtitle: string;
    leftColumnLabel: string;
    rightColumnLabel: string;
    superColumnLabel?: string;
  }
> = {
  praktik: {
    number: '01',
    title: 'Praktik Kinerja Guru',
    shortTitle: 'Praktik Kinerja',
    subtitle: 'Dimensi Rapor D1 – Praktik Pembelajaran beserta aspek dan indikator rencana hasil kerja.',
    superColumnLabel: 'Dimensi Rapor',
    leftColumnLabel: 'Aspek',
    rightColumnLabel: 'Indikator (Rencana Hasil Kerja)',
  },
  perilaku: {
    number: '02',
    title: 'Perilaku Kerja Guru',
    shortTitle: 'Perilaku Kerja',
    subtitle: 'Tujuh nilai dasar BerAKHLAK beserta indikator perwujudan perilaku kerja guru.',
    leftColumnLabel: 'Aspek Perilaku Kerja',
    rightColumnLabel: 'Indikator Perwujudan Perilaku',
  },
  kompetensi: {
    number: '03',
    title: 'Pengembangan Kompetensi',
    shortTitle: 'Kompetensi',
    subtitle: 'Empat domain kompetensi guru beserta indikator kompetensi yang dikembangkan.',
    leftColumnLabel: 'Kompetensi',
    rightColumnLabel: 'Indikator Kompetensi',
  },
};

export const INITIAL_GROUPS: CategoryGroup[] = [
  // 1. PRAKTIK KINERJA GURU
  {
    id: 'pk-manajemen-kelas',
    section: 'praktik',
    superGroup: 'D1 – Praktik Pembelajaran',
    title: 'Manajemen Kelas',
    subtitle: 'Pengelolaan lingkungan fisik, aturan, dan ritme belajar agar kelas tertib dan kondusif.',
    requiredCount: 2,
  },
  {
    id: 'pk-dukungan-psikologis',
    section: 'praktik',
    superGroup: 'D1 – Praktik Pembelajaran',
    title: 'Dukungan Psikologis',
    subtitle: 'Penguatan emosi, rasa aman, kepedulian, serta ekspektasi positif kepada peserta didik.',
    requiredCount: 3,
  },
  {
    id: 'pk-aktivasi-kognitif',
    section: 'praktik',
    superGroup: 'D1 – Praktik Pembelajaran',
    title: 'Aktivasi Kognitif',
    subtitle: 'Stimulasi proses berpikir kritis, kolaborasi aktif, dan penyesuaian instruksi belajar.',
    requiredCount: 3,
  },

  // 2. PERILAKU KERJA GURU (BerAKHLAK)
  {
    id: 'pr-berorientasi-pelayanan',
    section: 'perilaku',
    title: 'Berorientasi Pelayanan',
    subtitle: 'Komitmen memberikan layanan pendidikan terbaik bagi peserta didik, orang tua, dan warga sekolah.',
    requiredCount: 3,
  },
  {
    id: 'pr-akuntabel',
    section: 'perilaku',
    title: 'Akuntabel',
    subtitle: 'Bertanggung jawab atas kepercayaan, integritas, dan penggunaan sumber daya pendidikan.',
    requiredCount: 3,
  },
  {
    id: 'pr-kompeten',
    section: 'perilaku',
    title: 'Kompeten',
    subtitle: 'Terus belajar dan mengembangkan kapabilitas untuk menghasilkan kinerja terbaik.',
    requiredCount: 3,
  },
  {
    id: 'pr-harmonis',
    section: 'perilaku',
    title: 'Harmonis',
    subtitle: 'Saling peduli, menghargai perbedaan, dan membangun iklim belajar yang kondusif.',
    requiredCount: 3,
  },
  {
    id: 'pr-loyal',
    section: 'perilaku',
    title: 'Loyal',
    subtitle: 'Berdedikasi pada moral profesi, kepatuhan regulasi, dan menjaga nama baik satuan pendidikan.',
    requiredCount: 3,
  },
  {
    id: 'pr-adaptif',
    section: 'perilaku',
    title: 'Adaptif',
    subtitle: 'Terus berinovasi dan antusias menghadapi perubahan dinamika pembelajaran.',
    requiredCount: 3,
  },
  {
    id: 'pr-kolaboratif',
    section: 'perilaku',
    title: 'Kolaboratif',
    subtitle: 'Membangun kerja sama yang sinergis dengan seluruh pemangku kepentingan pendidikan.',
    requiredCount: 3,
  },

  // 3. PENGEMBANGAN KOMPETENSI
  {
    id: 'km-pedagogik',
    section: 'kompetensi',
    title: 'Pedagogik',
    subtitle: 'Kemampuan mengelola pembelajaran, lingkungan aman, dan asesmen yang berpusat pada peserta didik.',
    requiredCount: 3,
  },
  {
    id: 'km-kepribadian',
    section: 'kompetensi',
    title: 'Kepribadian',
    subtitle: 'Kemampuan kematangan moral, refleksi diri, dan keteladanan sesuai kode etik guru.',
    requiredCount: 3,
  },
  {
    id: 'km-sosial',
    section: 'kompetensi',
    title: 'Sosial',
    subtitle: 'Kemampuan berkolaborasi dengan rekan sejawat, orang tua/wali, masyarakat, dan organisasi profesi.',
    requiredCount: 3,
  },
  {
    id: 'km-profesional',
    section: 'kompetensi',
    title: 'Profesional',
    subtitle: 'Penguasaan materi ajar, kurikulum, serta pemahaman karakteristik dan cara belajar peserta didik.',
    requiredCount: 3,
  },
];

export const INITIAL_INDICATORS: IndicatorItem[] = [
  // 1. PRAKTIK KINERJA GURU
  {
    id: 'ind-pk-1',
    section: 'praktik',
    groupId: 'pk-manajemen-kelas',
    text: 'Keteraturan Suasana Kelas',
    description: 'Upaya membangun suasana kelas yang kondusif untuk proses belajar dengan minimal gangguan yang mengalihkan perhatian peserta didik.',
  },
  {
    id: 'ind-pk-2',
    section: 'praktik',
    groupId: 'pk-manajemen-kelas',
    text: 'Penerapan Disiplin Positif',
    description: 'Upaya menerapkan prinsip disiplin positif untuk mengelola perilaku dan kebiasaan kelas yang disepakati bersama.',
  },
  {
    id: 'ind-pk-3',
    section: 'praktik',
    groupId: 'pk-dukungan-psikologis',
    text: 'Umpan balik Konstruktif',
    description: 'Penyampaian informasi proses dan hasil belajar untuk memotivasi usaha perbaikan berkelanjutan peserta didik.',
  },
  {
    id: 'ind-pk-4',
    section: 'praktik',
    groupId: 'pk-dukungan-psikologis',
    text: 'Perhatian dan Kepedulian',
    description: 'Pemberian perhatian dan dukungan sesuai kebutuhan belajar setiap peserta didik agar merasa dihargai dan bermakna.',
  },
  {
    id: 'ind-pk-5',
    section: 'praktik',
    groupId: 'pk-dukungan-psikologis',
    text: 'Ekspektasi pada Peserta Didik',
    description: 'Mengomunikasikan ekspektasi yang tinggi terhadap masa depan dan potensi seluruh peserta didik secara setara.',
  },
  {
    id: 'ind-pk-6',
    section: 'praktik',
    groupId: 'pk-aktivasi-kognitif',
    text: 'Kerja Interaktif',
    description: 'Memfasilitasi kegiatan pembelajaran yang mendorong kolaborasi, diskusi aktif, dan pertukaran gagasan antarpeserta didik.',
  },
  {
    id: 'ind-pk-7',
    section: 'praktik',
    groupId: 'pk-aktivasi-kognitif',
    text: 'Instruksi yang Adaptif',
    description: 'Penyesuaian strategi dan instruksi pembelajaran secara responsif berdasarkan umpan balik dan tingkat pemahaman murid.',
  },
  {
    id: 'ind-pk-8',
    section: 'praktik',
    groupId: 'pk-aktivasi-kognitif',
    text: 'Instruksi Pembelajaran',
    description: 'Penjelasan materi yang terstruktur disertai contoh kontekstual untuk memandu pemahaman konsep peserta didik.',
  },

  // 2. PERILAKU KERJA GURU
  // Berorientasi Pelayanan
  {
    id: 'ind-pr-1',
    section: 'perilaku',
    groupId: 'pr-berorientasi-pelayanan',
    text: 'Memahami kebutuhan peserta didik dan berusaha memenuhinya',
    description: 'Mengidentifikasi kebutuhan belajar dan tumbuh kembang peserta didik secara proaktif.',
  },
  {
    id: 'ind-pr-2',
    section: 'perilaku',
    groupId: 'pr-berorientasi-pelayanan',
    text: 'Bersifat ramah kepada peserta didik dan orang tua tanpa membeda-bedakan, cekatan, solutif, dan dapat diandalkan',
    description: 'Melayani peserta didik, orang tua, dan rekan sejawat secara setara serta responsif.',
  },
  {
    id: 'ind-pr-3',
    section: 'perilaku',
    groupId: 'pr-berorientasi-pelayanan',
    text: 'Melakukan perbaikan terus-menerus terhadap kompetensi dan perilaku kerjanya',
    description: 'Mengevaluasi mutu layanan pembelajaran dan memperbaikinya secara berkelanjutan.',
  },

  // Akuntabel
  {
    id: 'ind-pr-4',
    section: 'perilaku',
    groupId: 'pr-akuntabel',
    text: 'Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, disiplin, dan berintegritas tinggi',
    description: 'Menjalankan kewajiban mengajar, menilai, dan administrasi pembelajaran dengan penuh integritas.',
  },
  {
    id: 'ind-pr-5',
    section: 'perilaku',
    groupId: 'pr-akuntabel',
    text: 'Memanfaatkan sumber daya satuan pendidikan dengan bertanggung jawab, efektif, dan efisien',
    description: 'Menggunakan fasilitas, sarana prasarana, dan anggaran sekolah secara tepat guna.',
  },
  {
    id: 'ind-pr-6',
    section: 'perilaku',
    groupId: 'pr-akuntabel',
    text: 'Tidak menyalahgunakan kewenangan jabatannya demi keuntungan pribadi',
    description: 'Menjaga objektivitas dalam penilaian dan layanan pendidikan tanpa konflik kepentingan.',
  },

  // Kompeten
  {
    id: 'ind-pr-7',
    section: 'perilaku',
    groupId: 'pr-kompeten',
    text: 'Menunjukkan penguasaan kompetensi yang memadai dalam melakukan kinerja',
    description: 'Menerapkan pengetahuan pedagogik dan profesional secara terukur dalam tugas sehari-hari.',
  },
  {
    id: 'ind-pr-8',
    section: 'perilaku',
    groupId: 'pr-kompeten',
    text: 'Membantu peserta didik, rekan sejawat, dan orang lain untuk saling belajar',
    description: 'Berbagi praktik baik di komunitas belajar guru dan mendampingi murid belajar.',
  },
  {
    id: 'ind-pr-9',
    section: 'perilaku',
    groupId: 'pr-kompeten',
    text: 'Melaksanakan tugas dengan kualitas terbaik',
    description: 'Menuntaskan perangkat ajar, pembelajaran, dan asesmen dengan standar mutu tinggi.',
  },

  // Harmonis
  {
    id: 'ind-pr-10',
    section: 'perilaku',
    groupId: 'pr-harmonis',
    text: 'Menghargai setiap warga satuan pendidikan apapun latar belakangnya',
    description: 'Menjunjung tinggi inklusivitas, toleransi, dan keberagaman di lingkungan sekolah.',
  },
  {
    id: 'ind-pr-11',
    section: 'perilaku',
    groupId: 'pr-harmonis',
    text: 'Memberikan pertolongan bagi warga satuan pendidikan yang memerlukan',
    description: 'Sigap membantu rekan guru, tenaga kependidikan, maupun peserta didik yang mengalami kesulitan.',
  },
  {
    id: 'ind-pr-12',
    section: 'perilaku',
    groupId: 'pr-harmonis',
    text: 'Membangun lingkungan pembelajaran yang kondusif',
    description: 'Menciptakan suasana kerja dan belajar yang aman, nyaman, dan saling menghormati.',
  },

  // Loyal
  {
    id: 'ind-pr-13',
    section: 'perilaku',
    groupId: 'pr-loyal',
    text: 'Memegang teguh moral dan mematuhi peraturan perundang-undangan yang berlaku',
    description: 'Taat pada kode etik profesi guru serta tata tertib dan regulasi pendidikan.',
  },
  {
    id: 'ind-pr-14',
    section: 'perilaku',
    groupId: 'pr-loyal',
    text: 'Menjaga nama baik satuan pendidikan, sesama guru, dan peserta didik di mana pun berada',
    description: 'Menunjukkan sikap teladan dalam komunikasi luring maupun daring demi kehormatan sekolah.',
  },
  {
    id: 'ind-pr-15',
    section: 'perilaku',
    groupId: 'pr-loyal',
    text: 'Menjaga informasi yang bersifat sensitif dan berpotensi merugikan peserta didik dan satuan pendidikan',
    description: 'Menjaga kerahasiaan data pribadi, kondisi psikologis murid, dan dokumen internal sekolah.',
  },

  // Adaptif
  {
    id: 'ind-pr-16',
    section: 'perilaku',
    groupId: 'pr-adaptif',
    text: 'Menyesuaikan diri secara cepat dalam menghadapi dinamika pembelajaran di kelas',
    description: 'Responsif terhadap perubahan kebutuhan murid, teknologi pembelajaran, dan situasi kelas.',
  },
  {
    id: 'ind-pr-17',
    section: 'perilaku',
    groupId: 'pr-adaptif',
    text: 'Terus berinovasi dan mengembangkan kreativitas untuk memajukan satuan pendidikan',
    description: 'Mengembangkan media, metode, atau proyek pembelajaran baru yang relevan.',
  },
  {
    id: 'ind-pr-18',
    section: 'perilaku',
    groupId: 'pr-adaptif',
    text: 'Berpikir proaktif untuk mengembangkan diri dan warga satuan pendidikan',
    description: 'Mengambil inisiatif peningkatan mutu sebelum muncul kendala di lapangan.',
  },

  // Kolaboratif
  {
    id: 'ind-pr-19',
    section: 'perilaku',
    groupId: 'pr-kolaboratif',
    text: 'Memberi kesempatan kepada warga satuan pendidikan dan masyarakat untuk berkontribusi bagi pembelajaran',
    description: 'Melibatkan orang tua, komite, dan mitra eksternal dalam program yang berpusat pada peserta didik.',
  },
  {
    id: 'ind-pr-20',
    section: 'perilaku',
    groupId: 'pr-kolaboratif',
    text: 'Bekerja sama secara terbuka dalam menghasilkan dampak pembelajaran yang merata',
    description: 'Berkoordinasi aktif lintas mata pelajaran dan tim sekolah demi kemajuan semua murid.',
  },
  {
    id: 'ind-pr-21',
    section: 'perilaku',
    groupId: 'pr-kolaboratif',
    text: 'Menggerakkan pemanfaatan sumber daya satuan pendidikan untuk pencapaian visi dan misi',
    description: 'Mengorkestrasi aset dan potensi sekolah bersama tim untuk mewujudkan tujuan bersama.',
  },

  // 3. PENGEMBANGAN KOMPETENSI
  // Pedagogik
  {
    id: 'ind-km-1',
    section: 'kompetensi',
    groupId: 'km-pedagogik',
    text: 'Lingkungan pembelajaran yang aman dan nyaman bagi peserta didik',
    description: 'Pengelolaan suasana belajar yang mendukung keamanan fisik, psikis, dan kenyamanan murid.',
    poinSuggestion: 8,
  },
  {
    id: 'ind-km-2',
    section: 'kompetensi',
    groupId: 'km-pedagogik',
    text: 'Pembelajaran efektif yang berpusat pada peserta didik',
    description: 'Perancangan dan pelaksanaan pembelajaran aktif yang relevan dengan kebutuhan murid.',
    poinSuggestion: 8,
  },
  {
    id: 'ind-km-3',
    section: 'kompetensi',
    groupId: 'km-pedagogik',
    text: 'Asesmen, umpan balik, dan pelaporan yang berpusat pada peserta didik',
    description: 'Pelaksanaan asesmen diagnostik, formatif, sumatif, dan umpan balik yang membangun.',
    poinSuggestion: 8,
  },

  // Kepribadian
  {
    id: 'ind-km-4',
    section: 'kompetensi',
    groupId: 'km-kepribadian',
    text: 'Kematangan moral, emosi, dan spiritual untuk berperilaku sesuai kode etik guru',
    description: 'Pengendalian diri dan keteladanan nilai moral dalam berinteraksi di sekolah.',
    poinSuggestion: 6,
  },
  {
    id: 'ind-km-5',
    section: 'kompetensi',
    groupId: 'km-kepribadian',
    text: 'Pengembangan diri melalui kebiasaan refleksi',
    description: 'Melakukan refleksi rutin atas praktik mengajar untuk menentukan langkah perbaikan.',
    poinSuggestion: 8,
  },
  {
    id: 'ind-km-6',
    section: 'kompetensi',
    groupId: 'km-kepribadian',
    text: 'Orientasi berpusat pada peserta didik',
    description: 'Menempatkan kepentingan terbaik peserta didik sebagai prioritas utama keputusan profesional.',
    poinSuggestion: 6,
  },

  // Sosial
  {
    id: 'ind-km-7',
    section: 'kompetensi',
    groupId: 'km-sosial',
    text: 'Kolaborasi untuk peningkatan pembelajaran',
    description: 'Bekerja sama dengan rekan sejawat dalam merancang dan mengevaluasi pembelajaran.',
    poinSuggestion: 8,
  },
  {
    id: 'ind-km-8',
    section: 'kompetensi',
    groupId: 'km-sosial',
    text: 'Keterlibatan orangtua/wali dan masyarakat dalam pembelajaran',
    description: 'Membangun kemitraan aktif dengan keluarga dan komunitas untuk mendukung belajar murid.',
    poinSuggestion: 6,
  },
  {
    id: 'ind-km-9',
    section: 'kompetensi',
    groupId: 'km-sosial',
    text: 'Keterlibatan dalam organisasi profesi dan jejaring yang lebih luas',
    description: 'Berperan aktif di KKG/MGMP atau komunitas belajar untuk peningkatan mutu pembelajaran.',
    poinSuggestion: 8,
  },

  // Profesional
  {
    id: 'ind-km-10',
    section: 'kompetensi',
    groupId: 'km-profesional',
    text: 'Pengetahuan konten pembelajaran dan cara mengajarkannya',
    description: 'Penguasaan struktur keilmuan mata pelajaran dan pedagogi khusus bidang ajar.',
    poinSuggestion: 8,
  },
  {
    id: 'ind-km-11',
    section: 'kompetensi',
    groupId: 'km-profesional',
    text: 'Karakteristik dan cara belajar peserta didik',
    description: 'Pemahaman perkembangan kognitif, sosial-emosional, dan keragaman gaya belajar murid.',
    poinSuggestion: 8,
  },
  {
    id: 'ind-km-12',
    section: 'kompetensi',
    groupId: 'km-profesional',
    text: 'Kurikulum dan cara menggunakannya',
    description: 'Kemampuan menginterpretasikan capaian pembelajaran dan menyusun alur tujuan pembelajaran.',
    poinSuggestion: 8,
  },
];

export const DEFAULT_TEACHER_PLAN: TeacherPlan = {
  namaGuru: 'Yulianto Harsono, S.Pd.',
  nip: '19880412 201503 1 004',
  satuanPendidikan: 'SMA Negeri Harapan Bangsa',
  jenjang: 'SMA',
  periode: 'Semester Ganjil 2026/2027',
  selectedPraktikId: 'ind-pk-6',
  targetPraktikCatatan: 'Meningkatkan partisipasi diskusi kelompok kecil minimal 85% siswa aktif bertanya dan berargumen.',
  selectedPerilakuFocusIds: [
    'ind-pr-1',
    'ind-pr-4',
    'ind-pr-8',
    'ind-pr-10',
    'ind-pr-13',
    'ind-pr-16',
    'ind-pr-20',
  ],
  perilakuCatatan: {
    'pr-berorientasi-pelayanan': 'Melakukan asesmen diagnostik awal untuk memetakan kebutuhan belajar murid.',
    'pr-akuntabel': 'Mengarsipkan rubrik dan hasil penilaian secara transparan dan tepat waktu.',
    'pr-kompeten': 'Berbagi praktik baik pembelajaran diferensiasi pada forum MGMP sekolah.',
    'pr-harmonis': 'Membangun kesepakatan kelas yang menghargai keberagaman pendapat.',
    'pr-loyal': 'Menjaga kerahasiaan data konseling dan catatan perkembangan murid.',
    'pr-adaptif': 'Mengintegrasikan media simulasi interaktif saat konsep abstrak sulit dipahami.',
    'pr-kolaboratif': 'Mengadakan proyek kolaboratif lintas mata pelajaran bersama guru serumpun.',
  },
  selectedKompetensiIds: ['ind-km-2', 'ind-km-3', 'ind-km-5', 'ind-km-9'],
  targetPoinKompetensi: 32,
  rencanaKegiatanKompetensi:
    'Mengikuti pelatihan mandiri PMM, aktif sebagai narasumber berbagi praktik baik di Komunitas Belajar sekolah, serta menyusun perangkat ajar terdiferensiasi.',
};
