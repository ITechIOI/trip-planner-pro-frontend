import * as Dialog from "@radix-ui/react-dialog";
import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const Button = ({
  className = "",
  variant = "secondary",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`button button--${variant} ${className}`.trim()}
    />
  );
};

export const IconButton = ({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button {...props} className={`icon-button ${className}`.trim()} />;
};

export const Badge = ({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "success" | "warning" | "critical";
}) => {
  return <span className={`badge badge--${tone}`}>{children}</span>;
};

export const ProgressBar = ({
  value,
  tone = "info",
  label = "Progress",
}: {
  value?: number | null;
  tone?: "info" | "success" | "warning" | "critical";
  label?: string;
}) => {
  const safeValue = Math.max(0, Math.min(100, Math.round(value ?? 0)));

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <span
        className={`progress__bar progress__bar--${tone}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

export const StatCard = ({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "neutral" | "info" | "success" | "warning" | "critical";
}) => {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail ? <span>{detail}</span> : null}
    </article>
  );
};

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export const ErrorState = ({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) => {
  return (
    <div className="error-state" role="alert">
      <h3>{title}</h3>
      <p>{description ?? "Please retry when the connection is available."}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export const Skeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <div className="skeleton-stack" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, index) => (
        <span className="skeleton" key={index} />
      ))}
    </div>
  );
};

export const FieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return (
    <p className="field-error" role="alert">
      {message}
    </p>
  );
};

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="page-header__action">{action}</div> : null}
    </header>
  );
};

export const AppDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(open);

  useEffect(() => {
    if (open) {
      return;
    }

    const rememberTrigger = (event: MouseEvent) => {
      const target = event.target;

      if (
        !(target instanceof HTMLElement) ||
        target.closest('[role="dialog"]')
      ) {
        return;
      }

      restoreFocusRef.current = target.closest(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
    };

    document.addEventListener("click", rememberTrigger, true);

    return () => {
      document.removeEventListener("click", rememberTrigger, true);
    };
  }, [open]);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;

    if (open || !wasOpen) {
      return;
    }

    if (
      !restoreFocusRef.current ||
      !document.contains(restoreFocusRef.current) ||
      typeof window === "undefined"
    ) {
      return;
    }

    window.requestAnimationFrame(() => {
      restoreFocusRef.current?.focus();
    });
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-heading">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              {description ? (
                <Dialog.Description>{description}</Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close asChild>
              <IconButton type="button" aria-label="Close dialog">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const PaginationControls = ({
  offset,
  limit,
  total,
  disabled = false,
  onOffsetChange,
}: {
  offset?: number;
  limit?: number;
  total?: number;
  disabled?: boolean;
  onOffsetChange: (offset: number) => void;
}) => {
  const safeOffset = Math.max(0, offset ?? 0);
  const safeLimit = Math.max(1, limit ?? 1);
  const safeTotal = Math.max(0, total ?? 0);

  if (safeTotal <= safeLimit) {
    return null;
  }

  const start = safeOffset + 1;
  const end = Math.min(safeOffset + safeLimit, safeTotal);
  const previousOffset = Math.max(0, safeOffset - safeLimit);
  const nextOffset = safeOffset + safeLimit;

  return (
    <nav className="pagination-controls" aria-label="Pagination">
      <span className="pagination-controls__summary">
        Showing {start}-{end} of {safeTotal}
      </span>
      <div>
        <Button
          type="button"
          disabled={disabled || safeOffset === 0}
          onClick={() => onOffsetChange(previousOffset)}
        >
          Previous
        </Button>
        <Button
          type="button"
          disabled={disabled || nextOffset >= safeTotal}
          onClick={() => onOffsetChange(nextOffset)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
};
