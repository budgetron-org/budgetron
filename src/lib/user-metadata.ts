export const USER_METADATA = {
  APP_USER_ID: { key: 'appUserId', type: String() },
} as const

export type UserMetadata = {
  [Key in (typeof USER_METADATA)[keyof typeof USER_METADATA]['key']]: Extract<
    (typeof USER_METADATA)[keyof typeof USER_METADATA],
    { key: Key }
  >['type']
}
