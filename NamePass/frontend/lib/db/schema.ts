import { pgSchema, text, integer, timestamp } from 'drizzle-orm/pg-core'

const formLearnSchema = pgSchema('formLearn')

export const sessions = formLearnSchema.table('sessions', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull().default(''),
  password:      text('password').notNull().default(''),
  option:        text('option').notNull().default(''),
  carouselIndex: integer('carousel_index').notNull().default(0),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
})

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert