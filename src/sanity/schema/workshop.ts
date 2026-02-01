import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Course', value: 'course' },
          { title: 'Service', value: 'service' },
        ],
      },
      initialValue: 'course',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
        ],
      },
      hidden: ({ document }) => document?.type !== 'course',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      hidden: ({ document }) => document?.type !== 'course',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      hidden: ({ document }) => document?.type !== 'course',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ document }) => document?.type !== 'course',
    }),
    defineField({
      name: 'example',
      title: 'Example/Clients',
      type: 'string',
      description: 'e.g. 曾為 Hermès 提供駐場刺繡服務。',
      hidden: ({ document }) => document?.type !== 'service',
    }),
  ],
})
