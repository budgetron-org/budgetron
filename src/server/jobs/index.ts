const JobRegistry = Object.freeze({
  async ['sync-currency-rates']() {
    const { runCurrencyRateSync } = await import('./run-currency-rate-sync')
    await runCurrencyRateSync()
  },
})

export { JobRegistry }
