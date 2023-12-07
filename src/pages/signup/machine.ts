
import { createMachine } from 'xstate'

type Context = {
  email: string
  password: string
  otp: string

  otpResendRemindSeconds: number
}

type Event = { type: 'CONFIRM_EMAIL' } | { type: 'CONFIRM_PASSWORD' }

type Type = {
  context: Context
  event: Event
}

const signupMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwJZQHYFcAOA6SKALiulAKIC2AhigDYDEAwgPIByAYgJIBKAsgPpleAQU4AZANoAGALqJQ2APapii9PJAAPRAFYAzABZcBgGwBGU2YAcO0yb1WANCACeiK1NwAmL1YMBOL38dLz1-fzCAX0jnVAwcfAgiEigABSpYWAB3RQAnCCY2Lj5+VOEAZXKAdWZuABFpOSQQJRUUNQ1tBCsvE1wpPwMvMxMIqRCTZzcEaytcAHZ-KXnRqzM9ExMrG2jYtCw8AmJSZgAVVNwUCFowenKyVjr+M9TGjVbkjuauqz0dYwsenmvxGXnmBimiAMek8ZnC4QM+l8Zl6uxAcQOiWSJ3OuFgYHQhHo3DI91Ob2aH1U6m+7hM-zMOnpoRMph082skIQQP8uFG4Vs4S8OjMKLRGISRxSLzxBKJmlghCohDAuCoADMVbkABRmKT6gCU9AlhySxygMvxhIpCmUnxpoC6-nmnmBjPMFk2-is8y5Dk8-PCfi80Od-hM4v2krN0vOhQ4PAELxtLTt1M6UOsuB03v5LpWUjBOj98y8uDCPqkwSs1fpkfieAAxrkwMqUsJG43FJhCUwScJTmQGrJ3mn2g6tIgRvNcIygQZFr52bZJq5dEFy8KTGCxvqgfXMc3W+aO12e0T2KIxEOU1TxxmEDP5npGUy9H8Vn4pHouZ4Xz5-AMKQAiZUZmXmA9o2xKBWCoChblYYReDIfgWATPgbxHSkxy+R0oWBBYpEZX5RgCPVizXBB6U8Z1nxhPQQ3GHxINNaDhAAN2VKhcnoYQADUB2EbhUKKRNMKaW02lwydH3DXAbHZYJzAMAwrHpLlwT6GE4Q5FTtP3GJ0SjVjzTqRRqBIeg6mYEROFYET0OQ4cJNTKSJy6UxeVGT9xmdaw-i5NSjCBcZVPDYV-JYrFzQAIXaegYs4ZgHOKJzbxw9ypwMMx+h9d8ej+ekwh-SjvS8tZ-AsZ9oV+CDDJNaLY1SBLhEYABpdK3IfFFwQWDkVm3EM1l8P0PFncNllZEZEWyqKpVIdJMhyfIWvazr7QfH05nMasfCrdYFy5FFcEA7KBnsFTFhMFY5pjUhYPgu42s4V4sMkjbaQQABaMwCP9EwBmdEJvScSigvLF0cx8IZhXCW62M4pUePKZ7Xpcu9pK6FFzGzbHEV6RdGUC37ZwCKtVJ8XodHh0zzJodAnpe9b00+mwZ16LxgICREdAGX1Sv0XGQnZYVsoiPQaZSOLFEZtHRy6z6vs54x5nBVTVKIxF1LB1kId86GfBzfxokM9BFAgOANBNeWPrw76fC0jwAZreZge2Lkvp9WcfRdVTgc0iN6uMxrSEoGhaBtlm7YYvRZ2AxYPBzKRWVXaYxp8GxRRU8CvElhaMmyPIIEj+9WdU+T6S2IbCx5DSy1OvU1MMBdwysPOLXOEvMcQVYTosIZlkLaiIUooIyzhAVGJCXpA72BsQ47i4rhuLvMsfUw+5UzmXSp4CuRhvkRnpUxyd8cN28tOVV4fXN+mIsJvWfMx9-fcb4URBjhtnoz56PNtSFPN2Qk19PqAmMJNMI1drpAhLGWCs11ehEXfFWCWQd57zRgnBMAIC7ZgIGCiT0mwFzbhKtMVk-x2RnWykBYYdU56YgwRxLiuQcEyV+LHQeFVfqij8PzMhGx+jQirKyeETI6E-wYXdKAZkLITgxmvHovJlgLjhPqfQC5SF0mCpDGwwRljgnbtLVhWNrreA-KMBwIRVZ8K0XrWwNZtwil+FFayrAyDGKnLrEUL44RAhzEyIYR0qwzl+EBV2PMlhMhNpEIAA */
  id: 'signup',
  types: {} as {
    context: Context,
    event: Event,
    guards: {
      type: 'isTimerDone',
    }
  },
  context: {
    email: '',
    password: '',
    otp: '',
    otpResendRemindSeconds: 0
  },
  initial: "editingEmail",
  states: {
    editingEmail: {
      on: {
        CONFIRM_EMAIL: 'editingPassword'
      }
    },

    editingPassword: {
      on: {
        CONFIRM_PASSWORD: "editingOTP",
        BACK: "editingEmail"
      }
    },

    editingOTP: {
      states: {
        idle: {
          on: {
            SEND_OTP: "sent"
          }
        },

        sent: {
          after: {
            "1000": {
              target: '#signup.editingOTP.sent',
            }
          },

          on: {
            RESET: {
              target: "idle",
              guard: "isTimerDone"
            }
          }
        }
      },

      initial: "idle",

      on: {
        CONFIRM_OTP: "creatingAccount",
        BACK: "editingPassword"
      }
    },

    creatingAccount: {
      on: {
        CREATED: "editingName",
        FAILED: "editingEmail"
      }
    },

    editingName: {
      on: {
        NAME_CONFIRMED: "editingAvatar",
        SKIP: "DONE"
      }
    },

    editingAvatar: {
      on: {
        AVATAR_CONFIRMED: "editingDomain",
        SKIP: "DONE"
      }
    },

    editingDomain: {
      on: {
        DOMAIN_CONFIRMED: "editingBio",
        SKIP: "DONE"
      }
    },

    editingBio: {
      on: {
        BIO_CONFIRMED: "DONE",
        SKIP: "DONE"
      }
    },

    DONE: {
      type: "final"
    }
  }
}, {
  guards: {
    isTimerDone({ context }) {
      return context.otpResendRemindSeconds === 0
    }
  }
})

export default signupMachine