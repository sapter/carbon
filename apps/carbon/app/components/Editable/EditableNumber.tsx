/* eslint-disable react/display-name */
import { Input, NumberField } from "@carbon/react";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type { FocusEvent, KeyboardEvent } from "react";
import type { EditableTableCellComponentProps } from "~/components/Editable";

const EditableNumber =
  <T extends object>(
    mutation: (
      accessorKey: string,
      newValue: string,
      row: T
    ) => Promise<PostgrestSingleResponse<unknown>>
  ) =>
  ({
    value,
    row,
    accessorKey,
    onError,
    onUpdate,
  }: EditableTableCellComponentProps<T>) => {
    const updateNumber = async (newValue: string) => {
      const numberValue = Number(newValue);
      // this is the optimistic update on the FE
      onUpdate({ [accessorKey]: numberValue });

      // the is the actual update on the BE
      // @ts-ignore
      mutation(accessorKey, numberValue, row)
        .then(({ error }) => {
          if (error) {
            onError();
            onUpdate({ [accessorKey]: value });
          }
        })
        .catch(() => {
          onError();
          onUpdate({ [accessorKey]: value });
        });
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      // only run the update if they click enter
      if (event.key === "Enter" || event.key === "Tab") {
        if (event.currentTarget.value !== value) {
          updateNumber(event.currentTarget.value);
        }
      }
    };

    // run update if focus is lost
    const onBlur = (event: FocusEvent<HTMLInputElement>) => {
      if (event.currentTarget.value !== value) {
        updateNumber(event.currentTarget.value);
      }
    };

    return (
      <NumberField defaultValue={value as number}>
        <Input
          size="sm"
          className="w-full rounded-none"
          autoFocus
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      </NumberField>
    );
  };

export default EditableNumber;
