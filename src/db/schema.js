import { pgTable, serial, text, timestamp, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// Define match status enum
export const matchStatus = pgEnum('match_status', ['scheduled', 'live', 'finished']);

// Matches table
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatus('status').notNull(),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Commentary table
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').references(() => matches.id).notNull(),
  minute: integer('minute'),
  sequence: integer('sequence'),
  period: text('period'),
  eventType: text('event_type'),
  actor: text('actor'),
  team: text('team'),
  message: text('message'),
  metaData: jsonb('meta_data'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export types for type-safe queries (using JSDoc for JavaScript)
/**
 * @typedef {typeof matches.$inferSelect} Match
 * @typedef {typeof matches.$inferInsert} NewMatch
 * @typedef {typeof commentary.$inferSelect} Commentary
 * @typedef {typeof commentary.$inferInsert} NewCommentary
 */