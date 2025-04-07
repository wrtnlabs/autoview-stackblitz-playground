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
  // The purpose of this function is to transform member data (name, age, email, introduction, thumbnail)
  // into a visual representation using the AutoView components.
  //
  // Our approach here is to display the member information within a vertical card.
  // We compose a CardHeader to show the avatar image, the member's name, and a brief description.
  // The CardContent then displays the introduction written in Markdown.
  //
  // Step 1: Create an Avatar component, which will be used in the CardHeader.
  const avatar: IAutoView.IAutoViewAvatarProps = {
    type: "Avatar",
    src: input.thumbnail,
    name: input.name,
    // Set a default variant and size; sizes allowed are: 4,8,12,16,20,24,28,32,36,40,56,64,72.
    variant: "primary",
    size: 40,
  };

  // Step 2: Create a CardHeader component.
  // Use the member's name as the title.
  // Combine age and email into the description for additional context.
  const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
    type: "CardHeader",
    title: input.name,
    description: `Age: ${input.age} | Email: ${input.email}`,
    startElement: avatar,
  };

  // Step 3: Create a Markdown presentation component to display the introduction.
  const markdownComponent: IAutoView.IAutoViewMarkdownProps = {
    type: "Markdown",
    content: input.introduction,
  };

  // Step 4: Create a CardContent component that holds the Markdown component.
  const cardContent: IAutoView.IAutoViewCardContentProps = {
    type: "CardContent",
    // childrenProps accepts a single component or an array.
    childrenProps: markdownComponent,
  };

  // Step 5: Assemble the final visualization using a VerticalCard component.
  // The VerticalCard childrenProps array includes the card header and card content.
  const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
    type: "VerticalCard",
    childrenProps: [cardHeader, cardContent],
  };

  // Return the fully composed component view.
  return verticalCard;
}
