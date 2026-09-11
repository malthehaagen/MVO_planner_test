import { useRef, useState } from 'react';
import { backup as backupCopy } from '../content/copy';
import { parseBackup } from '../lib/backup';
import { ConfirmDialog } from './ui/ConfirmDialog';
import type { StoredDraft } from '../types';

const filled = (value: string) => value.trim().length > 0;

interface RestoreBackupProps {
  onRestore: (draft: StoredDraft) => void;
  buttonClassName?: string;
}

/**
 * Reads a backup file, validates it, and asks for confirmation before
 * anything currently in the browser is replaced. An invalid file changes
 * nothing.
 */
export function RestoreBackup({
  onRestore,
  buttonClassName = 'button button--secondary',
}: RestoreBackupProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<StoredDraft | null>(null);

  const handleFile = async (file: File) => {
    let text = '';
    try {
      text = await file.text();
    } catch {
      setError(backupCopy.invalidFile);
      return;
    }
    const result = parseBackup(text);
    if (!result.ok) {
      setError(
        result.reason === 'unsupported-version'
          ? backupCopy.unsupportedVersion
          : backupCopy.invalidFile,
      );
      return;
    }
    setError('');
    setPending(result.draft);
  };

  const count = pending
    ? pending.plan.priorities.filter((priority) => filled(priority.name)).length
    : 0;

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => inputRef.current?.click()}
      >
        {backupCopy.restoreAction}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        aria-label={backupCopy.chooseFile}
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset so choosing the same file twice still fires a change event.
          event.target.value = '';
          if (file) void handleFile(file);
        }}
      />
      {error ? (
        <p className="status status--error no-print" role="alert">
          {error}
        </p>
      ) : null}
      {pending ? (
        <ConfirmDialog
          title={backupCopy.confirmTitle}
          body={backupCopy.confirmBody(count)}
          confirmLabel={backupCopy.confirmAction}
          cancelLabel={backupCopy.cancelAction}
          onConfirm={() => {
            const draft = pending;
            setPending(null);
            onRestore(draft);
          }}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </>
  );
}
