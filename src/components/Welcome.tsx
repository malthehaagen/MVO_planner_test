import { storageNote, storageUnavailableNote, welcome } from '../content/copy';
import { RestoreBackup } from './RestoreBackup';
import type { StoredDraft } from '../types';

interface WelcomeProps {
  hasDraft: boolean;
  hasCompletedPlan: boolean;
  storageAvailable: boolean;
  onStart: () => void;
  onContinue: () => void;
  onViewPlan: () => void;
  onRequestRestart: () => void;
  onRestore: (draft: StoredDraft) => void;
}

export function Welcome({
  hasDraft,
  hasCompletedPlan,
  storageAvailable,
  onStart,
  onContinue,
  onViewPlan,
  onRequestRestart,
  onRestore,
}: WelcomeProps) {
  return (
    <div className="welcome stack-lg">
      <div>
        <hr className="welcome__rule" />
        <h1 className="display">{welcome.title}</h1>
        <p className="lead" style={{ marginTop: 'var(--space-4)' }}>
          {welcome.description}
        </p>
      </div>

      <p className="welcome__definition">{welcome.definition}</p>

      <p className={storageAvailable ? 'note' : 'note note--warning'}>
        {storageAvailable ? storageNote : storageUnavailableNote}
      </p>

      {hasDraft ? (
        <p className="muted">
          {hasCompletedPlan ? welcome.completedFound : welcome.draftFound}
        </p>
      ) : null}

      <div className="welcome__actions">
        {hasDraft ? (
          <>
            <button type="button" className="button button--primary" onClick={onContinue}>
              {welcome.continueAction}
            </button>
            {hasCompletedPlan ? (
              <button
                type="button"
                className="button button--secondary"
                onClick={onViewPlan}
              >
                {welcome.viewPlanAction}
              </button>
            ) : null}
            <button
              type="button"
              className="button button--quiet"
              onClick={onRequestRestart}
            >
              {welcome.restartAction}
            </button>
          </>
        ) : (
          <button type="button" className="button button--primary" onClick={onStart}>
            {welcome.primaryAction}
          </button>
        )}
        <RestoreBackup onRestore={onRestore} buttonClassName="button button--quiet" />
      </div>

      <details className="disclosure">
        <summary className="disclosure__summary">{welcome.disclosureSummary}</summary>
        <div className="disclosure__body">
          {welcome.disclosureBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </details>

    </div>
  );
}
