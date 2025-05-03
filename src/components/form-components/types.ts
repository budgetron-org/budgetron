/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldApi as TanstackFormFieldApi } from '@tanstack/react-form'

export type FieldApi<Value extends string | Date | File | undefined> =
  TanstackFormFieldApi<
    any,
    string,
    Value,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
