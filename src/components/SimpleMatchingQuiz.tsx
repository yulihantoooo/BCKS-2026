import React, { useState, useMemo } from 'react';
import {
  Shuffle,
  RotateCcw,
  ArrowRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  CategoryGroup,
  IndicatorItem,
  MODULE_METADATA,
  ModuleKey,
} from '../data/kinerjaData';

interface SimpleMatchingQuizProps {
  groups: CategoryGroup[];
  activeIndicatorsByModule: Record<ModuleKey, IndicatorItem[]>;
  placements: Record<string, string>;
  perilakuLengkap: boolean;
  onTogglePerilakuLengkap: (lengkap: boolean) => void;
  onAssign: (indicatorId: string, groupId: string) => void;
  onRemovePlacement: (indicatorId: string) => void;
  onResetAll: () => void;
  onFinishQuiz: () => void;
}

function shuffleArray<T>(items: T[], seedOffset = 0): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j =
      Math.floor(
        ((Math.sin(i * 9301 + seedOffset * 49297 + 233280) + 1) / 2) * (i + 1)
      ) %
      (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const SimpleMatchingQuiz: React.FC<SimpleMatchingQuizProps> = ({
  groups,
  activeIndicatorsByModule,
  placements,
  perilakuLengkap,
  onTogglePerilakuLengkap,
  onAssign,
  onRemovePlacement,
  onResetAll,
  onFinishQuiz,
}) => {
  const [activeModule, setActiveModule] = useState<ModuleKey>('praktik');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState<number>(1);
  const [draggedIndicatorId, setDraggedIndicatorId] = useState<string | null>(
    null
  );

  const modules: ModuleKey[] = ['praktik', 'perilaku', 'kompetensi'];
  const currentMeta = MODULE_METADATA[activeModule];

  const moduleGroups = useMemo(
    () => groups.filter((g) => g.section === activeModule),
    [groups, activeModule]
  );

  const moduleIndicators = activeIndicatorsByModule[activeModule];

  const unplacedIndicators = useMemo(() => {
    const unplaced = moduleIndicators.filter((ind) => !placements[ind.id]);
    return shuffleArray(unplaced, shuffleSeed + activeModule.length * 17);
  }, [moduleIndicators, placements, shuffleSeed, activeModule]);

  const totalPlacedAll = useMemo(() => {
    const allActive = [
      ...activeIndicatorsByModule.praktik,
      ...activeIndicatorsByModule.perilaku,
      ...activeIndicatorsByModule.kompetensi,
    ];
    const placed = allActive.filter((ind) => Boolean(placements[ind.id])).length;
    return { placed, total: allActive.length };
  }, [activeIndicatorsByModule, placements]);

  const handleSwitchModule = (mod: ModuleKey) => {
    setActiveModule(mod);
    setSelectedIndicatorId(null);
    setSelectedGroupId(null);
  };

  const handleBankCardClick = (indicatorId: string) => {
    if (selectedGroupId) {
      onAssign(indicatorId, selectedGroupId);
      setSelectedGroupId(null);
      setSelectedIndicatorId(null);
      return;
    }
    setSelectedIndicatorId((prev) =>
      prev === indicatorId ? null : indicatorId
    );
  };

  const handleGroupClick = (groupId: string) => {
    if (selectedIndicatorId) {
      onAssign(selectedIndicatorId, groupId);
      setSelectedIndicatorId(null);
      setSelectedGroupId(null);
      return;
    }
    setSelectedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  const nextModuleIndex = modules.indexOf(activeModule) + 1;
  const nextModule =
    nextModuleIndex < modules.length ? modules[nextModuleIndex] : null;

  return (
    <div className="space-y-6">
      {/* Top Section Tabs + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-fit">
          {modules.map((modKey) => {
            const meta = MODULE_METADATA[modKey];
            const list = activeIndicatorsByModule[modKey];
            const doneCount = list.filter((i) => Boolean(placements[i.id])).length;
            const isActive = activeModule === modKey;
            return (
              <button
                key={modKey}
                type="button"
                onClick={() => handleSwitchModule(modKey)}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[40px] tabular-nums ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {meta.number}. {meta.shortTitle} ({doneCount}/{list.length})
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeModule === 'perilaku' && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => onTogglePerilakuLengkap(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  !perilakuLengkap
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Soal
              </button>
              <button
                type="button"
                onClick={() => onTogglePerilakuLengkap(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  perilakuLengkap
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                21 Soal Lengkap
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShuffleSeed((s) => s + 1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Shuffle className="w-4 h-4 text-slate-500" />
            Acak Pilihan
          </button>

          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Reset
          </button>

          <button
            type="button"
            onClick={onFinishQuiz}
            disabled={totalPlacedAll.placed === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:opacity-45 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            Lihat Hasil ({totalPlacedAll.placed}/{totalPlacedAll.total})
          </button>
        </div>
      </div>

      {/* Section Title & Guide */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {currentMeta.number}. {currentMeta.title}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Klik kartu jawaban di sebelah kanan lalu klik kotak {currentMeta.leftColumnLabel.toLowerCase()} di sebelah kiri (atau seret dan lepas).
          </p>
        </div>
        {nextModule ? (
          <button
            type="button"
            onClick={() => handleSwitchModule(nextModule)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 whitespace-nowrap shrink-0"
          >
            Lanjut ke {MODULE_METADATA[nextModule].number}.{' '}
            {MODULE_METADATA[nextModule].shortTitle}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinishQuiz}
            disabled={totalPlacedAll.placed === 0}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 disabled:opacity-45 whitespace-nowrap shrink-0"
          >
            Selesai &amp; Lihat Hasil
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Two-Zone Matching Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Target Slots */}
        <div className="lg:col-span-7 space-y-3">
          {moduleGroups.map((group) => {
            const placedInGroup = moduleIndicators.filter(
              (ind) => placements[ind.id] === group.id
            );
            const expectedCount = moduleIndicators.filter(
              (ind) => ind.groupId === group.id
            ).length;
            const isGroupSelected = selectedGroupId === group.id;
            const canDrop = Boolean(selectedIndicatorId || draggedIndicatorId);

            return (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const indId =
                    e.dataTransfer.getData('text/plain') || draggedIndicatorId;
                  if (indId) {
                    onAssign(indId, group.id);
                    setDraggedIndicatorId(null);
                    setSelectedIndicatorId(null);
                    setSelectedGroupId(null);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGroupClick(group.id);
                  }
                }}
                className={`bg-white rounded-xl border p-4 transition-all cursor-pointer ${
                  isGroupSelected
                    ? 'border-blue-600 ring-2 ring-blue-100'
                    : canDrop
                    ? 'border-blue-300 hover:border-blue-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-5">
                    {group.superGroup && (
                      <p className="text-xs font-medium text-slate-500 mb-0.5">
                        {group.superGroup}
                      </p>
                    )}
                    <h3 className="text-base font-bold text-slate-900">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
                      {placedInGroup.length} / {expectedCount} jawaban
                    </p>
                  </div>

                  <div className="md:col-span-7 space-y-2">
                    {placedInGroup.length === 0 ? (
                      <div
                        className={`border border-dashed rounded-lg px-3.5 py-3.5 text-xs text-center transition-colors ${
                          canDrop
                            ? 'border-blue-400 bg-blue-50/40 text-blue-700 font-medium'
                            : 'border-slate-200 text-slate-400'
                        }`}
                      >
                        {canDrop
                          ? `Klik untuk pasangkan ke ${group.title}`
                          : `Belum ada jawaban · Butuh ${expectedCount}`}
                      </div>
                    ) : (
                      placedInGroup.map((ind) => (
                        <div
                          key={ind.id}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-start justify-between gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900"
                        >
                          <span className="font-medium leading-snug">
                            {ind.text}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemovePlacement(ind.id)}
                            aria-label={`Lepas ${ind.text}`}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded transition-colors shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Answer Bank */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pilihan Jawaban
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  {unplacedIndicators.length} pilihan tersisa
                </p>
              </div>
              {selectedIndicatorId && (
                <button
                  type="button"
                  onClick={() => setSelectedIndicatorId(null)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  Batal pilih
                </button>
              )}
            </div>

            {unplacedIndicators.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm font-semibold text-slate-900">
                  Semua soal di bagian ini sudah dipasangkan
                </p>
                {nextModule ? (
                  <button
                    type="button"
                    onClick={() => handleSwitchModule(nextModule)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Lanjut ke {MODULE_METADATA[nextModule].shortTitle}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onFinishQuiz}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Selesai &amp; Lihat Hasil
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-3 space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {unplacedIndicators.map((ind) => {
                  const isSelected = selectedIndicatorId === ind.id;
                  return (
                    <div
                      key={ind.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', ind.id);
                        setDraggedIndicatorId(ind.id);
                      }}
                      onDragEnd={() => setDraggedIndicatorId(null)}
                      onClick={() => handleBankCardClick(ind.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleBankCardClick(ind.id);
                        }
                      }}
                      className={`group rounded-lg border p-3.5 text-left transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-100'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-slate-900 leading-snug">
                          {ind.text}
                        </p>
                        <ArrowRight
                          className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${
                            isSelected
                              ? 'text-blue-700 translate-x-0.5'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
