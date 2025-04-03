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
    // Create the CardHeader component with the member's name, email, and thumbnail
    const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
        type: "CardHeader",
        title: input.name,
        description: input.email,
        // Use an Avatar in the startElement to display the member's thumbnail
        startElement: {
            type: "Avatar",
            src: input.thumbnail,
            name: input.name
        }
    };

    // Create the CardContent component with age and introduction details
    const cardContent: IAutoView.IAutoViewCardContentProps = {
        type: "CardContent",
        childrenProps: [
            {
                type: "Text",
                variant: "body1",
                // Format the age as a text string.
                content: "Age: " + input.age
            },
            {
                type: "Markdown",
                content: input.introduction
            }
        ]
    };

    // Construct the overall VerticalCard layout that includes the header and content components
    const verticalCard: IAutoView.IAutoViewComponentProps = {
        type: "VerticalCard",
        childrenProps: [
            cardHeader,
            cardContent
        ]
    };

    return verticalCard;
}
