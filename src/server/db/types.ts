import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm'
import type { PgRelationalQuery } from 'drizzle-orm/pg-core/query-builders/query'
import * as schema from './schema'

type Schema = typeof schema
type TSchema = ExtractTablesWithRelations<Schema>

type IncludeColumns<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['columns']

type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with']

export type InferResultType<
  TableName extends keyof TSchema,
  Columns extends IncludeColumns<TableName> | undefined = undefined,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = Awaited<
  PgRelationalQuery<
    BuildQueryResult<
      TSchema,
      TSchema[TableName],
      {
        columns: Columns
        with: With
      }
    >
  >
>
