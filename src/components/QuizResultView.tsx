import React, { useMemo } from 'react';
import {
  Download,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  CategoryGroup,
  IndicatorItem,
  MODULE_METADATA,
  ModuleKey,
  UserSession,
} from '../data/kinerjaData';

interface QuizResultViewProps {
  user: UserSession;
  groups: CategoryGroup[];
  activeIndicatorsByModule: Record<ModuleKey, IndicatorItem[]>;
  placements: Record<string, string>;
  onBackToQuiz: () => void;
  onRetryQuiz: () => void;
}

interface GradedRow {
  section: ModuleKey;
  indicator: IndicatorItem;
  expectedGroupTitle: string;
  chosenGroupTitle: string | null;
  status: 'correct' | 'wrong' | 'unanswered';
}

function escapeCsvCell(value: string): string {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  user,
  groups,
  activeIndicatorsByModule,
  placements,
  onBackToQuiz,
  onRetryQuiz,
}) => {
  const modules: ModuleKey[] = ['praktik', 'perilaku', 'kompetensi'];

  const groupMap = useMemo(() => {
    const map = new Map<string, CategoryGroup>();
    groups.forEach((g) => map.set(g.id, g));
    return map;
  }, [groups]);

  const gradedByModule = useMemo(() => {
    const result: Record<ModuleKey, GradedRow[]> = {
      praktik: [],
      perilaku: [],
      kompetensi: [],
    };
    modules.forEach((mod) => {
      result[mod] = activeIndicatorsByModule[mod].map((ind) => {
        const chosenGroupId = placements[ind.id];
        const expectedTitle = groupMap.get(ind.groupId)?.title ?? '-';
        const chosenTitle = chosenGroupId
          ? groupMap.get(chosenGroupId)?.title ?? null
          : null;
        let status: GradedRow['status'] = 'unanswered';
        if (chosenGroupId) {
          status = chosenGroupId === ind.groupId ? 'correct' : 'wrong';
        }
        return {
          section: mod,
          indicator: ind,
          expectedGroupTitle: expectedTitle,
          chosenGroupTitle: chosenTitle,
          status,
        };
      });
    });
    return result;
  }, [activeIndicatorsByModule, placements, groupMap]);

  const summary = useMemo(() => {
    let total = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const perModule = modules.map((mod) => {
      const rows = gradedByModule[mod];
      const modTotal = rows.length;
      const modCorrect = rows.filter((r) => r.status === 'correct').length;
      const modWrong = rows.filter((r) => r.status === 'wrong').length;
      const modUnanswered = rows.filter((r) => r.status === 'unanswered').length;
      total += modTotal;
      correct += modCorrect;
      wrong += modWrong;
      unanswered += modUnanswered;
      return {
        module: mod,
        title: MODULE_METADATA[mod].title,
        total: modTotal,
        correct: modCorrect,
        wrong: modWrong,
        unanswered: modUnanswered,
        scorePercent: modTotal > 0 ? Math.round((modCorrect / modTotal) * 100) : 0,
      };
    });

    return {
      total,
      correct,
      wrong,
      unanswered,
      scorePercent: total > 0 ? Math.round((correct / total) * 100) : 0,
      perModule,
    };
  }, [gradedByModule]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date());
  }, []);

  const safeSlug = user.nama
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const handleDownloadCsv = () => {
    const lines: string[] = [];
    lines.push(['HASIL SOAL MENJODOHKAN PENGELOLAAN KINERJA GURU'].map(escapeCsvCell).join(','));
    lines.push(['Nama', user.nama].map(escapeCsvCell).join(','));
    lines.push(['Unit Kerja', user.unitKerja].map(escapeCsvCell).join(','));
    lines.push(['Waktu', formattedDate].map(escapeCsvCell).join(','));
    lines.push(
      ['Skor Akhir', `${summary.correct} / ${summary.total} (${summary.scorePercent}%)`]
        .map(escapeCsvCell)
        .join(',')
    );
    lines.push('');
    lines.push(
      ['No', 'Bagian', 'Indikator / Soal', 'Jawaban Anda', 'Status']
        .map(escapeCsvCell)
        .join(',')
    );

    let index = 1;
    modules.forEach((mod) => {
      const modTitle = MODULE_METADATA[mod].title;
      gradedByModule[mod].forEach((row) => {
        const statusText =
          row.status === 'correct'
            ? 'Benar'
            : row.status === 'wrong'
            ? 'Belum Tepat'
            : 'Belum Dijawab';
        lines.push(
          [
            String(index++),
            modTitle,
            row.indicator.text,
            row.chosenGroupTitle ?? '-',
            statusText,
          ]
            .map(escapeCsvCell)
            .join(',')
        );
      });
    });

    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerFileDownload(blob, `hasil-menjodohkan-${safeSlug || 'guru'}.csv`);
  };

  const handleDownloadWord = () => {
    const moduleTablesHtml = modules
      .map((mod) => {
        const meta = MODULE_METADATA[mod];
        const rowsHtml = gradedByModule[mod]
          .map((row, idx) => {
            const statusText =
              row.status === 'correct'
                ? 'Benar'
                : row.status === 'wrong'
                ? 'Belum Tepat'
                : 'Belum Dijawab';
            return `
              <tr>
                <td style="padding:6px 8px;border:1px solid #cbd5e1;text-align:center;">${idx + 1}</td>
                <td style="padding:6px 8px;border:1px solid #cbd5e1;">${escapeHtml(row.indicator.text)}</td>
                <td style="padding:6px 8px;border:1px solid #cbd5e1;">${escapeHtml(row.chosenGroupTitle ?? '-')}</td>
                <td style="padding:6px 8px;border:1px solid #cbd5e1;font-weight:bold;">${statusText}</td>
              </tr>`;
          })
          .join('');

        return `
          <h3 style="margin-top:20px;margin-bottom:8px;font-family:Arial,sans-serif;">${meta.number}. ${escapeHtml(meta.title)}</h3>
          <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="padding:6px 8px;border:1px solid #cbd5e1;width:36px;">No</th>
                <th style="padding:6px 8px;border:1px solid #cbd5e1;text-align:left;">Indikator</th>
                <th style="padding:6px 8px;border:1px solid #cbd5e1;text-align:left;">Jawaban Anda</th>
                <th style="padding:6px 8px;border:1px solid #cbd5e1;text-align:left;width:100px;">Status</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>`;
      })
      .join('');

    const htmlDoc = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Hasil Soal Menjodohkan - ${escapeHtml(user.nama)}</title>
</head>
<body style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;">
  <h2 style="margin-bottom:4px;">HASIL SOAL MENJODOHKAN PENGELOLAAN KINERJA GURU</h2>
  <p style="margin-top:0;color:#475569;font-size:13px;">Dicetak pada ${escapeHtml(formattedDate)}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px;">
    <tr>
      <td style="padding:4px 8px;width:140px;"><strong>Nama Lengkap</strong></td>
      <td style="padding:4px 8px;">: ${escapeHtml(user.nama)}</td>
    </tr>
    <tr>
      <td style="padding:4px 8px;"><strong>Unit Kerja</strong></td>
      <td style="padding:4px 8px;">: ${escapeHtml(user.unitKerja)}</td>
    </tr>
    <tr>
      <td style="padding:4px 8px;"><strong>Nilai Akhir</strong></td>
      <td style="padding:4px 8px;">: <strong>${summary.scorePercent}%</strong> (${summary.correct} benar dari ${summary.total} soal)</td>
    </tr>
  </table>
  ${moduleTablesHtml}
</body>
</html>`;

    const blob = new Blob(['\uFEFF', htmlDoc], {
      type: 'application/msword;charset=utf-8',
    });
    triggerFileDownload(blob, `hasil-menjodohkan-${safeSlug || 'guru'}.doc`);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hasil Soal Menjodohkan
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Ringkasan ketepatan pasangan indikator dan unduh laporan hasil pengerjaan Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToQuiz}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            Kembali ke Soal
          </button>

          <button
            type="button"
            onClick={onRetryQuiz}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Kerjakan Ulang
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Download Excel (.csv)
          </button>

          <button
            type="button"
            onClick={handleDownloadWord}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            Download Word (.doc)
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Cetak / PDF
          </button>
        </div>
      </div>

      {/* Printable Result Summary Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 print:border-0 print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Laporan Hasil Evaluasi · {formattedDate}
            </p>
            <h3 className="text-xl font-bold text-slate-900">{user.nama}</h3>
            <p className="text-sm text-slate-600">{user.unitKerja}</p>
          </div>

          <div className="sm:text-right tabular-nums">
            <p className="text-xs text-slate-500">Nilai Keseluruhan</p>
            <p className="text-3xl font-bold font-mono text-slate-900 mt-0.5">
              {summary.scorePercent}%
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {summary.correct} benar · {summary.wrong} belum tepat ·{' '}
              {summary.unanswered} kosong
            </p>
          </div>
        </div>

        {/* Per-Module Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.perModule.map((m) => (
            <div
              key={m.module}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 tabular-nums"
            >
              <p className="text-xs font-medium text-slate-500">
                {MODULE_METADATA[m.module].number}. {m.title}
              </p>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {m.correct}/{m.total}
                </span>
                <span
                  className={`text-xs font-semibold font-mono ${
                    m.scorePercent === 100
                      ? 'text-emerald-700'
                      : m.scorePercent >= 70
                      ? 'text-blue-700'
                      : 'text-slate-600'
                  }`}
                >
                  {m.scorePercent}% tepat
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Answer Table per Module */}
      <div className="space-y-6">
        {modules.map((mod) => {
          const meta = MODULE_METADATA[mod];
          const rows = gradedByModule[mod];
          return (
            <section
              key={mod}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden print-break-inside-avoid"
            >
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-900">
                  {meta.number}. {meta.title}
                </h3>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  {rows.filter((r) => r.status === 'correct').length}/{rows.length}{' '}
                  benar
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4 w-12">No</th>
                      <th className="py-3 px-4">{meta.rightColumnLabel}</th>
                      <th className="py-3 px-4 w-56">Jawaban Anda</th>
                      <th className="py-3 px-4 w-36">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((row, idx) => (
                      <tr key={row.indicator.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono text-xs text-slate-500 tabular-nums align-top">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 align-top">
                          {row.indicator.text}
                        </td>
                        <td className="py-3 px-4 text-slate-700 align-top">
                          {row.chosenGroupTitle ?? (
                            <span className="text-slate-400 italic">
                              Belum dijawab
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 align-top whitespace-nowrap">
                          {row.status === 'correct' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              Benar
                            </span>
                          ) : row.status === 'wrong' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              Belum Tepat
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <MinusCircle className="w-4 h-4 shrink-0" />
                              Kosong
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
