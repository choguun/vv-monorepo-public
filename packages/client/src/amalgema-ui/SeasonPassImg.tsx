import { twMerge } from "tailwind-merge";

export function SeasonPassImg({
  colored = true,
  className,
}: {
  colored?: boolean;
  className?: string;
}) {
  const imgName = colored ? "starter-pack" : "starter-pack";

  return (
    <img
      src={`./assets/${imgName}.png`}
      alt="Season Pass"
      className={twMerge(
        `lightgray -2.259px -15.671px / 106.667% 150.588% no-repeat] bg-[url(./assets/${imgName}.png)`,
        className
      )}
    />
  );
}
