import { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
/**
 * Seller sales products.
 *
 * `IShoppingSale` is an entity that embodies "product sales" (sales)
 * information registered by the {@link ISoppingSeller seller}. And the main
 * information of the sale is recorded in the sub {@link IShoppingSaleSnapshot},
 * not in the main `IShoppingSale`. When a seller changes a previously registered
 * item, the existing `IShoppingSale` record is not changed, but a new
 * {@link IShoppingSaleSnapshot snapshot} record be created.
 *
 * This is to preserve the {@link IShoppingCustomer customer}'s
 * {@link IShoppingOrder purchase history} flawlessly after the customer
 * purchases a specific item, even if the seller changes the components or
 * price of the item. It is also intended to support sellers in so-called A/B
 * testing, which involves changing components or prices and measuring the
 * performance in each case.
 *
 * ### Description of {@link section} property:
 *
 * > Belonged section.
 *
 * ### Description of {@link seller} property:
 *
 * > Seller who has registered the sale.
 *
 * ### Description of {@link content} property:
 *
 * > Description and image content describing the sale.
*/
type IShoppingSale = {
    /**
     * @title Belonged section
    */
    section: IShoppingSection;
    /**
     * @title Seller who has registered the sale
    */
    seller: IShoppingSeller.IInvert;
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
    content: IShoppingSaleContent;
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
    units: IShoppingSaleUnit[] & tags.MinItems<1>;
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
     * Invert information starting from seller info.
     *
     * Instead of accessing to the seller information from the
     * {@link IShoppingCustomer.member} -> {@link IShoppingMember.seller},
     * `IShoppingSeller.IInvert` starts from the seller information
     * and access to the customer, member and {@link IShoppingCitizen citizen}
     * information inversely.
     *
     * ### Description of {@link member} property:
     *
     * > Membership joining information.
     *
     * ### Description of {@link customer} property:
     *
     * > Customer, the connection information.
     *
     * ### Description of {@link citizen} property:
     *
     * > Real-name and mobile number authentication information.
    */
    export type IInvert = {
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
         * @title Customer, the connection information
        */
        customer: IShoppingCustomer.IInvert;
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
namespace IShoppingCustomer {
    /**
     * Inverted customer information.
     *
     * This inverted customer information has been designed to be used for
     * another invert information of sellers and administrators like below.
     *
     * - {@link IShoppingSeller.IInvert}
     * - {@link IShoppingAdministrator.IInvert}
     *
     * ### Description of {@link channel} property:
     *
     * > Belonged channel.
    */
    export type IInvert = {
        /**
         * Primary Key.
         *
         * @title Primary Key
        */
        id: string & tags.Format<"uuid">;
        /**
         * @title Belonged channel
        */
        channel: IShoppingChannel;
        /**
         * External user information.
         *
         * When the customer has come from an external service.
         *
         * @title External user information
        */
        external_user: null | IShoppingExternalUser;
        /**
         * Connection address.
         *
         * Same with {@link window.location.href} of client.
         *
         * @title Connection address
        */
        href: string & tags.Format<"uri">;
        /**
         * Referrer address.
         *
         * Same with {@link window.document.referrer} of client.
         *
         * @title Referrer address
        */
        referrer: null | (string & tags.Format<"uri">) | (string & tags.MaxLength<0>);
        /**
         * Connection IP Address.
         *
         * @title Connection IP Address
        */
        ip: (string & tags.Format<"ipv4">) | (string & tags.Format<"ipv6">);
        /**
         * Creation time of the connection record.
         *
         * @title Creation time of the connection record
        */
        created_at: string & tags.Format<"date-time">;
    };
}
/**
 * Channel information.
 *
 * `IShoppingChannel` is a concept that shapes the distribution channel in the
 * market. Therefore, the difference in the channel in this e-commerce system
 * means that it is another site or application.
 *
 * By the way, if your shopping mall system requires only one channel, then
 * just use only one. This concept is designed to be expandable in the future.
*/
type IShoppingChannel = {
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
     * Identifier code.
     *
     * @title Identifier code
    */
    code: string;
    /**
     * Name of the channel.
     *
     * @title Name of the channel
    */
    name: string;
};
/**
 * External user information.
 *
 * `IShoppingExternalUser` is an entity dsigned for when this system needs
 * to connect with external services and welcome their users as
 * {@link IShoppingCustomer customers} of this service.
 *
 * For reference, customers who connect from an external service must have
 * this record, and the external service user is identified through the two
 * attributes {@link application} and {@link uid}. If a customer connected
 * from an external service completes
 * {@link IShoppingCitizen real-name authentication} from this service, each
 * time the external service user reconnects to this service and issues a
 * new customer authentication token, real-name authentication begins with
 * completed.
 *
 * And {@link password} is the password issued to the user by the external
 * service system (the so-called permanent user authentication token), and
 * is never the actual user password. However, for customers who entered the
 * same application and uid as the current external system user, this is to
 * determine whether to view this as a correct external system user or a
 * violation.
 *
 * In addition, additional information received from external services can
 * be recorded in the data field in JSON format.
*/
type IShoppingExternalUser = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Citizen activation info.
     *
     * @title Citizen activation info
    */
    citizen: null | IShoppingCitizen;
    /**
     * Creation time of record.
     *
     * Another word, first time when the external user connected.
     *
     * @title Creation time of record
    */
    created_at: string & tags.Format<"date-time">;
    /**
     * Identifier key of external user from the external system.
     *
     * @title Identifier key of external user from the external system
    */
    uid: string;
    /**
     * Identifier code of the external service.
     *
     * It can be same with {@link IShoppingChannel.code} in common.
     *
     * @title Identifier code of the external service
    */
    application: string;
    /**
     * Nickname of external user in the external system.
     *
     * @title Nickname of external user in the external system
    */
    nickname: string;
    /**
     * Additional information about external user from the external
     * system.
    */
    data: any;
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
/**
 * Content information of sale snapshot.
 *
 * `IShoppingSaleContent` is an entity embodies the description contents
 * of {@link IShoppingSale}.
*/
type IShoppingSaleContent = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Title of the content.
     *
     * @title Title of the content
    */
    title: string;
    /**
     * Format of the body content.
     *
     * Same meaning with file extension like `html`, `md`, and `txt`.
     *
     * @title Format of the body content
    */
    format: "html" | "md" | "txt";
    /**
     * The main body content.
     *
     * Format follows the {@link format}, and default is `md` (markdown).
     *
     * @title The main body content
    */
    body: string;
    /**
     * List of attached files.
     *
     * @title List of attached files
    */
    files: IAttachmentFile[];
    /**
     * List of thumbnails.
     *
     * @title List of thumbnails
    */
    thumbnails: IAttachmentFile[];
};
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
/**
 * Product composition information handled in the sale.
 *
 * `IShoppingSaleUnit` is an entity that embodies the "individual product"
 * information handled in the {@link IShoppingSale sale}.
 *
 * For reference, the reason why `IShoppingSaleUnit` is separated from
 * {@link IShoppingSaleSnapshot} by an algebraic relationship of 1: N is because
 * there are some cases where multiple products are sold in one listing. This is
 * the case with so-called "bundled products".
 *
 * - Bundle from regular product (Mackbook Set)
 *   - Main Body
 *   - Keyboard
 *   - Mouse
 *   - Apple Care (Free A/S Voucher)
 *
 * And again, `IShoppingSaleUnit` does not in itself refer to the
 * {@link IShoppingSaleUnitStock final stock} that the
 * {@link IShoppingCustomer customer} will {@link IShoppingOrder purchase}.
 * The final stock can be found only after selecting all given
 * {@link IShoppingSaleUnitOption options} and their
 * {@link IShoppingSaleUnitOptionCandidate candidate values}.
 *
 * For example, even if you buy a Macbook, the final stocks are determined only
 * after selecting all the options (CPU / RAM / SSD), etc.
*/
type IShoppingSaleUnit = {
    /**
     * List of options.
     *
     * @title List of options
    */
    options: (IShoppingSaleUnitSelectableOption | IShoppingSaleUnitDescriptiveOption)[];
    /**
     * List of final stocks.
     *
     * @title List of final stocks
    */
    stocks: IShoppingSaleUnitStock[] & tags.MinItems<1>;
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
/**
 * Individual option information on units for sale.
 *
 * `IShoppingSaleUnitSelectableOption` is a subsidiary entity of
 * {@link IShoppingSaleUnit} that represents individual products in the
 * {@link IShoppingSale sale}, and is an entity designed to represent individual
 * selectable option information for the unit.
 *
 * - Examples of Options
 *   - selectable options
 *     - Computer: CPU, RAM, SSD, etc.
 *     - Clothes: size, color, style, etc.
 *   - descriptive options
 *     - Engrave
 *     - Simple question
 *
 * If the {@link variable} property value is `true`, the final stock that the
 * {@link IShoppingCustomer customer} will purchase changes depending on the
 * selection of the {@link IShoppingSaleUnitOptionCandidate candidate value}.
 *
 * Conversely, if it is a type other than "select", or if the {@link variable}
 * property value is "false", , this is an option that has no meaning beyond
 * simple information transfer. Therefore, no matter what value the customer
 * chooses when purchasing it, the option in this case does not affect the
 * {@link IShoppingSaleUnitStock final stock}.
*/
type IShoppingSaleUnitSelectableOption = {
    /**
     * List of candidate values.
     *
     * @title List of candidate values
    */
    candidates: IShoppingSaleUnitOptionCandidate[] & tags.MinItems<1>;
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Discriminant for the type of selectable option.
     *
     * @title Discriminant for the type of selectable option
    */
    type: "select";
    /**
     * Represents the name of the option.
     *
     * @title Represents the name of the option
    */
    name: string;
    /**
     * Whether the option is variable or not.
     *
     * When type of current option is "select", this attribute means whether
     * selecting different candidate value affects the final stock or not.
     *
     * @title Whether the option is variable or not
    */
    variable: boolean;
};
/**
 * Selectable candidate values within an option.
 *
 * `IShoppingSaleUnitOptionCandidate` is an entity that represents individual
 * candidate values that can be selected from
 * {@link IShoppingSaleUnitSelectableOption options of the "select" type}.
 *
 * - Example
 *   - RAM: 8GB, 16GB, 32GB
 *   - GPU: RTX 3060, RTX 4080, TESLA
 *   - License: Private, Commercial, Educatiion
 *
 * By the way, if belonged option is not "select" type, this entity never
 * being used.
*/
type IShoppingSaleUnitOptionCandidate = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Represents the name of the candidate value.
     *
     * @title Represents the name of the candidate value
    */
    name: string;
};
/**
 * Descriptive option.
 *
 * When type of the option not `"select"`, it means the option is descriptive
 * that requiring {@link IShoppingCustomer customers} to write some value to
 * {@link IShoppingOrder purchase}. Also, whatever customer writes about the
 * option, it does not affect the {@link IShoppingSaleUnitStock final stock}.
 *
 * Another words, the descriptive option is just for information transfer.
*/
type IShoppingSaleUnitDescriptiveOption = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Type of descriptive option.
     *
     * Which typed value should be written when purchasing.
     *
     * @title Type of descriptive option
    */
    type: "string" | "number" | "boolean";
    /**
     * Readable name of the option.
     *
     * @title Readable name of the option
    */
    name: string;
};
/**
 * Final component information on units for sale.
 *
 * `IShoppingSaleUnitStock` is a subsidiary entity of {@link IShoppingSaleUnit}
 * that represents a product catalog for sale, and is a kind of final stock that is
 * constructed by selecting all {@link IShoppingSaleUnitSelectableOption options}
 * (variable "select" type) and their
 * {@link IShoppingSaleUnitOptionCandidate candidate} values in the belonging unit.
 * It is the "good" itself that customers actually purchase.
 *
 * - Product Name) MacBook
 *   - Options
 *     - CPU: { i3, i5, i7, i9 }
 *     - RAM: { 8GB, 16GB, 32GB, 64GB, 96GB }
 *     - SSD: { 256GB, 512GB, 1TB }
 *   - Number of final stocks: 4 * 5 * 3 = 60
 *
 * For reference, the total number of `IShoppingSaleUnitStock` records in an
 * attribution unit can be obtained using Cartesian Product. In other words, the
 * value obtained by multiplying all the candidate values that each
 * (variable "select" type) option can have by the number of cases is the total
 * number of final stocks in the unit.
 *
 * Of course, without a single variable "select" type option, the final stocks
 * count in the unit is only 1.
 *
 * ### Description of {@link price} property:
 *
 * > Price of the stock.
 *
 * ### Description of {@link inventory} property:
 *
 * > Current inventory status of the stock.
*/
type IShoppingSaleUnitStock = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Representative name of the stock.
     *
     * @title Representative name of the stock
    */
    name: string;
    /**
     * @title Price of the stock
    */
    price: IShoppingPrice;
    /**
     * @title Current inventory status of the stock
    */
    inventory: IShoppingSaleUnitStockInventory;
    /**
     * List of choices.
     *
     * Which candidate values being chosen for each option.
     *
     * @title List of choices
    */
    choices: IShoppingSaleUnitStockChoice[];
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
/**
 * Inventory information of a final stock.
*/
type IShoppingSaleUnitStockInventory = {
    /**
     * Total income quantity.
     *
     * @title Total income quantity
    */
    income: number & tags.Type<"uint32">;
    /**
     * Total outcome quantity.
     *
     * @title Total outcome quantity
    */
    outcome: number & tags.Type<"uint32">;
};
/**
 * Selection information of final stock.
 *
 * `IShoppingSaleUnitStockChoice` is an entity that represents which
 * {@link IShoppingSaleUnitSelectableOption option} of each variable "select"
 * type was selected for each {@link IShoppingSaleUnitStock stock} and which
 * {@link IShoppingSaleUnitOptionCandidate candidate value} was selected within
 * it.
 *
 * Of course, if the bound {@link IShoppingSaleUnit unit} does not have any
 * options, this entity can also be ignored.
*/
type IShoppingSaleUnitStockChoice = {
    /**
     * Primary Key.
     *
     * @title Primary Key
    */
    id: string & tags.Format<"uuid">;
    /**
     * Target option's {@link IShoppingSaleUnitOption.id}
    */
    option_id: string & tags.Format<"uuid">;
    /**
     * Target candidate's {@link IShoppingSaleUnitOptionCandidate.id}
    */
    candidate_id: string & tags.Format<"uuid">;
};
type IAutoViewTransformerInputType = IShoppingSale;
export function transformSale($input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
  // We are constructing a vertical card layout to visually display the sale information.
  // The vertical card will consist of a header, content and footer.
  // Each section leverages icons, markdown rendering and other visual elements to enhance the UI.

  // --- Card Header ---
  // The header displays the sale title and section name.
  // It also includes visual icons to improve the presentation.
  const header: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: input.content.title, // Sale title from the content title.
    description: `Section: ${input.section.name}`, // Provides context about where the sale belongs.
    // Use an icon to visually represent the sale category.
    startElement: {
      type: "Icon",
      id: "tag", // Icon name in kebab-case. This visually hints at "sale" or "category".
      size: 16,
      color: "blue"
    },
    // Display another icon on the right side (e.g., time) for visual interest.
    endElement: {
      type: "Icon",
      id: "clock", // Represents time-related metadata.
      size: 16,
      color: "gray"
    }
  };

  // --- Card Content ---
  // We use the Markdown component to render the main body content.
  // This approach ensures better readability and allows for complex formatting.
  const markdownComponent: IAutoView.IAutoViewMarkdownProps = {
    type: "Markdown",
    content: input.content.body || "No detailed description available."
  };

  const content: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    // The childrenProps property accepts a single component (or an array) of presentation components.
    childrenProps: markdownComponent
  };

  // --- Card Footer ---
  // The footer aggregates several metadata fields about the sale.
  // We present this information using the Markdown component to allow rich text formatting,
  // which is especially useful on small screens.
  let metaMarkdown = `**Sale ID:** ${input.id}\n\n`;
  metaMarkdown += `**Created at:** ${input.created_at}\n\n`;
  metaMarkdown += `**Updated at:** ${input.updated_at}\n\n`;
  if (input.paused_at) {
    metaMarkdown += `**Paused at:** ${input.paused_at}\n\n`;
  }
  if (input.suspended_at) {
    metaMarkdown += `**Suspended at:** ${input.suspended_at}\n\n`;
  }
  if (input.opened_at) {
    metaMarkdown += `**Opened at:** ${input.opened_at}\n\n`;
  }
  if (input.closed_at) {
    metaMarkdown += `**Closed at:** ${input.closed_at}\n\n`;
  }
  if (input.tags && input.tags.length > 0) {
    metaMarkdown += `**Tags:** ${input.tags.join(", ")}\n\n`;
  }
  // Also include seller information if available.
  if (input.seller && input.seller.member && input.seller.member.nickname) {
    metaMarkdown += `**Seller:** ${input.seller.member.nickname}\n\n`;
  }

  const footerMarkdown: IAutoView.IAutoViewMarkdownProps = {
    type: "Markdown",
    content: metaMarkdown
  };

  const footer: IAutoView.IAutoViewCardFooterProps = {
    type: "CardFooter",
    // The childrenProps will contain our markdown component.
    childrenProps: footerMarkdown
  };

  // --- Compose the Vertical Card ---
  // The vertical card aggregates header, content and footer into a single presentation component.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    // Order is important; header at top, followed by content and footer.
    childrenProps: [header, content, footer]
  };

  // Return the final composed UI component.
  return verticalCard;
}
