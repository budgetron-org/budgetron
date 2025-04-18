import type { UserMetadata } from '~/lib/user-metadata'
import type { RowData } from '@tanstack/react-table'

declare global {
  // Auth related overrides
  interface CustomJwtSessionClaims {
    metadata: Partial<UserMetadata>
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface UserPublicMetadata extends Partial<UserMetadata> {}

  /**
   * Make all properties in T required
   */
  type NonNullableRequired<T> = {
    [P in keyof T]-?: Exclude<T[P], null | undefined>
  }

  type Nullable<T> = T | null | undefined
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    editable?: boolean | Partial<Record<keyof TData, boolean>>
    updateCellData?: (
      rowIndex: number,
      columnId: keyof TData,
      value: TData[keyof TData],
    ) => void
    updateRowData?: (rowIndex: number, value: TData) => void
  }
}
