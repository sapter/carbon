import { HStack } from "@carbon/react";
import { New } from "~/components";
import { TableFilters } from "~/components/Layout";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const CurrenciesTableFilters = () => {
  const [params] = useUrlParams();
  const permissions = usePermissions();

  return (
    <TableFilters>
      <HStack>
        <DebouncedInput param="name" size="sm" placeholder="Search" />
      </HStack>
      <HStack>
        {permissions.can("create", "accounting") && (
          <New label="Currency" to={`new?${params.toString()}`} />
        )}
      </HStack>
    </TableFilters>
  );
};

export default CurrenciesTableFilters;
