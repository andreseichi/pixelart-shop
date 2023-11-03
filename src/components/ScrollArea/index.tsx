import * as ScrollAreaRUI from "@radix-ui/react-scroll-area";

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaRUI.Root> {
  className?: string;
  children: React.ReactNode;
}

interface ScrollAreaViewportProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaRUI.Viewport> {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const ScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaViewportProps) => {
  return (
    <ScrollAreaRUI.ScrollAreaScrollbar
      orientation={orientation}
      className="flex h-full w-[8px] touch-none select-none border-l border-l-transparent p-[1px] transition-colors"
      {...props}
    >
      <ScrollAreaRUI.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-400 " />
    </ScrollAreaRUI.ScrollAreaScrollbar>
  );
};

const ScrollArea = ({ className, children, ...props }: ScrollAreaProps) => {
  return (
    <ScrollAreaRUI.Root
      className="relative h-[580px] overflow-hidden"
      {...props}
    >
      <ScrollAreaRUI.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaRUI.Viewport>
      <ScrollBar />
      <ScrollAreaRUI.Corner />
    </ScrollAreaRUI.Root>
  );
};

export { ScrollArea, ScrollBar };
