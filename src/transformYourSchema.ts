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
  // We are creating a vertical card to present the member information.
  // The card is structured as follows:
  // 1. CardHeader: Displays the member's name and age.
  // 2. CardMedia: Shows the member's thumbnail image.
  // 3. CardContent: Contains two parts:
  //    a. A Markdown component showing the introduction.
  //    b. A Text component displaying the email address.
  //
  // This transformation aggregates the input data into a cohesive, visual card format.
  
  // Create a CardHeader component displaying the member's name and age.
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: input.name,
    description: `Age: ${input.age}`, // additional info like age can be included here
  };

  // Create a CardMedia component to display the member's thumbnail image.
  const cardMedia: IAutoView.IAutoViewCardMediaProps = {
    type: "CardMedia",
    src: input.thumbnail,
  };

  // Create a Markdown component to display the introduction text.
  const introductionMarkdown: IAutoView.IAutoViewMarkdownProps = {
    type: "Markdown",
    content: input.introduction,
  };

  // Create a Text component to display the member's email address.
  // We use the Text variant "body1" for normal text display.
  const emailText: IAutoView.IAutoViewTextProps = {
    type: "Text",
    variant: "body1",
    content: input.email,
    // Color could be optionally set here if needed:
    // color: "primary",
  };

  // Combine the Markdown and Text component into the CardContent.
  // The childrenProps field accepts either a single component or an array of presentation components.
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    childrenProps: [introductionMarkdown, emailText],
  };

  // Compose the final VerticalCard component which holds all the defined child components.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    childrenProps: [cardHeader, cardMedia, cardContent],
  };

  // Return the composed vertical card as the final visualization output.
  return verticalCard;
}
