import { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
type IAutoViewTransformerInputType = {
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
export function transformYourSchema($input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
  // Create a CardHeader component that showcases the member's basic info.
  // This includes the name, age, email and an avatar constructed from the thumbnail.
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: input.name,
    description: `Age: ${input.age} | Email: ${input.email}`,
    // Use the thumbnail to create an avatar for the member.
    startElement: {
      type: "Avatar",
      src: input.thumbnail,
      name: input.name,
      // Default variant and size; can be adjusted as needed.
      variant: "primary",
      size: 40,
    }
  };

  // Create a CardContent component that displays the member's introduction.
  // The introduction is in Markdown format and is rendered by the Markdown component.
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    // We nest a Markdown component inside the CardContent to render the introduction.
    childrenProps: {
      type: "Markdown",
      content: input.introduction,
    } as IAutoView.IAutoViewMarkdownProps,
  };

  // Compose a VerticalCard that aggregates the CardHeader and CardContent.
  // VerticalCard is chosen to allow stacking components vertically.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    childrenProps: [cardHeader, cardContent],
  };

  // Return the final transformed output.
  return verticalCard;
}
