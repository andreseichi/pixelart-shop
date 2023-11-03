import { roboto } from "@/pages/_app";
import * as DialogRUI from "@radix-ui/react-dialog";
import React from "react";

const Dialog = DialogRUI.Root;

const DialogTrigger = DialogRUI.Trigger;

import X from "@/assets/x.svg";
import Image from "next/image";

const DialogPortal = ({ children, ...props }: DialogRUI.DialogPortalProps) => {
  return (
    <DialogRUI.Portal {...props}>
      <div
        className={`fixed inset-0 z-50 flex items-start justify-center sm:items-center ${roboto.className}`}
      >
        {children}
      </div>
    </DialogRUI.Portal>
  );
};

const DialogOverlay = ({ ...props }: DialogRUI.DialogOverlayProps) => {
  return (
    <DialogRUI.Overlay
      className="fixed inset-0 z-50 transition-all duration-100"
      {...props}
    />
  );
};

const DialogContent = ({
  children,
  ...props
}: DialogRUI.DialogContentProps) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogRUI.Content
        className="fixed bottom-0 right-0 top-0 z-50 grid min-w-[420px] rounded-l-lg bg-zinc-800 p-12 sm:max-w-lg lg:max-w-full"
        {...props}
      >
        {children}
        <DialogRUI.Close className="absolute right-4 top-4 justify-center rounded-sm text-2xl font-bold opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-green-600 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800">
          <Image src={X} height={24} width={24} alt="X" />
          <span className="sr-only">Fechar</span>
        </DialogRUI.Close>
      </DialogRUI.Content>
    </DialogPortal>
  );
};

const DialogHeader = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex flex-col space-y-2 p-6 text-center sm:text-left"
      {...props}
    >
      {children}
    </div>
  );
};

const DialogFooter = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="mt-4 flex gap-2" {...props} />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogRUI.Title>,
  React.ComponentPropsWithoutRef<typeof DialogRUI.Title>
>(({ ...props }, ref) => (
  <DialogRUI.Title
    ref={ref}
    className="text-lg font-semibold text-slate-900"
    {...props}
  />
));
DialogTitle.displayName = DialogRUI.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogRUI.Description>,
  React.ComponentPropsWithoutRef<typeof DialogRUI.Description>
>(({ ...props }, ref) => (
  <DialogRUI.Description
    ref={ref}
    className="text-sm text-gray-600"
    {...props}
  />
));
DialogDescription.displayName = DialogRUI.Description.displayName;

const DialogClose = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & DialogRUI.DialogCloseProps) => (
  <DialogRUI.Close className={className} {...props} asChild>
    {children}
  </DialogRUI.Close>
);

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
