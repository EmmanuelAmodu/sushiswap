'use client'

import { classNames } from '@sushiswap/ui'
import React from 'react'
import { GovernanceItem } from '../lib'

export function GovernanceItemCard(props: GovernanceItem) {
  const { type, title, isActive, url } = props
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="!h-fit rounded-lg border border-slate-700/60 p-4">
        <div className="transition-transform ease-in-out hover:scale-[102%]">
          <div className="flex items-center gap-2">
            <div className={classNames('h-2 w-2 rounded-sm', type.color)} />
            <span className="text-xs text-slate-400">{type.title}</span>
          </div>
          <h3 className="mt-2 h-12 line-clamp-2">{title}</h3>

          <div className="mt-4 flex gap-2">
            {isActive && (
              <div className="flex h-6 w-fit items-center rounded-full bg-[#243C2E] px-2 text-xs text-[#34D399]">
                Active
              </div>
            )}
            <div className="flex h-6 w-fit items-center rounded-full bg-slate-700 px-2 text-xs text-slate-300">
              {type.title}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}
