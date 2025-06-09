'use client'

import { useState } from 'react'

export function UserProfile() {
  const [user] = useState({
    name: 'Ahmed Hossam',
    email: 'me@hoss.link',
    avatar: null
  })

  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
        {user.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="hidden sm:block">
        <div className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {user.name}
        </div>
        <div className="text-xs text-stone-500 dark:text-stone-400">
          {user.email}
        </div>
      </div>
    </div>
  )
} 