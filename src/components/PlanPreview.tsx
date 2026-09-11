import { preview } from '../content/copy';
import { formatDisplayDate } from '../lib/date';
import type { Plan } from '../types';

const filled = (value: string) => value.trim().length > 0;

interface PlanPreviewProps {
  plan: Plan;
  /** The mobile disclosure already carries the title in its summary. */
  showTitle?: boolean;
}

/** Compact live summary of what the person has entered so far. */
export function PlanPreview({ plan, showTitle = true }: PlanPreviewProps) {
  const named = plan.priorities.filter((priority) => filled(priority.name));
  const hasAnything =
    named.length > 0 ||
    filled(plan.signs) ||
    filled(plan.settingAside) ||
    filled(plan.reviewDate);

  return (
    <div className="preview">
      {showTitle ? <h2 className="preview__title">{preview.title}</h2> : null}

      {!hasAnything ? <p className="preview__empty">{preview.empty}</p> : null}

      {named.length > 0 ? (
        <div className="preview__section">
          <ul className="preview__list">
            {named.map((priority) => (
              <li key={priority.id}>
                <p className="preview__item-name">{priority.name}</p>
                {priority.paused ? (
                  <p className="preview__item-detail">{preview.pausedLabel}</p>
                ) : (
                  <>
                    {filled(priority.minimumVersion) ? (
                      <p className="preview__item-detail">{priority.minimumVersion}</p>
                    ) : null}
                    {filled(priority.frequency) ? (
                      <p className="preview__item-detail">{priority.frequency}</p>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {filled(plan.signs) ? (
        <div className="preview__section">
          <p className="preview__section-label">{preview.signsLabel}</p>
          <p className="preview__item-detail plan__free-text">{plan.signs}</p>
        </div>
      ) : null}

      {filled(plan.settingAside) ? (
        <div className="preview__section">
          <p className="preview__section-label">{preview.settingAsideLabel}</p>
          <p className="preview__item-detail plan__free-text">{plan.settingAside}</p>
        </div>
      ) : null}

      {filled(plan.reviewDate) ? (
        <div className="preview__section">
          <p className="preview__section-label">{preview.reviewLabel}</p>
          <p className="preview__item-detail">{formatDisplayDate(plan.reviewDate)}</p>
        </div>
      ) : null}
    </div>
  );
}

/** Mobile presentation of the same summary, as an expandable section. */
export function PlanPreviewDisclosure({ plan }: { plan: Plan }) {
  return (
    <details className="disclosure preview-mobile no-print">
      <summary className="disclosure__summary">{preview.mobileSummary}</summary>
      <div className="disclosure__body">
        <PlanPreview plan={plan} showTitle={false} />
      </div>
    </details>
  );
}
