import { useMemo } from "react";
import type { PartReplenishmentSystem } from "~/modules/parts";
import { useParts } from "~/stores";
import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

type PartSelectProps = Omit<ComboboxProps, "options"> & {
  partReplenishmentSystem?: PartReplenishmentSystem;
};

const Part = ({ partReplenishmentSystem, ...props }: PartSelectProps) => {
  const [parts] = useParts();

  const options = useMemo(
    () =>
      parts
        .filter((part) => {
          if (partReplenishmentSystem === "Buy") {
            return part.replenishmentSystem === "Buy";
          } else if (partReplenishmentSystem === "Make") {
            return part.replenishmentSystem === "Make";
          } else {
            return true;
          }
        })
        .map((part) => ({
          value: part.id,
          label: `${part.id} - ${part.name}`,
        })) ?? [],
    [partReplenishmentSystem, parts]
  );

  return (
    <Combobox options={options} {...props} label={props?.label ?? "Part"} />
  );
};

Part.displayName = "Part";

export default Part;
