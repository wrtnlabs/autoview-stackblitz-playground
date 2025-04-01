import typia, { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
type IAutoViewTransformerInputType = {
    name: string;
    age: number & tags.Minimum<0> & tags.Maximum<100>;
    email: string & tags.Format<"email">;
    introduction: string;
    thumbnail: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
};
export function transformYourSchema($input: unknown): IAutoView.IAutoViewComponentProps {
    typia.assertGuard<IAutoViewTransformerInputType>($input);
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    // Build the CardHeader component
    const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
        type: "CardHeader",
        title: input.name,
        // Use an Avatar component as the startElement
        // This component displays the thumbnail along with the name
        startElement: {
            type: "Avatar",
            src: input.thumbnail,
            name: input.name,
            variant: "primary",
            size: 40,
        }
    };

    // Build the CardContent component with additional details
    const cardContent: IAutoView.IAutoViewCardContentProps = {
        type: "CardContent",
        childrenProps: [
            // Text component for the age field
            {
                type: "Text",
                variant: "subtitle1",
                // Concatenate string with age converted to string
                content: "Age: " + input.age.toString(),
                color: "primary",
            },
            // Text component for the email field
            {
                type: "Text",
                variant: "subtitle1",
                content: "Email: " + input.email,
                color: "secondary",
            },
            // Markdown component for the introduction field
            {
                type: "Markdown",
                content: input.introduction,
            }
        ]
    };

    // Combine the header and content in a VerticalCard component
    const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
        type: "VerticalCard",
        childrenProps: [cardHeader, cardContent],
    };

    return verticalCard;
}
