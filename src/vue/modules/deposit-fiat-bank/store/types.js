const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ASSETS: 'SET_ASSETS',
  SET_FEES: 'SET_FEES',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSETS: 'LOAD_ASSETS',
  LOAD_FEES: 'LOAD_FEES',
}

const getters = {
  balances: 'balances',
  assets: 'assets',
  depositableFiatAssets: 'depositableFiatAssets',
  fees: 'fees',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
