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
export function transform($input: unknown): IAutoView.IAutoViewComponentProps {
    typia.assertGuard<IAutoViewTransformerInputType>($input);
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    // Create the header component using the sale content title and seller nickname.
    const header: IAutoView.IAutoViewCardHeaderProps = {
        type: "CardHeader",
        title: input.content.title,
        // Use seller.member.nickname for display in the header's start element.
        startElement: {
            // Use a text component from AutoView to show seller info.
            type: "Text",
            content: input.seller.member.nickname,
            variant: "subtitle1"
        }
    };

    // Create the markdown component for rendering the content body.
    const markdownComponent: IAutoView.IAutoViewMarkdownProps = {
        type: "Markdown",
        content: input.content.body
    };

    // Optionally, include the first thumbnail image if available.
    const imageComponent: IAutoView.IAutoViewImageProps | undefined =
        input.content.thumbnails && input.content.thumbnails.length > 0
            ? {
                  type: "Image",
                  src: input.content.thumbnails[0].url,
                  alt: input.content.title
              }
            : undefined;

    // Assemble the card content children; include markdown and image if available.
    const contentChildren: IAutoView.IAutoViewPresentationComponentProps[] = [markdownComponent];
    if (imageComponent) {
        contentChildren.push(imageComponent);
    }
    const cardContent: IAutoView.IAutoViewCardContentProps = {
        type: "CardContent",
        childrenProps: contentChildren
    };

    // Map categories to chip components. Use the category name as label.
    const categoryChips: IAutoView.IAutoViewChipProps[] = input.categories.map((category) => ({
        type: "Chip",
        label: category.name,
        variant: "outlined"
    }));

    // Map tags to chip components.
    const tagChips: IAutoView.IAutoViewChipProps[] = input.tags.map((tag) => ({
        type: "Chip",
        label: tag,
        variant: "outlined"
    }));

    // Create chip groups for categories and tags if they exist.
    const chipGroups: IAutoView.IAutoViewChipGroupProps[] = [];
    if (categoryChips.length > 0) {
        chipGroups.push({
            type: "ChipGroup",
            childrenProps: categoryChips
        });
    }
    if (tagChips.length > 0) {
        chipGroups.push({
            type: "ChipGroup",
            childrenProps: tagChips
        });
    }

    // Create text components for displaying created and updated timestamps.
    const createdText: IAutoView.IAutoViewTextProps = {
        type: "Text",
        content: `Created: ${input.created_at}`,
        variant: "caption"
    };
    const updatedText: IAutoView.IAutoViewTextProps = {
        type: "Text",
        content: `Updated: ${input.updated_at}`,
        variant: "caption"
    };

    // Assemble footer children by concatenating chip groups and date texts.
    const footerChildren: IAutoView.IAutoViewPresentationComponentProps[] = [
        ...chipGroups,
        createdText,
        updatedText
    ];
    const cardFooter: IAutoView.IAutoViewCardFooterProps = {
        type: "CardFooter",
        childrenProps: footerChildren
    };

    // Assemble the overall vertical card with header, content, and footer.
    const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
        type: "VerticalCard",
        childrenProps: [header, cardContent, cardFooter]
    };

    return verticalCard;
}
