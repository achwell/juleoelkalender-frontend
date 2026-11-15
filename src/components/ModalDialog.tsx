/* oxlint-disable jsx-a11y/no-noninteractive-element-interactions */
import H2 from "@/components/layout/H2";
import { FC, KeyboardEvent, PropsWithChildren, useEffect, useId, useRef } from "react";

interface Props extends PropsWithChildren {
  show: boolean;
  hide: () => void;
  title?: string;
}

const ModalDialog: FC<Props> = ({ show, hide, title, children }) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!show) {
      return;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [show]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      hide();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea, [tabindex]"),
    ).filter((element) => {
      if (element.tabIndex < 0 || element.matches(":disabled")) {
        return false;
      }
      let current: HTMLElement | null = element;
      while (current && current !== dialogRef.current) {
        const style = window.getComputedStyle(current);
        const disabledFieldset =
          current instanceof HTMLFieldSetElement &&
          current.disabled &&
          !Array.from(current.children)
            .find((child) => child instanceof HTMLLegendElement)
            ?.contains(element);
        if (
          disabledFieldset ||
          current.hidden ||
          current.inert ||
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.visibility === "collapse"
        ) {
          return false;
        }
        current = current.parentElement;
      }
      return true;
    });
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) {
      event.preventDefault();
      dialogRef.current.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    show && (
      <dialog
        open
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Dialog"}
        className="fixed inset-0 m-0 flex h-full w-full max-w-none items-center justify-center border-0 bg-black bg-opacity-50 p-0 z-50"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            hide();
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close dialog"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            onClick={hide}
          >
            ×
          </button>
          {title && <H2 id={titleId}>{title}</H2>}
          {children}
        </div>
      </dialog>
    )
  );
};

export default ModalDialog;
