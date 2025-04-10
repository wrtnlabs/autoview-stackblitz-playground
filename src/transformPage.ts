import { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
namespace IPageIShoppingSale {
    /**
     * A page.
     *
     * Collection of records with pagination indformation.
     *
     * ### Description of {@link pagination} property:
     *
     * > Page information.
    */
    export type ISummary = {
        /**
         * @title Page information
        */
        pagination: IPage.IPagination;
        /**
         * List of records.
         *
         * @title List of records
        */
        data: IShoppingSale.ISummary[];
    };
}
namespace IPage {
    /**
     * Page information.
    */
    export type IPagination = {
        /**
         * Current page number.
         *
         * @title Current page number
        */
        current: number & tags.Type<"uint32">;
        /**
         * Limitation of records per a page.
         *
         * @title Limitation of records per a page
        */
        limit: number & tags.Type<"uint32">;
        /**
         * Total records in the database.
         *
         * @title Total records in the database
        */
        records: number & tags.Type<"uint32">;
        /**
         * Total pages.
         *
         * Equal to {@link records} / {@link limit} with ceiling.
         *
         * @title Total pages
        */
        pages: number & tags.Type<"uint32">;
    };
}
namespace IShoppingSale {
    /**
     * Summarized information of sale.
     *
     * This summarized information being used for pagination.
     *
     * ### Description of {@link section} property:
     *
     * > Belonged section.
     *
     * ### Description of {@link seller} property:
     *
     * > Seller who has registered the sale.
     *
     * ### Description of {@link price_range} property:
     *
     * > Price range of the unit.
     *
     * ### Description of {@link content} property:
     *
     * > Description and image content describing the sale.
    */
    export type ISummary = {
        /**
         * @title Belonged section
        */
        section: IShoppingSection;
        /**
         * @title Seller who has registered the sale
        */
        seller: IShoppingSeller.ISummary;
        /**
         * @title Price range of the unit
        */
        price_range: IShoppingSalePriceRange;
        /**
         * Primary Key of Sale.
         *
         * @title Primary Key of Sale
        */
        id: string & tags.Format<"uuid">;
        /**
         * Primary Key of Snapshot.
         *
         * @title Primary Key of Snapshot
        */
        snapshot_id: string & tags.Format<"uuid">;
        /**
         * Whether the snapshot is the latest one or not.
         *
         * @title Whether the snapshot is the latest one or not
        */
        latest: boolean;
        /**
         * @title Description and image content describing the sale
        */
        content: IShoppingSaleContent.IInvert;
        /**
         * List of categories.
         *
         * Which categories the sale is registered to.
         *
         * @title List of categories
        */
        categories: IShoppingChannelCategory.IInvert[];
        /**
         * List of search tags.
         *
         * @title List of search tags
        */
        tags: string[];
        /**
         * List of units.
         *
         * Records about individual product composition information that are sold
         * in the sale. Each {@link IShoppingSaleUnit unit} record has configurable
         * {@link IShoppingSaleUnitOption options},
         * {@link IShoppingSaleUnitOptionCandidate candidate} values for each
         * option, and {@link IShoppingSaleUnitStock final stocks} determined by
         * selecting every candidate values of each option.
         *
         * @title List of units
        */
        units: IShoppingSaleUnit.ISummary[] & tags.MinItems<1>;
        /**
         * Creation time of the record.
         *
         * Note that, this property is different with {@link opened_at},
         * which means the timepoint of the sale is opened.
         *
         * @title Creation time of the record
        */
        created_at: string & tags.Format<"date-time">;
        /**
         * Last updated time of the record.
         *
         * In another words, creation time of the last snapshot.
         *
         * @title Last updated time of the record
        */
        updated_at: string & tags.Format<"date-time">;
        /**
         * Paused time of the sale.
         *
         * The sale is paused by the seller, for some reason.
         *
         * {@link IShoppingCustomer Customers} can still see the sale on the
         * both list and detail pages, but the sale has a warning label
         * "The sale is paused by the seller".
         *
         * @title Paused time of the sale
        */
        paused_at: null | (string & tags.Format<"date-time">);
        /**
         * Suspended time of the sale.
         *
         * The sale is suspended by the seller, for some reason.
         *
         * {@link IShoppingCustomer Customers} cannot see the sale on the
         * both list and detail pages. It is almost same with soft delettion,
         * but there's a little bit difference that the owner
         * {@link IShoppingSeller seller} can still see the sale and resume it.
         *
         * Of course, the {@link IShoppingCustomer customers} who have
         * already purchased the sale can still see the sale on the
         * {@link IShoppingOrder order} page.
         *
         * @title Suspended time of the sale
        */
        suspended_at: null | (string & tags.Format<"date-time">);
        /**
         * Opening time of the sale.
         *
         * @title Opening time of the sale
        */
        opened_at: null | (string & tags.Format<"date-time">);
        /**
         * Closing time of the sale.
         *
         * If this value is `null`, the sale be continued forever.
         *
         * @title Closing time of the sale
        */
        closed_at: null | (string & tags.Format<"date-time">);
    };
}
/**
 * Section information.
 *
 * `IShoppingSection` is a concept that refers to the spatial information of
 * the market.
 *
 * If we compare the section mentioned here to the offline market, it means a
 * spatially separated area within the store, such as the "fruit corner" or
 * "butcher corner". Therefore, in the {@link IShoppingSale sale} entity, it is
 * not possible to classify multiple sections simultaneously, but only one section
 * can be classified.
 *
 * By the way, if your shopping mall system requires only one section, then just
 * use only one. This concept is designed to be expandable in the future.
*/
type IShoppingSection = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Identifier code.
     *
     * @title Identifier code
    */
    code: string;
    /**
     * Representative name of the section.
     *
     * @title Representative name of the section
    */
    name: string;
    /**
     * Creation time of record.
     *
     * @title Creation time of record
    */
    created_at: string & tags.Format<"date-time">;
};
namespace IShoppingSeller {
    /**
     * Summary of seller information.
     *
     * ### Description of {@link member} property:
     *
     * > Membership joining information.
     *
     * ### Description of {@link citizen} property:
     *
     * > Real-name and mobile number authentication information.
    */
    export type ISummary = {
        /**
         * Discriminant for the type of seller.
         *
         * @title Discriminant for the type of seller
        */
        type: "seller";
        /**
         * @title Membership joining information
        */
        member: IShoppingMember.IInvert;
        /**
         * @title Real-name and mobile number authentication information
        */
        citizen: IShoppingCitizen;
        /**
         * Primary Key.
         *
         * @title Primary Key
        */
        id: string & tags.Format<"uuid">;
        /**
         * Creation tmie of record.
         *
         * Another words, the time when the seller has signed up.
         *
         * @title Creation tmie of record
        */
        created_at: string & tags.Format<"date-time">;
    };
}
namespace IShoppingMember {
    /**
     * Invert information of member.
     *
     * This invert member information has been designed to be used for another
     * invert information of sellers and administrators like below.
     *
     * - {@link IShoppingSeller.IInvert}
     * - {@link IShoppingAdministrator.IInvert}
    */
    export type IInvert = {
        /**
         * Primary Key.
         *
         * @title Primary Key
        */
        id: string & tags.Format<"uuid">;
        /**
         * Nickname that uniquely identifies the member.
         *
         * @title Nickname that uniquely identifies the member
        */
        nickname: string;
        /**
         * List of emails.
         *
         * @title List of emails
        */
        emails: IShoppingMemberEmail[];
        /**
         * Creation time of record.
         *
         * Another words, the time when the member has signed up.
         *
         * @title Creation time of record
        */
        created_at: string & tags.Format<"date-time">;
    };
}
/**
 * Email address of member.
 *
 * This shopping mall system allows multiple email addresses to be
 * registered for one {@link IShoppingMember member}. If you don't have to
 * plan such multiple email addresses, just use only one.
*/
type IShoppingMemberEmail = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Email address value.
     *
     * @title Email address value
    */
    value: string & tags.Format<"email">;
    /**
     * Creation time of record.
     *
     * @title Creation time of record
    */
    created_at: string & tags.Format<"date-time">;
};
/**
 * Citizen verification information.
 *
 * `IShoppingCitizen` is an entity that records the user's
 * {@link name real name} and {@link mobile} input information.
 *
 * For reference, in South Korea, real name authentication is required for
 * e-commerce participants, so the name attribute is important. However, the
 * situation is different overseas, so in reality, mobile attributes are the
 * most important, and identification of individual person is also done based
 * on this mobile.
 *
 * Of course, real name and mobile phone authentication information are
 * encrypted and stored.
*/
type IShoppingCitizen = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Creation time of record.
     *
     * @title Creation time of record
    */
    created_at: string & tags.Format<"date-time">;
    /**
     * Mobile number.
     *
     * @title Mobile number
    */
    mobile: string & tags.Pattern<"^[0-9]*$"> & tags.JsonSchemaPlugin<{
        "x-wrtn-payment-order-mobile": true
    }>;
    /**
     * Real name, or equivalent nickname.
     *
     * @title Real name, or equivalent nickname
    */
    name: string & tags.JsonSchemaPlugin<{
        "x-wrtn-payment-order-citizen": true
    }>;
};
type IShoppingSalePriceRange = {
    lowest: IShoppingPrice;
    highest: IShoppingPrice;
};
/**
 * Shopping price interface.
*/
type IShoppingPrice = {
    /**
     * Nominal price.
     *
     * This is not {@link real real price} to pay, but just a nominal price to show.
     * If this value is greater than the {@link real real price}, it would be shown
     * like {@link IShoppingSeller seller} is giving a discount.
     *
     * @title Nominal price
    */
    nominal: number & tags.Minimum<0>;
    /**
     * Real price to pay.
     *
     * @title Real price to pay
    */
    real: number & tags.Minimum<0>;
};
namespace IShoppingSaleContent {
    export type IInvert = {
        id: string & tags.Format<"uuid">;
        title: string;
        thumbnails: IAttachmentFile[];
    };
}
/**
 * Attachment File.
 *
 * Every attachment files that are managed in current system.
 *
 * For reference, it is possible to omit one of file {@link name}
 * or {@link extension} like `.gitignore` or `README` case, but not
 * possible to omit both of them.
*/
type IAttachmentFile = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Creation time of attachment file.
     *
     * @title Creation time of attachment file
    */
    created_at: string & tags.Format<"date-time">;
    /**
     * File name, except extension.
     *
     * If there's file `.gitignore`, then its name is an empty string.
     *
     * @title File name, except extension
    */
    name: string & tags.MaxLength<255>;
    /**
     * Extension.
     *
     * Possible to omit like `README` case.
     *
     * @title Extension
    */
    extension: null | (string & tags.MinLength<1> & tags.MaxLength<8>);
    /**
     * URL path of the real file.
     *
     * @title URL path of the real file
    */
    url: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
};
namespace IShoppingChannelCategory {
    /**
     * Invert category information with parent category.
    */
    export type IInvert = {
        /**
         * Parent category info with recursive structure.
         *
         * If no parent exists, then be `null`.
         *
         * @title Parent category info with recursive structure
        */
        parent: null | IShoppingChannelCategory.IInvert;
        /**
         * Primary Key.
         *
         * @title Primary Key
        */
        id: string & tags.Format<"uuid">;
        /**
         * Identifier code of the category.
         *
         * The code must be unique in the channel.
         *
         * @title Identifier code of the category
        */
        code: string;
        /**
         * Parent category's ID.
         *
         * @title Parent category's ID
        */
        parent_id: null | (string & tags.Format<"uuid">);
        /**
         * Representative name of the category.
         *
         * The name must be unique within the parent category. If no parent exists,
         * then the name must be unique within the channel between no parent
         * categories.
         *
         * @title Representative name of the category
        */
        name: string;
        /**
         * Creation time of record.
         *
         * @title Creation time of record
        */
        created_at: string & tags.Format<"date-time">;
    };
}
namespace IShoppingSaleUnit {
    export type ISummary = {
        price_range: IShoppingSalePriceRange;
        /**
         * Primary Key.
         *
         * @title Primary Key
        */
        id: string & tags.Format<"uuid">;
        /**
         * Representative name of the unit.
         *
         * @title Representative name of the unit
        */
        name: string;
        /**
         * Whether the unit is primary or not.
         *
         * Just a labeling value.
         *
         * @title Whether the unit is primary or not
        */
        primary: boolean;
        /**
         * Whether the unit is required or not.
         *
         * When the unit is required, the customer must select the unit. If do not
         * select, customer can't buy it.
         *
         * For example, if there's a sale "Macbook Set" and one of the unit is the
         * "Main Body", is it possible to buy the "Macbook Set" without the
         * "Main Body" unit? This property is for that case.
         *
         * @title Whether the unit is required or not
        */
        required: boolean;
    };
}
type IAutoViewTransformerInputType = IPageIShoppingSale.ISummary;
export function transformPage($input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
  // We create a carousel component that will display each sale as a vertical card.
  // Each card will include a header, optionally an image (if a thumbnail is present),
  // markdown content for seller and price info, and a footer with creation time.
  // This makes the UI engaging with visual elements (icons, images, markdown) for better mobile responsiveness.
  
  // Transform individual sale records into vertical cards.
  const verticalCards = input.data.map((sale) => {
    // Card header: display the sale title and section name.
    const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
      type: "CardHeader",
      title: sale.content.title,
      description: `Section: ${sale.section.name}`,
      // Use an icon to visually represent the sale (e.g. a 'tag' icon).
      startElement: {
        type: "Icon",
        id: "tag",
        size: 16,
        color: "blue"
      },
      // An end icon to indicate time information.
      endElement: {
        type: "Icon",
        id: "clock",
        size: 16,
        color: "gray"
      }
    };

    // Card media: if there is at least one thumbnail image, display it.
    // Otherwise, skip the media component.
    let cardMedia: IAutoView.IAutoViewCardMediaProps | undefined = undefined;
    if (sale.content.thumbnails && sale.content.thumbnails.length > 0) {
      cardMedia = {
        type: "CardMedia",
        src: sale.content.thumbnails[0].url
      };
    }

    // Card content: display details about the seller and price range using markdown.
    const cardContent: IAutoView.IAutoViewCardContentProps = {
      type: "CardContent",
      childrenProps: {
        type: "Markdown",
        content: `**Seller:** ${sale.seller.member.nickname}\n\n**Price Range:** Nominal: ${sale.price_range.lowest.nominal} / Real: ${sale.price_range.lowest.real}`
      }
    };

    // Card footer: display creation time using markdown.
    const cardFooter: IAutoView.IAutoViewCardFooterProps = {
      type: "CardFooter",
      childrenProps: {
        type: "Markdown",
        content: `Created at: ${sale.created_at}`
      }
    };

    // Compose the vertical card using the allowed child components.
    // Filter out any undefined components (for example, if cardMedia is not available).
    const childrenComponents: (IAutoView.IAutoViewCardHeaderProps | IAutoView.IAutoViewCardMediaProps | IAutoView.IAutoViewCardContentProps | IAutoView.IAutoViewCardFooterProps)[] = 
      [cardHeader, cardMedia, cardContent, cardFooter].filter((comp): comp is Exclude<typeof comp, undefined> => comp !== undefined);

    return {
      type: "VerticalCard",
      childrenProps: childrenComponents
    } as IAutoView.IAutoViewVerticalCardProps;
  });

  // If there are no sale records, we return a simple markdown component to notify the user. 
  // This fallback still uses visual markdown rather than plain text.
  if (verticalCards.length === 0) {
    return {
      type: "Markdown",
      content: "### No sales available.\nPlease check back later."
    } as IAutoView.IAutoViewMarkdownProps;
  }

  // Compose the final carousel component according to the extra instruction "use carousel layout for each item".
  const carousel: IAutoView.IAutoViewCarouselProps = {
    type: "Carousel",
    autoPlay: true,
    interval: 30, // Recommended value (between 20 and 60)
    infinite: true,
    gutter: 10,
    effect: "slide",
    navControls: true,
    indicators: true,
    // Place the vertical cards into the carousel.
    childrenProps: verticalCards
  };

  return carousel;
}
