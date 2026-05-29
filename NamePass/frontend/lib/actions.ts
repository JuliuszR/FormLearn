'use server'

import { db } from './db'
import { sessions } from './db/schema'
import { eq } from 'drizzle-orm'

export async function upsertSession(data: {
  id:            string
  name:          string
  password:      string
  option:        string
  color:         string
  extraText:     string
  age:           number
  birthDate:     string
  phone:         string
  agreed:        boolean
  rating:        number
  bio:           string
  carouselIndex: number
}) {
  await db
    .insert(sessions)
    .values({
      id:            data.id,
      name:          data.name,
      password:      data.password,
      option:        data.option,
      color:         data.color,
      extraText:     data.extraText,
      age:           data.age,
      birthDate:     data.birthDate,
      phone:         data.phone,
      agreed:        data.agreed,
      rating:        data.rating,
      bio:           data.bio,
      carouselIndex: data.carouselIndex,
      updatedAt:     new Date(),
    })
    .onConflictDoUpdate({
      target: sessions.id,
      set: {
        name:          data.name,
        password:      data.password,
        option:        data.option,
        color:         data.color,
        extraText:     data.extraText,
        age:           data.age,
        birthDate:     data.birthDate,
        phone:         data.phone,
        agreed:        data.agreed,
        rating:        data.rating,
        bio:           data.bio,
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
