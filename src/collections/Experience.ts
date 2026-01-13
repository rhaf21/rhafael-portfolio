import type { CollectionConfig } from "payload";

export const Experience: CollectionConfig = {
  slug: "experience",
  labels: {
    singular: "Experience",
    plural: "Experience",
  },
  admin: {
    useAsTitle: "company",
    defaultColumns: ["company", "role", "startDate", "isCurrent"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "startDate",
      type: "date",
      required: true,
      label: "Start Date",
      admin: {
        date: {
          pickerAppearance: "monthOnly",
          displayFormat: "MMM yyyy",
        },
      },
    },
    {
      name: "endDate",
      type: "date",
      label: "End Date",
      admin: {
        date: {
          pickerAppearance: "monthOnly",
          displayFormat: "MMM yyyy",
        },
        condition: (data) => !data?.isCurrent,
      },
    },
    {
      name: "isCurrent",
      type: "checkbox",
      label: "Currently Working Here",
      defaultValue: false,
      admin: {
        position: "sidebar",
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
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first",
        position: "sidebar",
      },
    },
  ],
};
