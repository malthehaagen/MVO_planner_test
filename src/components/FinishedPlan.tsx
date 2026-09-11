import { useState } from 'react';
import { backup as backupCopy, plan as planCopy } from '../content/copy';
import { formatDisplayDate } from '../lib/date';
import { planToText } from '../lib/planText';
import { copyText } from '../lib/clipboard';
import { downloadBackup } from '../lib/backup';
import { RestoreBackup } from './RestoreBackup';
import type { Plan, StoredDraft } from '../types';

const filled = (value: string) => value.trim().length > 0;

interface FinishedPlanProps {
  plan: Plan;
  draft: StoredDraft;
  onEdit: () => void;
  onRestart: () => void;
  onRestore: (draft: StoredDraft) => void;
  saveWarning?: string;
}

type Status = { tone: 'ok' | 'error'; message: string } | null;

export function FinishedPlan({
  plan,
  draft,
  onEdit,
  onRestart,
  onRestore,
  saveWarning,
}: FinishedPlanProps) {
  const [status, setStatus] = useState<Status>(null);

  const active = plan.priorities.filter((p) => filled(p.name) && !p.paused);
  const paused = plan.priorities.filter((p) => filled(p.name) && p.paused);

  const handleCopy = async () => {
    const copied = await copyText(planToText(plan));
    setStatus(
      copied
        ? { tone: 'ok', message: planCopy.copySuccess }
        : { tone: 'error', message: planCopy.copyFailure },
    );
  };

  const handleDownload = () => {
    const ok = downloadBackup(draft);
    setStatus(
      ok
        ? { tone: 'ok', message: planCopy.downloadSuccess }
        : { tone: 'error', message: planCopy.downloadFailure },
    );
  };

  return (
    <div className="plan">
      <header className="plan__header">
        <h1 className="display">{planCopy.title}</h1>
        <hr className="plan__rule" />
      </header>

      {saveWarning ? (
        <p className="note note--warning no-print" role="status">
          {saveWarning}
        </p>
      ) : null}

      {plan.timing ? (
        <section className="plan__section">
          <h2 className="plan__section-title">{planCopy.timingLabel}</h2>
          <p>{plan.timing === 'now' ? planCopy.timingNow : planCopy.timingFuture}</p>
        </section>
      ) : null}

      {filled(plan.signs) ? (
        <section className="plan__section">
          <h2 className="plan__section-title">{planCopy.signsLabel}</h2>
          <p className="plan__free-text">{plan.signs}</p>
        </section>
      ) : null}

      {active.length > 0 ? (
        <section className="plan__section">
          <h2 className="plan__section-title">{planCopy.prioritiesLabel}</h2>
          <ul className="plan__priorities">
            {active.map((priority) => (
              <li className="card plan__priority" key={priority.id}>
                <div className="plan__priority-head">
                  <h3 className="plan__priority-name">{priority.name}</h3>
                </div>
                {filled(priority.reason) ? (
                  <p className="plan__reason plan__free-text">{priority.reason}</p>
                ) : null}
                <dl className="detail-list">
                  {filled(priority.usualCommitment) ? (
                    <>
                      <dt>{planCopy.usualLabel}</dt>
                      <dd className="plan__free-text">{priority.usualCommitment}</dd>
                    </>
                  ) : null}
                  {filled(priority.minimumVersion) ? (
                    <>
                      <dt>{planCopy.minimumLabel}</dt>
                      <dd className="plan__free-text">{priority.minimumVersion}</dd>
                    </>
                  ) : null}
                  {filled(priority.frequency) ? (
                    <>
                      <dt>{planCopy.frequencyLabel}</dt>
                      <dd className="plan__free-text">{priority.frequency}</dd>
                    </>
                  ) : null}
                  {filled(priority.timing) ? (
                    <>
                      <dt>{planCopy.timingFieldLabel}</dt>
                      <dd className="plan__free-text">{priority.timing}</dd>
                    </>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {paused.length > 0 ? (
        <section className="plan__section">
          <h2 className="plan__section-title">{planCopy.pausedLabel}</h2>
          <ul className="plan__priorities">
            {paused.map((priority) => (
              <li className="card plan__priority" key={priority.id}>
                <div className="plan__priority-head">
                  <h3 className="plan__priority-name">{priority.name}</h3>
                </div>
                {filled(priority.reason) ? (
                  <p className="plan__reason plan__free-text">{priority.reason}</p>
                ) : null}
                {filled(priority.pauseReconsider) ? (
                  <dl className="detail-list">
                    <dt>{planCopy.pauseReconsiderLabel}</dt>
                    <dd className="plan__free-text">{priority.pauseReconsider}</dd>
                  </dl>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {filled(plan.settingAside) ? (
        <section className="plan__section">
          <h2 className="plan__section-title">{planCopy.settingAsideLabel}</h2>
          <p className="plan__free-text">{plan.settingAside}</p>
        </section>
      ) : null}

      <section className="plan__section">
        <h2 className="plan__section-title">{planCopy.reviewSectionLabel}</h2>
        <dl className="detail-list">
          {filled(plan.reviewDate) ? (
            <>
              <dt>{planCopy.reviewLabel}</dt>
              <dd>{formatDisplayDate(plan.reviewDate)}</dd>
            </>
          ) : null}
          {filled(plan.capacitySigns) ? (
            <>
              <dt>{planCopy.capacityLabel}</dt>
              <dd className="plan__free-text">{plan.capacitySigns}</dd>
            </>
          ) : null}
          {filled(plan.firstStepBack) ? (
            <>
              <dt>{planCopy.firstStepLabel}</dt>
              <dd className="plan__free-text">{plan.firstStepBack}</dd>
            </>
          ) : null}
        </dl>
      </section>

      <p className="plan__closing">{planCopy.closing}</p>

      <div className="plan__actions no-print">
        <button type="button" className="button button--secondary" onClick={onEdit}>
          {planCopy.actions.edit}
        </button>
        <button type="button" className="button button--primary" onClick={handleCopy}>
          {planCopy.actions.copy}
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => window.print()}
        >
          {planCopy.actions.print}
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={handleDownload}
        >
          {planCopy.actions.download}
        </button>
        <RestoreBackup onRestore={onRestore} />
        <button type="button" className="button button--danger-quiet" onClick={onRestart}>
          {planCopy.actions.restart}
        </button>
      </div>

      <p className="muted no-print" style={{ marginTop: 'var(--space-3)' }}>
        {backupCopy.restoreHint}
      </p>

      <p
        className={
          status?.tone === 'error'
            ? 'status status--error no-print'
            : 'status no-print'
        }
        role="status"
        aria-live="polite"
      >
        {status?.message ?? ''}
      </p>

      <p className="muted no-print" style={{ marginTop: 'var(--space-5)' }}>
        {planCopy.savedNote}
      </p>

    </div>
  );
}
