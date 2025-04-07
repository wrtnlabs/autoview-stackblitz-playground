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
  // We create a detailed "VerticalCard" layout to represent the member information.
  // The card consists of: a header (showing the name and email with an avatar), a media area (showing the thumbnail),
  // and content (displaying the introduction using markdown-friendly text).
  
  // Create a card header component.
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: input.name,
    description: input.email,
    // Include an avatar in the startElement. We assume the input.thumbnail & name can be used.
    startElement: {
      type: "Avatar",
      src: input.thumbnail,
      name: input.name,
      variant: "primary",
      size: 56
    }
  };
  
  // Create a card media component using the thumbnail URI.
  const cardMedia: IAutoView.IAutoViewCardMediaProps = {
    type: "CardMedia",
    src: input.thumbnail
  };
  
  // Create a card content component that utilizes a text component to render the introduction.
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    // The childrenProps here is a text component.
    childrenProps: {
      type: "Text",
      // Use the introduction text provided.
      content: input.introduction,
      // Set a body style for the text.
      variant: "body1",
      color: "primary"
    }
  };
  
  // Compose and return the final VerticalCard component with its children.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    childrenProps: [
      cardHeader,
      cardMedia,
      cardContent
    ]
  };
  
  return verticalCard;
}
