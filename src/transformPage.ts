import type * as IAutoView from "@autoview/interface";
import typia, { tags } from "typia";

namespace IPageIShoppingSale {
  export type ISummary = {
    pagination: IPage.IPagination;
    data: IShoppingSale.ISummary[];
  };
}
namespace IPage {
  export type IPagination = {
    current: number & tags.Type<"int32">;
    limit: number & tags.Type<"int32">;
    records: number & tags.Type<"int32">;
    pages: number & tags.Type<"int32">;
  };
}
namespace IShoppingSale {
  export type ISummary = {
    section: IShoppingSection;
    seller: IShoppingSeller.ISummary;
    price_range: IShoppingSalePriceRange;
    id: string & tags.Format<"uuid">;
    snapshot_id: string & tags.Format<"uuid">;
    latest: boolean;
    content: IShoppingSaleContent.IInvert;
    categories: IShoppingChannelCategory.IInvert[];
    tags: string[];
    units: IShoppingSaleUnit.ISummary[] & tags.MinItems<1>;
    created_at: string & tags.Format<"date-time">;
    updated_at: string & tags.Format<"date-time">;
    paused_at: null | (string & tags.Format<"date-time">);
    suspended_at: null | (string & tags.Format<"date-time">);
    opened_at: null | (string & tags.Format<"date-time">);
    closed_at: null | (string & tags.Format<"date-time">);
  };
}
type IShoppingSection = {
  id: string & tags.Format<"uuid">;
  code: string;
  name: string;
  created_at: string & tags.Format<"date-time">;
};
namespace IShoppingSeller {
  export type ISummary = {
    type: "seller";
    member: IShoppingMember.IInvert;
    citizen: IShoppingCitizen;
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
  };
}
namespace IShoppingMember {
  export type IInvert = {
    id: string & tags.Format<"uuid">;
    nickname: string;
    emails: IShoppingMemberEmail[];
    created_at: string & tags.Format<"date-time">;
  };
}
type IShoppingMemberEmail = {
  id: string & tags.Format<"uuid">;
  value: string & tags.Format<"email">;
  created_at: string & tags.Format<"date-time">;
};
type IShoppingCitizen = {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
  mobile: string &
    tags.Pattern<"^[0-9]*$"> &
    tags.JsonSchemaPlugin<{
      "x-wrtn-payment-order-mobile": true;
    }>;
  name: string &
    tags.JsonSchemaPlugin<{
      "x-wrtn-payment-order-citizen": true;
    }>;
};
type IShoppingSalePriceRange = {
  lowest: IShoppingPrice;
  highest: IShoppingPrice;
};
type IShoppingPrice = {
  nominal: number & tags.Minimum<0>;
  real: number & tags.Minimum<0>;
};
namespace IShoppingSaleContent {
  export type IInvert = {
    id: string & tags.Format<"uuid">;
    title: string;
    thumbnails: IAttachmentFile[];
  };
}
type IAttachmentFile = {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
  name: string & tags.MaxLength<255>;
  extension: null | (string & tags.MinLength<1> & tags.MaxLength<8>);
  url: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
};
namespace IShoppingChannelCategory {
  export type IInvert = {
    parent: null | IShoppingChannelCategory.IInvert;
    id: string & tags.Format<"uuid">;
    code: string;
    parent_id: null | (string & tags.Format<"uuid">);
    name: string;
    created_at: string & tags.Format<"date-time">;
  };
}
namespace IShoppingSaleUnit {
  export type ISummary = {
    price_range: IShoppingSalePriceRange;
    id: string & tags.Format<"uuid">;
    name: string;
    primary: boolean;
    required: boolean;
  };
}
type IAutoViewTransformerInputType = IPageIShoppingSale.ISummary;
export function transformPage(
  $input: unknown,
): IAutoView.IAutoViewComponentProps {
  typia.assertGuard<IAutoViewTransformerInputType>($input);
  return visualizeData($input);
}

function visualizeData(
  input: IAutoViewTransformerInputType,
): IAutoView.IAutoViewComponentProps {
  // Helper function to format date strings, returns "N/A" if null or empty.
  function formatDate(date: string | null): string {
    if (!date) return "N/A";
    // Use JavaScript's Date object for formatting; adjust as needed for human-friendly display.
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } catch {
      return "N/A";
    }
  }

  // Build the header component using a ListSubheader that includes pagination details.
  const paginationHeader: IAutoView.IAutoViewComponentProps = {
    type: "ListSubheader",
    stickToTop: true,
    childrenProps: {
      type: "Text",
      variant: "subtitle1",
      // Construct pagination display string.
      content: `Page ${input.pagination.current} of ${input.pagination.pages} (Total records: ${input.pagination.records})`,
    },
  } as IAutoView.IAutoViewComponentProps;

  // Map each sale summary record to a ListItem component.
  const saleItems: IAutoView.IAutoViewComponentProps[] = input.data.map(
    (sale) => {
      // Determine if there is at least one thumbnail available.
      const thumbnail =
        sale.content.thumbnails && sale.content.thumbnails.length > 0
          ? ({
              type: "Image",
              src: sale.content.thumbnails[0].url,
              alt: sale.content.title,
            } as IAutoView.IAutoViewImageProps)
          : undefined;

      // Compose a description string with section, seller, price and opened date information.
      const descriptionText = `Section: ${sale.section.name} | Seller: ${sale.seller.member.nickname} | Price from ${sale.price_range.lowest.real} to ${sale.price_range.highest.real} | Opened at: ${formatDate(sale.opened_at)}`;

      // Return a ListItem component.
      return {
        type: "ListItem",
        title: sale.content.title,
        description: descriptionText,
        startElement: thumbnail,
      } as IAutoView.IAutoViewComponentProps;
    },
  );

  // Construct the overall list container that includes the header and the list of sale items.
  const outputComponent: IAutoView.IAutoViewComponentProps = {
    type: "List",
    childrenProps: [
      // Header subcomponent.
      paginationHeader,
      // Spread all sale items.
      ...saleItems,
    ],
  } as IAutoView.IAutoViewComponentProps;

  return outputComponent;
}
