import { tags } from "typia";

/**
 * Your schema to be displayed in the result.
 *
 * The `AutoView` automatically generates a React component which displays
 * the schema.
 *
 * Run `npm run generate` to generate the component after changing this to take effect.
 */
export interface YourSchema {
  /**
   * Name of the member.
   */
  name: string;

  /**
   * Current age.
   */
  age: number & tags.Minimum<0> & tags.Maximum<100>;

  /**
   * Email address
   */
  email: string & tags.Format<"email">;

  /**
   * Introduction written by the member.
   *
   * Its format is Markdown, and there is no restriction on the length.
   */
  introduction: string;

  /**
   * Thumbnail picture of the member.
   */
  thumbnail: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
}
export namespace YourSchema {
  /**
   * The value of the schema to display in the result.
   *
   * Set this to `undefined` if you wish to display random values for your convenience.
   */
  export const value: YourSchema | undefined = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    introduction: "Hello, world!",
    thumbnail: "https://example.com/thumbnail.jpg",
  };
}
