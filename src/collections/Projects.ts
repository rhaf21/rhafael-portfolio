import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: {
    singular: "Project",
    plural: "Projects",
  },
  orderable: true,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "completedAt"],
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
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "longDescription",
      type: "richText",
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Shopify", value: "shopify" },
        { label: "WordPress", value: "wordpress" },
        { label: "React", value: "react" },
      ],
    },
    {
      name: "techStack",
      type: "array",
      fields: [
        {
          name: "tech",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "gallery",
      type: "array",
      label: "Image Gallery",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "liveUrl",
      type: "text",
      label: "Live URL",
    },
    {
      name: "githubUrl",
      type: "text",
      label: "GitHub URL",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "completedAt",
      type: "date",
      label: "Completed At",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "MMM d, yyyy",
        },
      },
    },
    {
      name: "highlights",
      type: "array",
      fields: [
        {
          name: "highlight",
          type: "text",
          required: true,
        },
      ],
    },
    // Case Study Fields
    {
      name: "caseStudy",
      type: "group",
      label: "Case Study",
      admin: {
        description: "Optional case study format for detailed project pages",
      },
      fields: [
        {
          name: "problem",
          type: "richText",
          label: "The Problem",
          admin: {
            description: "What challenge did the client face?",
          },
        },
        {
          name: "solution",
          type: "richText",
          label: "The Solution",
          admin: {
            description: "How did you solve the problem?",
          },
        },
        {
          name: "results",
          type: "richText",
          label: "The Results",
          admin: {
            description: "What outcomes were achieved?",
          },
        },
        {
          name: "metrics",
          type: "array",
          label: "Key Metrics",
          admin: {
            description: "Quantifiable results (e.g., 50% faster load time)",
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "value",
              type: "text",
              required: true,
            },
            {
              name: "description",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
};
