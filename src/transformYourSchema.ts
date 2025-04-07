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
  // Build a CardHeader component to display the member's basic details.
  // We include the member's name as the title and combine age and email into the description.
  const header: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: input.name,
    description: `Age: ${input.age} - Email: ${input.email}`,
  };

  // Build a Markdown component to display the introduction.
  // Since the introduction text is in Markdown format, we encapsulate it within a Markdown component.
  const introductionMarkdown: IAutoView.IAutoViewMarkdownProps = {
    type: "Markdown",
    content: input.introduction,
  };

  // Wrap the Markdown component in a CardContent component.
  // The CardContent component's childrenProps accepts presentation components like Markdown.
  const content: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    childrenProps: introductionMarkdown,
  };

  // Optionally build a CardMedia component to display the thumbnail.
  // We only include it if a thumbnail URL is provided.
  let media: IAutoView.IAutoViewCardMediaProps | undefined = undefined;
  if (input.thumbnail) {
    media = {
      type: "CardMedia",
      src: input.thumbnail,
    };
  }

  // Compose the VerticalCard by aggregating the header, media (if available), and content.
  // The VerticalCard is one of the valid types for IAutoView.IAutoViewComponentProps.
  // Arranging the components in an array makes the output structure easy to modify.
  const childrenComponents: (IAutoView.IAutoViewCardHeaderProps | IAutoView.IAutoViewCardMediaProps | IAutoView.IAutoViewCardContentProps)[] = [header];
  if (media) {
    childrenComponents.push(media);
  }
  childrenComponents.push(content);

  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    childrenProps: childrenComponents,
  };

  // Return the transformed data which now adheres to the IAutoView.IAutoViewComponentProps type.
  return verticalCard;
}
