import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: {
    singular: "Testimonial",
    plural: "Testimonials",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "featured", "createdAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Client Name",
    },
    {
      name: "role",
      type: "text",
      label: "Role/Title",
    },
    {
      name: "company",
      type: "text",
      label: "Company",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      label: "Avatar/Photo",
    },
    {
      name: "quote",
      type: "textarea",
      required: true,
      label: "Testimonial Quote",
    },
    {
      name: "project",
      type: "relationship",
      relationTo: "projects",
      label: "Related Project",
      admin: {
        description: "Optionally link this testimonial to a specific project",
      },
    },
    {
      name: "rating",
      type: "number",
      min: 1,
      max: 5,
      label: "Rating (1-5 stars)",
      admin: {
        step: 1,
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      label: "Featured on Homepage",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Display Order",
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first",
      },
    },
  ],
};
