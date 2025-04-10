import { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
/**
 * Your schema to be displayed in the result.
 *
 * The `AutoView` automatically generates a React component
 * which displays the schema.
 *
 * Run `npm run generate` to generate the component after
 * changing this to take effect.
*/
type YourSchema = {
    /**
     * Name of the member.
     *
     * @title Name of the member
    */
    name: string;
    /**
     * Current age.
     *
     * @title Current age
    */
    age: number & tags.Minimum<0> & tags.Maximum<100>;
    /**
     * Email address
    */
    email: string & tags.Format<"email">;
    /**
     * Introduction written by the member.
     *
     * Its format is Markdown, and there is no restriction
     * on the length.
     *
     * @title Introduction written by the member
    */
    introduction: string;
    /**
     * Thumbnail picture of the member.
     *
     * @title Thumbnail picture of the member
    */
    thumbnail: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
};
type IAutoViewTransformerInputType = YourSchema;
export function transformYourSchema($input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
  // The function transforms the input schema data into a compound UI element (a vertical card)
  // which aggregates and visualizes the member's info using visual components such as avatar, image, markdown, and button
  // We use a vertical card to structure the data in a responsive and engaging visual layout.

  // Build a CardHeader that shows the member's name and age.
  // We include an avatar (using the thumbnail) on the left and an email icon on the right.
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    // Display the member's name as the title
    title: input.name,
    // Show the age in a text description
    description: `Age: ${input.age}`,
    // Use the avatar component for the start element with the thumbnail image
    startElement: {
      type: "Avatar",
      src: input.thumbnail,
      name: input.name,
      variant: "primary",
      size: 32, // reasonable size for mobile as well as desktop
    },
    // For the end element, show an email icon (assuming "mail" is a valid icon id)
    endElement: {
      type: "Icon",
      id: "mail",
      color: "blue",
      size: 16,
    },
  };

  // Build a CardMedia component to display the member's thumbnail prominently.
  const cardMedia: IAutoView.IAutoViewCardMediaProps = {
    type: "CardMedia",
    src: input.thumbnail,
  };

  // Build a CardContent component to display the introduction.
  // We use the Markdown component to allow for rich text formatting.
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    // Since the childrenProps property accepts a variety of presentation components,
    // we use a Markdown component to render the introduction content.
    childrenProps: {
      type: "Markdown",
      content: input.introduction,
    },
  };

  // Build a CardFooter component with a button that allows users to contact the member.
  // The button links to the member's email using the "mailto:" protocol.
  const cardFooter: IAutoView.IAutoViewCardFooterProps = {
    type: "CardFooter",
    childrenProps: {
      type: "Button",
      variant: "contained",
      color: "primary",
      size: "medium",
      // The label is a brief text, and href creates a clickable link to send an email.
      label: "Contact",
      href: `mailto:${input.email}`,
    },
  };

  // Compose the above components into a VerticalCard.
  // The VerticalCard aggregates the header, media, content, and footer into a single responsive UI component.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    // childrenProps accepts an array of presentation components.
    childrenProps: [cardHeader, cardMedia, cardContent, cardFooter],
  };

  // Return the complete UI component
  return verticalCard;
}
