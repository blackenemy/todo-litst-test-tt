import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./dialog.module.css";
import type { DialogProps } from "./types";

const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  footer,
}: DialogProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    {trigger && (
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
    )}
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content className={styles.content}>
        <div className={styles.header}>
          <DialogPrimitive.Title className={styles.title}>
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close className={styles.closeButton}>
            <XMarkIcon className={styles.closeIcon} />
          </DialogPrimitive.Close>
        </div>
        {description && (
          <DialogPrimitive.Description className={styles.description}>
            {description}
          </DialogPrimitive.Description>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

export default Dialog;
