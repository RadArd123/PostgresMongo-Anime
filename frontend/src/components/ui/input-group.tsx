import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Context ──────────────────────────────────────────────────────────────────
const InputGroupContext = React.createContext<{
  isFocused: boolean;
  setFocused: (v: boolean) => void;
}>({ isFocused: false, setFocused: () => {} });

// ─── InputGroup ───────────────────────────────────────────────────────────────
interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => {
    const [isFocused, setFocused] = React.useState(false);

    return (
      <InputGroupContext.Provider value={{ isFocused, setFocused }}>
        <div
          ref={ref}
          data-slot="input-group"
          className={cn(
            "relative flex w-full flex-col",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </InputGroupContext.Provider>
    );
  }
);
InputGroup.displayName = "InputGroup";

// ─── InputGroupInput ──────────────────────────────────────────────────────────
interface InputGroupInputProps extends React.ComponentProps<"input"> {}

const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, onFocus, onBlur, ...props }, ref) => {
    const { setFocused } = React.useContext(InputGroupContext);
    return (
      <Input
        ref={ref}
        data-slot="input-group-control"
        className={cn(
          "w-full bg-[#0D1117] border-[#30363d] text-white placeholder:text-gray-600",
          "focus-visible:border-blue-500 focus-visible:ring-blue-500/20",
          "rounded-xl h-11 px-4",
          "peer",
          className
        )}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        {...props}
      />
    );
  }
);
InputGroupInput.displayName = "InputGroupInput";

// ─── InputGroupTextarea ───────────────────────────────────────────────────────
interface InputGroupTextareaProps extends React.ComponentProps<"textarea"> {}

const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, InputGroupTextareaProps>(
  ({ className, onFocus, onBlur, ...props }, ref) => {
    const { setFocused } = React.useContext(InputGroupContext);
    return (
      <textarea
        ref={ref}
        data-slot="input-group-control"
        className={cn(
          "w-full bg-[#0D1117] border border-[#30363d] text-white placeholder:text-gray-600",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          "rounded-xl px-4 py-3 resize-none outline-none transition-all",
          "peer",
          className
        )}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        {...props}
      />
    );
  }
);
InputGroupTextarea.displayName = "InputGroupTextarea";

// ─── InputGroupAddon ──────────────────────────────────────────────────────────
type AddonAlign = "inline-start" | "inline-end" | "block-start" | "block-end";

interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: AddonAlign;
}

const alignStyles: Record<AddonAlign, string> = {
  "inline-start": "absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none",
  "inline-end":   "absolute right-0 inset-y-0 flex items-center pr-3",
  "block-start":  "w-full flex items-center mb-1",
  "block-end":    "w-full flex items-center mt-2",
};

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", children, ...props }, ref) => {
    const { isFocused } = React.useContext(InputGroupContext);
    return (
      <div
        ref={ref}
        data-slot="input-group-addon"
        data-align={align}
        className={cn(
          alignStyles[align],
          "text-gray-500 transition-colors",
          isFocused && "text-blue-400",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputGroupAddon.displayName = "InputGroupAddon";

// ─── InputGroupButton ─────────────────────────────────────────────────────────
interface InputGroupButtonProps extends React.ComponentProps<typeof Button> {}

const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, variant = "ghost", size = "sm", ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("h-7 text-xs text-gray-400 hover:text-white", className)}
      {...props}
    />
  )
);
InputGroupButton.displayName = "InputGroupButton";

// ─── InputGroupText ───────────────────────────────────────────────────────────
interface InputGroupTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

const InputGroupText = React.forwardRef<HTMLSpanElement, InputGroupTextProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-xs text-gray-500 px-1", className)}
      {...props}
    />
  )
);
InputGroupText.displayName = "InputGroupText";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
