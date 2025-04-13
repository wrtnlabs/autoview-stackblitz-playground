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
  // Create an avatar component to visually represent the member.
  // It uses the member's thumbnail picture and name.
  const avatar: IAutoView.IAutoViewAvatarProps = {
    type: "Avatar",
    src: input.thumbnail,
    name: input.name,
    // Choosing a default variant and size for visual consistency.
    variant: "primary",
    size: 40,
  };

  // Construct the card header.
  // The header displays the member's name as title and aggregates the age and email into its description.
  // The avatar is used as the startElement to add a visual cue.
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: input.name,
    description: `Age: ${input.age} | Email: ${input.email}`,
    startElement: avatar,
  };

  // Build a markdown component to display the member's introduction.
  // Using markdown allows for rich text and embedded media if the introduction includes such content.
  const markdownContent: IAutoView.IAutoViewMarkdownProps = {
    type: "Markdown",
    content: input.introduction,
  };

  // Define the card content which will hold the markdown introduction.
  // This separation helps with responsive design, as content can be styled differently from the header.
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    childrenProps: markdownContent,
  };

  // Compose a vertical card to aggregate the header and content.
  // Vertical cards are suitable for mobile devices, ensuring that the UI remains responsive and easy to navigate.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    childrenProps: [cardHeader, cardContent],
  };

  // Return the complete visualized component.
  return verticalCard;
}
