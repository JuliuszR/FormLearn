'use client'
import { useState, useEffect } from 'react'
import { getSession, upsertSession } from './actions'

const SESSION_KEY = 'session-id'

function generateId() {
  return crypto.randomUUID()
}

export type SessionData = {
  name:          string
  password:      string
  option:        string
  carouselIndex: number
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<SessionData | null>(null)


  useEffect(() => {
    const init = async () => {
      let id = localStorage.getItem(SESSION_KEY)

      if (!id) {
        id = generateId()
        localStorage.setItem(SESSION_KEY, id)
      }
      setSessionId(id)

      const session = await getSession(id)

      if (session) {
        setInitialData({
          name:          session.name,
          password:      session.password,
          option:        session.option,
          carouselIndex: session.carouselIndex,
        })
      }

    }

    init()
  }, [])

  const save = async (data: SessionData) => {
    if (!sessionId) return
    await upsertSession({ id: sessionId, ...data })
  }

  return { sessionId, initialData, save }
}