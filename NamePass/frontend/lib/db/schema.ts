import { pgSchema, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

const formLearnSchema = pgSchema('formLearn')

export const sessions = formLearnSchema.table('sessions', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull().default(''),
  password:      text('password').notNull().default(''),
  option:        text('option').notNull().default(''),
  color:         text('color').notNull().default(''),
  extraText:     text('extra_text').notNull().default(''),
  age:           integer('age').notNull().default(0),
  birthDate:     text('birth_date').notNull().default(''),
  phone:         text('phone').notNull().default(''),
  agreed:        boolean('agreed').notNull().default(false),
  rating:        integer('rating').notNull().default(0),
  bio:           text('bio').notNull().default(''),
  carouselIndex: integer('carousel_index').notNull().default(0),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
})

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
