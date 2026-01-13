import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Blog Post",
    plural: "Blog Posts",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "category", "publishedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      label: "Excerpt/Summary",
      admin: {
        description: "Brief summary shown in blog listing (max 200 chars)",
      },
      maxLength: 200,
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      label: "Featured Image",
    },
    {
      name: "content",
      type: "richText",
      required: true,
      label: "Post Content",
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Tutorial", value: "tutorial" },
        { label: "Case Study", value: "case-study" },
        { label: "Insights", value: "insights" },
        { label: "News", value: "news" },
        { label: "Tips & Tricks", value: "tips" },
      ],
    },
    {
      name: "tags",
      type: "array",
      label: "Tags",
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Publish Date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "readingTime",
      type: "number",
      label: "Reading Time (minutes)",
      admin: {
        position: "sidebar",
        description: "Estimated reading time in minutes",
      },
    },
    {
      name: "relatedProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      label: "Related Projects",
    },
  ],
};
