import typia, { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
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



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    // Build CardHeader component with member name, email, and thumbnail (as an avatar)
    const cardHeader: IAutoView.IAutoViewCardHeaderProps = {
        type: "CardHeader",
        title: input.name,
        description: input.email,
        startElement: {
            type: "Avatar",
            src: input.thumbnail,
            name: input.name
        }
    };

    // Build CardContent component with introduction rendered as Markdown and age as a Text element
    const markdownComponent: IAutoView.IAutoViewMarkdownProps = {
        type: "Markdown",
        content: input.introduction
    };

    const ageTextComponent: IAutoView.IAutoViewTextProps = {
        type: "Text",
        // Concatenate the label "Age:" with the age converted to string.
        content: "Age: " + input.age.toString()
    };

    const cardContent: IAutoView.IAutoViewCardContentProps = {
        type: "CardContent",
        // Group the markdown and age text components into an array as childrenProps.
        childrenProps: [markdownComponent, ageTextComponent]
    };

    // Combine header and content into a Vertical Card component.
    const verticalCard: IAutoView.IAutoViewVerticalCardProps = {
        type: "VerticalCard",
        childrenProps: [cardHeader, cardContent]
    };

    return verticalCard;
}
