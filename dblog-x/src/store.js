import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//
// import Web3 from 'web3'

import getWeb3 from './getWeb3'

const jsonInterface = require('../../build/contracts/BlogIndex.json')

export default new Vuex.Store({
  state: {
    address: '0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4',
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      coinbase: null,
      balance: null,
      error: null
    }
  },
  mutations: {
    SET_CONTRACT (state, address) {
      state.address = address
    },
    registerWeb3Instance (state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.coinbase = result.coinbase
      web3Copy.networkId = result.networkId
      web3Copy.balance = parseInt(result.balance, 10)
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
    }
  },
  actions: {
    getTopItems: (context, size) => new Promise((resolve, reject) => {
      const w3 = context.state.web3.web3Instance()
      const c = new w3.eth.Contract (jsonInterface.abi, context.state.address)

      const hello = c.methods.isEmpty().call()

      // (error, result) => {
      //   console.log('isEMpty ' + result)
      //   let items = c.methods.get(size).call(function(e, r){
      //     console.log('rrr' + r)
      //     console.log (items)
      //     resolve(items)
      //   })
      // })
      console.log('hello ' + hello)
    }),
    registerWeb3: ({commit}) => new Promise((resolve, reject) => {
      console.log('registerWeb3 Action being executed')
      getWeb3.then(result => {
        console.log('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
        resolve()
      }).catch(e => {
        console.log('error in action registerWeb3', e)
      })
    })
  }
})
