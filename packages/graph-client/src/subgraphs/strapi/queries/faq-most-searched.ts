import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../graphql'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants'

export const StrapiFaqMostSearchedQuery = graphql(
  `query FaqMostSearched {
    faqMostSearcheds {
      data {
        id
        attributes {
          faqAnswerGroup {
            data {
              attributes {
                name
                slug
                faqDefaultAnswer {
                  data {
                    attributes {
                      slug
                    }
                  }
                }
                faqCategory {
                  data {
                    attributes {
                      slug
                    }
                  }
                }
              }
            }
          }
        } 
      }
    }
  }`,
)

export type GetFaqMostSearched = VariablesOf<typeof StrapiFaqMostSearchedQuery>

export type FaqMostSearched = Awaited<ReturnType<typeof getFaqMostSearched>>

export async function getFaqMostSearched(
  variables: GetFaqMostSearched = {},
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiFaqMostSearchedQuery,
      variables,
    },
    options,
  )

  if (!result.faqMostSearcheds) {
    throw new Error('Failed to fetch faq most searched')
  }

  const mostSearched = result.faqMostSearcheds.data.map((mostSearched) => ({
    question: mostSearched.attributes.faqAnswerGroup!.data!.attributes.name,
    url: `/faq/${
      mostSearched.attributes.faqAnswerGroup!.data!.attributes.faqCategory.data
        ?.attributes.slug
    }/${mostSearched.attributes.faqAnswerGroup!.data!.attributes.slug}/${
      mostSearched.attributes.faqAnswerGroup.data?.attributes.faqDefaultAnswer
        ?.data?.attributes.slug
    }`,
  }))

  return mostSearched
}
