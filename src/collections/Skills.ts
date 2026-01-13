import type { CollectionConfig } from "payload";

export const Skills: CollectionConfig = {
  slug: "skills",
  labels: {
    singular: "Skill",
    plural: "Skills",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "proficiency", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Frontend", value: "frontend" },
        { label: "Backend", value: "backend" },
        { label: "Tools", value: "tools" },
      ],
    },
    {
      name: "proficiency",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        description: "Proficiency level from 0 to 100",
      },
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
