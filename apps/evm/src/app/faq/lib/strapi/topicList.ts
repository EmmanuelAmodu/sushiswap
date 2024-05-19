import { z } from 'zod'
import { strapi } from './strapi'

const schema = z.array(
  z
    .object({
      id: z.number(),
      attributes: z.object({
        name: z.string(),
        slug: z.string(),
        createdAt: z.string().transform(Date),
        updatedAt: z.string().transform(Date),
        publishedAt: z.string().transform(Date),
      }),
    })
    .transform((data) => ({
      name: data.attributes.name,
      slug: data.attributes.slug,
      url: `/faq/topic/${data.attributes.slug}`,
    })),
)

export type TopicListEntry = z.infer<typeof schema>[number]

export async function getFaqTopicList() {
  const { data } = await strapi.find('faq-topics')

  return schema.parse(data)
}
