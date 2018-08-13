import Vue from 'vue'
import Vuex from 'vuex'

Vue.use (Vuex)

import getWeb3 from './getWeb3'

const jsonInterface = require ('../../build/contracts/BlogIndex.json')

export default new Vuex.Store ({
  state: {
    address: '0xb9b7e0cb2edf5ea031c8b297a5a1fa20379b6a0a',
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      coinbase: null,
      balance: null,
      error: null
    },
    blogIndex: {
      isEmpty: true
    },
    blogPosts: []
  },
  mutations: {
    SET_CONTRACT(state, address) {
      state.address = address
    },
    SET_TOP_POSTS(state, posts) {
      state.blogPosts = posts
    },
    UPDATE_BLOG_EMPTY(state, empty) {
      state.blogIndex.isEmpty = empty
    },
    UPDATE_BLOG_POST (state, args) {
      let {pos, content} = args
      const posts = state.blogPosts
      posts[pos] = Object.assign({}, args)
      state.blogPosts = posts.slice()
    },
    registerWeb3Instance(state, payload) {
      console.log ('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.coinbase = result.coinbase
      web3Copy.networkId = result.networkId
      web3Copy.balance = parseInt (result.balance, 10)
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
    }
  },
  actions: {
    getTopItems: ({commit, state}, size) => new Promise ((resolve, reject) => {
      const w3 = state.web3.web3Instance ()
      const c = new w3.eth.Contract (jsonInterface.abi, state.address)

      c.methods.getLength ().call ((a, length) => {
        let posts = []
        if (length > 0) {
          for (let i = 0; i < length && i < size; i++) {
            let pos = length-i-1
            posts.push ({content: '<p>fuyck</p>', pos: pos})
            console.log('fuck ' + pos)
            c.methods.get (pos).call ((error, result) => {
              let hash = w3.utils.toAscii (result)
              fetch(`https://ipfs.io/ipfs/${hash}`)
                .then((response) => {
                  response.text().then(
                    (text) => {
                      try {
                        let parsed = JSON.parse(text)
                        let contentDict = {
                          pos: i,
                          content: parsed.content,
                          title: parsed.title
                        }
                        commit('UPDATE_BLOG_POST', contentDict)
                      } catch (e) {
                        console.log(e)
                      }
                    }
                  )
                })
            })
          }
        }
        commit ('SET_TOP_POSTS', posts)
      })

    }),
    registerWeb3: ({commit}) => new Promise ((resolve, reject) => {
      console.log ('registerWeb3 Action being executed')
      getWeb3.then (result => {
        console.log ('committing result to registerWeb3Instance mutation')
        commit ('registerWeb3Instance', result)
        resolve ()
      }).catch (e => {
        console.log ('error in action registerWeb3', e)
      })
    }),
    addPost: ({state, commit}, hash) => new Promise ((resolve, reject) => {
      const w3 = state.web3.web3Instance ()
      const c = new w3.eth.Contract (jsonInterface.abi, state.address)

      console.log('Save post ' + hash)
      c.methods.addPost(hash).estimateGas({from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'}).then(
        (gas) => {
          const post = c.methods.addPost (hash).send ({
            from: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
            gas: Math.floor(gas + gas/10)
          }, (a, result) => {
            console.log (`${a} xxxx ${result}`)
            // commit('UPDATE_BLOG_EMPTY', result)
          })
        }
      )
    })
  },
  getters: {
    blogPosts: (state) => state.blogPosts
  }
})
