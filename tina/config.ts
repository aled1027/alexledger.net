import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "boolean",
            name: "draft",
            label: "Is Draft",
            required: false,
          },

          {
            type: "datetime",
            name: "date",
            label: "Date Posted",
            required: true,
          },
          // https://tina.io/docs/reference/toolkit/fields/tags/
          {
            type: "string",
            name: "tags",
            label: "Tags",
            description: "Tags for this post",
            list: true,
            //   ui: {
            //     component: "tags",
            //   },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "guide",
        label: "Guides",
        path: "src/content/guides",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },

          {
            type: "datetime",
            name: "date",
            label: "Date Posted",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "groceries",
        label: "Groceries",
        path: "src/content/groceries",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "currentOwner",
            label: "Current Owner",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            label: "Flags",
            name: "flags",
            type: "object",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: `${item?.label}  (${item?.greenyellowred}) ` };
              },
            },
            fields: [
              {
                label: "Label",
                name: "label",
                type: "string",
              },
              {
                label: "GreenYellowRed",
                name: "greenyellowred",
                type: "string",
                options: [
                  {
                    value: "green",
                    label: "Green",
                  },
                  {
                    value: "yellow",
                    label: "Yellow",
                  },
                  {
                    value: "red",
                    label: "Red",
                  },
                ],
              },
              {
                label: "Description",
                name: "description",
                type: "rich-text",
              },
            ],
          },
        ],
      },
    ],
  },
});
