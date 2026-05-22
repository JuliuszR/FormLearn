'use server'

import { db } from './db'
import { sessions } from './db/schema'
import { eq } from 'drizzle-orm'

export async function upsertSession(data: {
  id:            string
  name:          string
  password:      string
  option:        string
  carouselIndex: number
}) {
  await db
    .insert(sessions)
    .values({
      id:            data.id,
      name:          data.name,
      password:      data.password,
      option:        data.option,
      carouselIndex: data.carouselIndex,
      updatedAt:     new Date(),
    })
    .onConflictDoUpdate({
      target: sessions.id,
      set: {
        name:          data.name,
        password:      data.password,
        option:        data.option,
        carouselIndex: data.carouselIndex,
        updatedAt:     new Date(),
      },
    })
}

export async function getSession(id: string) {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, id),
  })
  return session ?? null
}