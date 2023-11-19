import classNames from "classnames";

interface Props {
  style: string;
  open: boolean;
  setStyle: (style: string) => void;
  list_styles: { name: string; negative_prompt: string; prompt: string }[];
}
export const Settings: React.FC<Props> = ({
  open,
  style,
  setStyle,
  list_styles,
}) => {
  return (
    <div
      className={classNames(
        "lg:justify-start overflow-hidden transition-all duration-1000 w-full",
        {
          "max-h-[300px]": open,
          "max-h-0": !open,
        }
      )}
    >
      <div className="gap-2 flex items-center justify-start mt-6 flex-wrap w-full">
        {list_styles.map((stl) => (
          <div
            key={stl.name}
            className={classNames(
              "rounded-full border-2 border-white text-xs lg:text-sm px-4 py-2 font-semibold text-white cursor-pointer",
              {
                "bg-white !text-gray-900": stl.name === style,
              }
            )}
            onClick={() => setStyle(stl.name)}
          >
            {stl.name}
          </div>
        ))}
      </div>
    </div>
  );
};
