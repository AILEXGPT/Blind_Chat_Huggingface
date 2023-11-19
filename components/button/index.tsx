import classNames from "classnames";
import { MouseEvent } from "react";

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  theme?: "primary" | "secondary" | "white" | "danger" | "success";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export const Button: React.FC<Props> = ({
  children,
  disabled,
  theme = "primary",
  onClick,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "rounded-full px-4 py-1.5 lg:px-6 lg:py-2.5 text-sm lg:text-base font-semibold flex items-center justify-center gap-2.5 border-[2px] transition-all duration-200 max-w-max",
        {
          "bg-primary text-white border-primary": theme === "primary",
          "bg-white text-gray-900 border-white": theme === "white",
          "bg-red-500 text-white border-red-500": theme === "danger",
          "bg-green-500 text-white border-green-500": theme === "success",
          "!bg-gray-400 !text-gray-600 !cursor-not-allowed !border-gray-400":
            disabled,
        }
      )}
      {...props}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
              onClick(e);
            }
          : undefined
      }
    >
      {children}
    </button>
  );
};
