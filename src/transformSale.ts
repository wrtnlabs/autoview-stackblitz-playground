import typia, { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
type IShoppingSale = {
    section: IShoppingSection;
    seller: IShoppingSeller.IInvert;
    id: string & tags.Format<"uuid">;
    snapshot_id: string & tags.Format<"uuid">;
    latest: boolean;
    content: IShoppingSaleContent;
    categories: IShoppingChannelCategory.IInvert[];
    tags: string[];
    units: IShoppingSaleUnit[] & tags.MinItems<1>;
    created_at: string & tags.Format<"date-time">;
    updated_at: string & tags.Format<"date-time">;
    paused_at: null | (string & tags.Format<"date-time">);
    suspended_at: null | (string & tags.Format<"date-time">);
    opened_at: null | (string & tags.Format<"date-time">);
    closed_at: null | (string & tags.Format<"date-time">);
};
type IShoppingSection = {
    id: string & tags.Format<"uuid">;
    code: string;
    name: string;
    created_at: string & tags.Format<"date-time">;
};
namespace IShoppingSeller {
    export type IInvert = {
        type: "seller";
        member: IShoppingMember.IInvert;
        customer: IShoppingCustomer.IInvert;
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
namespace IShoppingCustomer {
    export type IInvert = {
        id: string & tags.Format<"uuid">;
        channel: IShoppingChannel;
        external_user: null | IShoppingExternalUser;
        href: string & tags.Format<"uri">;
        referrer: null | (string & tags.Format<"uri">) | (string & tags.MaxLength<0>);
        ip: (string & tags.Format<"ipv4">) | (string & tags.Format<"ipv6">);
        created_at: string & tags.Format<"date-time">;
    };
}
type IShoppingChannel = {
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
    code: string;
    name: string;
};
type IShoppingExternalUser = {
    id: string & tags.Format<"uuid">;
    citizen: null | IShoppingCitizen;
    created_at: string & tags.Format<"date-time">;
    uid: string;
    application: string;
    nickname: string;
    data: any;
};
type IShoppingCitizen = {
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
    mobile: string & tags.Pattern<"^[0-9]*$"> & tags.JsonSchemaPlugin<{
        "x-wrtn-payment-order-mobile": true
    }>;
    name: string & tags.JsonSchemaPlugin<{
        "x-wrtn-payment-order-citizen": true
    }>;
};
type IShoppingSaleContent = {
    id: string & tags.Format<"uuid">;
    title: string;
    format: "html" | "md" | "txt";
    body: string;
    files: IAttachmentFile[];
    thumbnails: IAttachmentFile[];
};
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
type IShoppingSaleUnit = {
    options: (IShoppingSaleUnitDescriptiveOption | IShoppingSaleUnitSelectableOption)[];
    stocks: IShoppingSaleUnitStock[] & tags.MinItems<1>;
    id: string & tags.Format<"uuid">;
    name: string;
    primary: boolean;
    required: boolean;
};
type IShoppingSaleUnitDescriptiveOption = {
    id: string & tags.Format<"uuid">;
    type: "string" | "number" | "boolean";
    name: string;
};
type IShoppingSaleUnitSelectableOption = {
    candidates: IShoppingSaleUnitOptionCandidate[] & tags.MinItems<1>;
    id: string & tags.Format<"uuid">;
    type: "select";
    name: string;
    variable: boolean;
};
type IShoppingSaleUnitOptionCandidate = {
    id: string & tags.Format<"uuid">;
    name: string;
};
type IShoppingSaleUnitStock = {
    id: string & tags.Format<"uuid">;
    name: string;
    price: IShoppingPrice;
    inventory: IShoppingSaleUnitStockInventory;
    choices: IShoppingSaleUnitStockChoice[];
};
type IShoppingPrice = {
    nominal: number & tags.Minimum<0>;
    real: number & tags.Minimum<0>;
};
type IShoppingSaleUnitStockInventory = {
    income: number & tags.Type<"int32">;
    outcome: number & tags.Type<"int32">;
};
type IShoppingSaleUnitStockChoice = {
    id: string & tags.Format<"uuid">;
    option_id: string & tags.Format<"uuid">;
    candidate_id: string & tags.Format<"uuid">;
};
type IAutoViewTransformerInputType = IShoppingSale;
export function transformSale($input: unknown): IAutoView.IAutoViewComponentProps {
    typia.assertGuard<IAutoViewTransformerInputType>($input);
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    // Helper to format ISO date strings into a local readable format.
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (error) {
            return dateString;
        }
    };

    // Destructure and extract relevant fields from the input sale object
    const {
        id,
        latest,
        section,
        seller,
        content,
        categories,
        tags,
        created_at
    } = input;

    // Create Card Header using IAutoViewCardHeaderProps
    const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
        type: "CardHeader",
        title: content.title,
        description: `Sale ID: ${id}${latest ? " - Latest" : ""}`,
        // Construct a badge to highlight latest status.
        startElement: {
            type: "Badge",
            // count is arbitrarily set to 1 when latest is true, else 0.
            count: latest ? 1 : 0,
            // Use "success" if latest, else "gray"
            color: latest ? "success" : "gray",
            // The badge wraps an icon, for simplicity using a check icon.
            childrenProps: {
                type: "Icon",
                id: "check",
                // default size
                size: 16
            }
        }
    };

    // Build DataList Components for seller, section and created_at
    const dataListItems: IAutoView.IAutoViewDataListItemProps[] = [
        {
            type: "DataListItem",
            label: {
                type: "Text",
                content: "Seller",
                // using default variant
            },
            value: {
                type: "Text",
                content: (seller && seller.member && seller.member.nickname) || ""
            }
        },
        {
            type: "DataListItem",
            label: {
                type: "Text",
                content: "Section"
            },
            value: {
                type: "Text",
                content: section.name
            }
        },
        {
            type: "DataListItem",
            label: {
                type: "Text",
                content: "Created At"
            },
            value: {
                type: "Text",
                content: formatDate(created_at)
            }
        }
    ];

    // Map categories array to chips (color primary)
    const categoryChips: IAutoView.IAutoViewChipProps[] = (categories || []).map(cat => ({
        type: "Chip",
        label: cat.name,
        color: "primary"
    }));

    // Map tags array to chips (color secondary)
    const tagChips: IAutoView.IAutoViewChipProps[] = (tags || []).map(tag => ({
        type: "Chip",
        label: tag,
        color: "secondary"
    }));

    // Build Card Content using IAutoViewCardContentProps
    const cardContentChildren: IAutoView.IAutoViewPresentationComponentProps[] = [];

    // Add markdown for content body
    cardContentChildren.push({
        type: "Markdown",
        content: content.body
    });

    // If thumbnails are available, add the first as an image
    if (content.thumbnails && content.thumbnails.length > 0) {
        cardContentChildren.push({
            type: "Image",
            src: content.thumbnails[0].url,
            alt: content.title
        });
    }

    // Add DataList with seller, section and created_at
    cardContentChildren.push({
        type: "DataList",
        childrenProps: dataListItems
    });

    // Add chip group for categories if any exists
    if (categoryChips.length > 0) {
        cardContentChildren.push({
            type: "ChipGroup",
            childrenProps: categoryChips
        });
    }

    // Add chip group for tags if any exists
    if (tagChips.length > 0) {
        cardContentChildren.push({
            type: "ChipGroup",
            childrenProps: tagChips
        });
    }

    const cardContent: IAutoView.IAutoViewCardContentProps = {
        type: "CardContent",
        childrenProps: cardContentChildren
    };

    // Build Card Footer with a "View Details" button.
    const cardFooter: IAutoView.IAutoViewCardFooterProps = {
        type: "CardFooter",
        childrenProps: [
            {
                type: "Button",
                label: "View Details",
                variant: "contained",
                color: "primary"
            }
        ]
    };

    // Compose the IAutoViewVerticalCardProps with header, content, footer as children
    const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
        type: "VerticalCard",
        childrenProps: [
            cardHeader,
            cardContent,
            cardFooter
        ]
    };

    return verticalCard;
}
