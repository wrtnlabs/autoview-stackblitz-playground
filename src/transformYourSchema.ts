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
  // Construct the CardHeader component using the user's name, email, and thumbnail.
  // Note: The startElement property only accepts specific component types, so we use the Avatar component.
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    // Display the user's name prominently.
    title: input.name,
    // Use the email as a subtitle/description.
    description: input.email,
    // Use the user's thumbnail in an Avatar component for a visual identifier.
    startElement: {
      type: "Avatar",
      src: input.thumbnail,
      name: input.name,
      // Using a standard avatar size; this can be adjusted based on design needs.
      size: 56,
      // Choosing a default variant. In a production scenario, you might derive this from user data.
      variant: "primary",
    },
  };

  // Construct the CardContent component to display the introduction.
  // We use the Markdown component to render the introduction text as formatted content.
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    // Using a Markdown component for text representation so that the introduction is more engaging.
    childrenProps: {
      type: "Markdown",
      content: input.introduction,
    },
  };

  // Construct the CardFooter component to display additional details such as age.
  // We use a Text component as the footer because it allows enhanced styling options.
  const cardFooter: IAutoView.IAutoViewCardFooterProps = {
    type: "CardFooter",
    childrenProps: {
      type: "Text",
      // Display the age in a clear, descriptive manner.
      content: `Age: ${input.age}`,
      // Utilize a caption variant to keep the information unobtrusive.
      variant: "caption",
      // Choose a color that complements the header and content typography.
      color: "secondary",
    },
  };

  // Wrap all the components in a VerticalCard to create a responsive card layout.
  // VerticalCard's childrenProps accepts an array of presentation components.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    childrenProps: [cardHeader, cardContent, cardFooter],
  };

  // Return the composed value which is of type IAutoView.IAutoViewComponentProps
  // This design leverages visual elements (avatar, markdown, typography) to engage end users.
  return verticalCard;
}
