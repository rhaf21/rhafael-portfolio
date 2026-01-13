import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            {
              name: "siteTitle",
              type: "text",
              required: true,
              defaultValue: "Rhafael - Portfolio",
            },
            {
              name: "siteDescription",
              type: "textarea",
              defaultValue:
                "Shopify & WordPress Developer specializing in e-commerce solutions",
            },
            {
              name: "availableForWork",
              type: "checkbox",
              label: "Available for Work",
              defaultValue: true,
            },
          ],
        },
        {
          label: "Hero Section",
          fields: [
            {
              name: "heroGreeting",
              type: "text",
              label: "Greeting",
              defaultValue: "Hi, I'm Rhafael",
            },
            {
              name: "heroTitle",
              type: "text",
              label: "Title",
              defaultValue: "Shopify & WordPress",
            },
            {
              name: "heroSubtitle",
              type: "text",
              label: "Subtitle",
              defaultValue: "Developer",
            },
            {
              name: "heroDescription",
              type: "textarea",
              label: "Description",
              defaultValue:
                "I build high-converting e-commerce stores on Shopify, custom WordPress themes, and modern React applications that drive results for businesses.",
            },
          ],
        },
        {
          label: "About Section",
          fields: [
            {
              name: "aboutTitle",
              type: "text",
              defaultValue: "About Me",
            },
            {
              name: "aboutContent",
              type: "richText",
            },
            {
              name: "profileImage",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "stats",
              type: "array",
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
              ],
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "email",
              type: "email",
            },
            {
              name: "socialLinks",
              type: "array",
              fields: [
                {
                  name: "platform",
                  type: "select",
                  required: true,
                  options: [
                    { label: "GitHub", value: "github" },
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "Twitter", value: "twitter" },
                    { label: "Instagram", value: "instagram" },
                    { label: "YouTube", value: "youtube" },
                  ],
                },
                {
                  name: "url",
                  type: "text",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Resume",
          fields: [
            {
              name: "resumeFile",
              type: "upload",
              relationTo: "media",
              label: "Resume PDF",
              admin: {
                description: "Upload your resume/CV as a PDF file",
              },
            },
            {
              name: "resumeLastUpdated",
              type: "date",
              label: "Last Updated",
              admin: {
                description: "When was this resume last updated?",
              },
            },
          ],
        },
      ],
    },
  ],
};
