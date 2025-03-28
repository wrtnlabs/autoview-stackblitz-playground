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
    // Helper function: convert number age to string
    function formatAge(age: number): string {
        return age.toString();
    }
    
    // Create a profile object mapping input fields with the necessary conversion for age
    const profile = {
        name: input.name,
        age: formatAge(input.age),
        email: input.email,
        introduction: input.introduction,
        thumbnail: input.thumbnail,
    };
    
    // Assemble the output using a StackedList to encapsulate multiple components
    return {
        type: "StackedList",
        items: [
            {
                children: [
                    // Profile Header: Avatar Component
                    {
                        type: "ImageAvatar",
                        src: profile.thumbnail,
                        name: profile.name,
                        size: 40,
                    },
                    // Profile Name displayed as header
                    {
                        type: "Typography",
                        variant: "h5",
                        children: profile.name,
                    },
                    // Supplementary Detail: Age displayed using Stats component
                    {
                        type: "Stats",
                        title: "Age",
                        value: profile.age,
                    },
                    // Display email using Chip component
                    {
                        type: "Chip",
                        label: profile.email,
                    },
                    // Divider between header and introduction content
                    {
                        type: "Divider",
                        orientation: "horizontal",
                        variant: "solid",
                        color: "#e0e0e0",
                    },
                    // Introduction displayed as paragraph
                    {
                        type: "Typography",
                        variant: "body1",
                        children: profile.introduction,
                    },
                ],
            },
        ],
    };
}
