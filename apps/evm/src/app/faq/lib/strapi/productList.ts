import { z } from 'zod'
import { imageSchema } from './image'
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
        image: imageSchema,
      }),
    })
    .transform((data) => ({
      name: data.attributes.name,
      slug: data.attributes.slug,
      url: `/faq/product/${data.attributes.slug}`,
      image: data.attributes.image,
    })),
)

export type ProductListEntry = z.infer<typeof schema>[number]

export async function getFaqProductList() {
  const { data } = await strapi.find('faq-products', {
    fields: ['id', 'name', 'slug', 'createdAt', 'updatedAt', 'publishedAt'],
    populate: 'image',
  })

  return schema.parse(data)
}
