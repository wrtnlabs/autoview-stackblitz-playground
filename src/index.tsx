import { renderComponent } from "@autoview/ui";
import ShoppingApi from "@samchon/shopping-api";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import typia from "typia";

import { YourSchema } from "./YourSchema";
import { transformPage } from "./transformPage";
import { transformSale } from "./transformSale";
import { transformYourSchema } from "./transformYourSchema";

function AutoViewComponent() {
  useEffect(() => {
    const execute = async () => {
      // AUTHENTICATION
      const connection: ShoppingApi.IConnection = {
        host: "https://shopping-be.wrtn.ai",
      };
      await ShoppingApi.functional.shoppings.customers.authenticate.create(
        connection,
        {
          channel_code: "samchon",
          external_user: null,
          href: window.location.href,
          referrer: window.document.referrer,
        },
      );

      // GET LIST OF SUMMARIZED SALES
      const page: IPage<IShoppingSale.ISummary> =
        await ShoppingApi.functional.shoppings.customers.sales.index(
          connection,
          {
            page: 1,
            limit: 10,
          },
        );
      setPage(page);

      // GET SALE DETAIL
      const sale: IShoppingSale =
        await ShoppingApi.functional.shoppings.customers.sales.at(
          connection,
          page.data[1].id,
        );
      setSale(sale);
    };
    execute().catch(console.error);
  }, []);

  // WAIT FOR LOADING
  const [page, setPage] = useState<IPage<IShoppingSale.ISummary> | null>(null);
  const [sale, setSale] = useState<IShoppingSale | null>(null);
  if (page === null || sale === null) return <div>Loading...</div>;

  // RENDER
  return (
    <>
      <Section title="From TypeScript Type">
        <hr />
        <div className="mt-8">
          {renderComponent(
            transformYourSchema(YourSchema.value ?? typia.random<YourSchema>()),
          )}
        </div>
      </Section>
      <Section title="PATCH /shoppings/customers/sales">
        <hr />
        <div className="mt-8">{renderComponent(transformPage(page))}</div>
      </Section>
      <Section title="GET /shoppings/customers/sales/${id}">
        <hr />
        <div className="mt-8">{renderComponent(transformSale(sale))}</div>
      </Section>
    </>
  );
}

function Application() {
  return (
    <div className="max-w-[512px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center">AutoView Playground</h1>
      <AutoViewComponent />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-center">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-200 px-1 py-0.5 rounded-md font-bold">
      {children}
    </code>
  );
}

const root: HTMLElement = window.document.getElementById("root")!;
createRoot(root).render(<Application />);
