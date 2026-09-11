import { useCallback, useEffect, useRef, useState } from 'react';
import {
  brand,
  confirmRestart,
  saveFailedNote,
  storageUnavailableNote,
} from './content/copy';
import { createEmptyPlan, SCHEMA_VERSION, type Plan, type StoredDraft } from './types';
import { clearDraft, isStorageAvailable, loadDraft, saveDraft } from './lib/storage';
import { Welcome } from './components/Welcome';
import { Planner } from './components/Planner';
import { FinishedPlan } from './components/FinishedPlan';
import { ConfirmDialog } from './components/ui/ConfirmDialog';

type View = 'welcome' | 'planner' | 'plan';

function emptyDraft(): StoredDraft {
  return {
    version: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    step: 1,
    completed: false,
    plan: createEmptyPlan(),
  };
}

export function App() {
  const storageAvailable = useRef(isStorageAvailable()).current;
  const restored = useRef(storageAvailable ? loadDraft() : null).current;

  const [draft, setDraft] = useState<StoredDraft>(restored ?? emptyDraft());
  const [view, setView] = useState<View>('welcome');
  const [saveFailed, setSaveFailed] = useState(false);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [hasSavedWork, setHasSavedWork] = useState(restored !== null);
  const mainRef = useRef<HTMLElement>(null);

  // Autosave: every change to the draft is written back to browser storage.
  useEffect(() => {
    if (!storageAvailable) return;
    if (!hasSavedWork && view === 'welcome') return;
    const result = saveDraft(draft);
    setSaveFailed(result === 'failed');
  }, [draft, storageAvailable, hasSavedWork, view]);

  const updatePlan = useCallback((plan: Plan) => {
    setDraft((current) => ({ ...current, plan, savedAt: new Date().toISOString() }));
  }, []);

  const updateStep = useCallback((step: number) => {
    setDraft((current) => ({ ...current, step }));
  }, []);

  const startPlanner = () => {
    setHasSavedWork(true);
    setView('planner');
  };

  const continuePlanner = () => {
    setView(draft.completed ? 'plan' : 'planner');
  };

  const finishPlan = () => {
    setDraft((current) => ({ ...current, completed: true }));
    setView('plan');
  };

  const editPlan = () => {
    setDraft((current) => ({ ...current, completed: false, step: 1 }));
    setView('planner');
  };

  const restart = () => {
    clearDraft();
    setDraft(emptyDraft());
    setHasSavedWork(false);
    setSaveFailed(false);
    setConfirmingRestart(false);
    setView('welcome');
  };

  const restoreBackup = (incoming: StoredDraft) => {
    setDraft(incoming);
    setHasSavedWork(true);
    setView(incoming.completed ? 'plan' : 'planner');
  };

  // Focus the main region when the view changes, so keyboard users land in
  // the new screen rather than at the start of the document.
  useEffect(() => {
    mainRef.current?.focus();
  }, [view]);

  const saveWarning = !storageAvailable
    ? storageUnavailableNote
    : saveFailed
      ? saveFailedNote
      : undefined;

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {brand.skipLink}
      </a>

      <header className="site-header no-print">
        <div className="shell site-header__inner">
          <p className="wordmark">{brand.wordmark}</p>
          <p className="site-header__tag">{brand.headerTag}</p>
        </div>
      </header>

      <main className="main" id="main" ref={mainRef} tabIndex={-1}>
        <div className="shell">
          {view === 'welcome' ? (
            <Welcome
              hasDraft={hasSavedWork}
              hasCompletedPlan={draft.completed}
              storageAvailable={storageAvailable}
              onStart={startPlanner}
              onContinue={continuePlanner}
              onViewPlan={() => setView('plan')}
              onRequestRestart={() => setConfirmingRestart(true)}
              onRestore={restoreBackup}
            />
          ) : null}

          {view === 'planner' ? (
            <Planner
              plan={draft.plan}
              step={draft.step}
              onPlanChange={updatePlan}
              onStepChange={updateStep}
              onFinish={finishPlan}
              saveWarning={saveWarning}
            />
          ) : null}

          {view === 'plan' ? (
            <FinishedPlan
              plan={draft.plan}
              draft={draft}
              onEdit={editPlan}
              onRestart={() => setConfirmingRestart(true)}
              onRestore={restoreBackup}
              saveWarning={saveWarning}
            />
          ) : null}
        </div>
      </main>

      <footer className="site-footer no-print">
        <div className="shell">{brand.footer}</div>
      </footer>

      {confirmingRestart ? (
        <ConfirmDialog
          title={confirmRestart.title}
          body={confirmRestart.body}
          confirmLabel={confirmRestart.confirm}
          cancelLabel={confirmRestart.cancel}
          onConfirm={restart}
          onCancel={() => setConfirmingRestart(false)}
        />
      ) : null}
    </div>
  );
}
