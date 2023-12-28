import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  SequencesTable,
  SequencesTableFilters,
  getSequences,
} from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: "Sequences",
  to: path.to.sequences,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "settings",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  return json(await getSequences(client, { name, limit, offset, sorts }));
}

export default function SequencesRoute() {
  const { data, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <SequencesTableFilters />
      <SequencesTable data={data ?? []} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
