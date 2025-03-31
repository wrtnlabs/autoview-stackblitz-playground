import type * as IAutoView from "@autoview/interface";
import typia, { tags } from "typia";

type IAutoViewTransformerInputType = {
  name: string;
  age: number & tags.Minimum<0> & tags.Maximum<100>;
  email: string & tags.Format<"email">;
  introduction: string;
  thumbnail: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
};
export function transform($input: unknown): IAutoView.IAutoViewComponentProps {
  typia.assertGuard<IAutoViewTransformerInputType>($input);
  return visualizeData($input);
}

function visualizeData(
  input: IAutoViewTransformerInputType,
): IAutoView.IAutoViewComponentProps {
  // Destructure input properties
  const { name, age, email, introduction, thumbnail } = input;

  // Construct the Avatar to be used in CardHeader
  const avatar: IAutoView.IAutoViewAvatarProps = {
    type: "Avatar",
    src: thumbnail,
    name: name,
    // Using 40 as a standard size from the allowed sizes (4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 56, 64, 72)
    size: 40,
    variant: "primary",
  };

  // Construct the Card Header which includes the name and basic details (age and email)
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: name,
    // Format age with "years" appended and combine with email separated by a "|"
    description: `Age: ${age} years | Email: ${email}`,
    startElement: avatar,
  };

  // Construct the Markdown component for introduction inside Card Content
  const markdownComponent: IAutoView.IAutoViewMarkdownProps = {
    type: "Markdown",
    content: introduction,
  };

  // Construct the Card Content that holds the Markdown component
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    childrenProps: markdownComponent,
  };

  // Create the Card container that holds the header and content.
  const card: IAutoView.IAutoViewCardPropsIAutoViewCardProps.IOrientation = {
    type: "Card",
    orientation: "vertical",
    childrenProps: [cardHeader, cardContent],
  };

  // Return the final component configuration
  return card;
}
