import * as t from "drizzle-orm/pg-core"
import { defineRelations } from "drizzle-orm"

export const Users = t.pgTable("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  username: t.varchar({ length: 255 }).notNull(),
  age: t.integer().notNull(),
})

export const Accounts = t.pgTable("accounts", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t.integer().notNull().references(() => Users.id),
  refresh_token: t.varchar({ length: 255 }),
  access_token: t.varchar({ length: 255 }),
  expires_at: t.integer(),
  token_type: t.varchar({ length: 255 }),
  scope: t.varchar({ length: 255 }),
  id_token: t.varchar({ length: 255 }),
  session_state: t.varchar({ length: 255 }),
  email: t.varchar({ length: 255 }).notNull().unique(),
})

export const Problems = t.pgTable("problems", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  title: t.varchar({ length: 255 }).notNull(),
  description: t.varchar({ length: 1000 }).notNull(),
  difficulty: t.varchar({ length: 50 }).notNull(),
  solution: t.varchar({ length: 1000 }).notNull(),
})

export const Examples = t.pgTable("examples", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  problemId: t.integer().notNull().references(() => Problems.id),
  input: t.varchar().notNull(),
  output: t.varchar().notNull(),
})

export const Submissions = t.pgTable("submissions", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t.integer().notNull().references(() => Users.id),
  problemId: t.integer().notNull().references(() => Problems.id),
  code: t.varchar().notNull(),
  submittedAt: t.timestamp().notNull().defaultNow(),
  status: t.varchar({ length: 50 }).notNull(),
})

const userRelations = defineRelations({Users, Accounts}, (r) => ({
  Users: {
    account: r.one.Accounts({
      from: r.Users.id,
      to: r.Accounts.userId,
      optional: false,
      alias: 'user_account'
    })
  }
}

))

const problemRelations = defineRelations({Problems, Examples, Submissions}, (r) => ({
  Problems: {
    examples: r.many.Examples({
      from: r.Problems.id,
      to: r.Examples.problemId,
      alias: 'problem_examples'
    }),
    submissions: r.many.Submissions({
      from: r.Problems.id,
      to: r.Submissions.problemId,
      alias: 'problem_submissions'
    })
  }
}))

const submissionRelations = defineRelations({Submissions, Users, Problems}, (r) => ({
  Submissions: {
    user: r.one.Users({
      from: r.Submissions.userId,
      to: r.Users.id,
      optional: false,
      alias: 'submission_user'
    }),
    problem: r.one.Problems({
      from: r.Submissions.problemId,
      to: r.Problems.id,
      optional: false,
      alias: 'submission_problem'
    })
  }
}))

