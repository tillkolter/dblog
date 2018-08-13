<template>
  <div>

  </div>
</template>

<script>
  import mapGetters from 'vuex'

  export default {
    neme: 'BlogIndex',
    // computed: {
    //   ...mapGetters([''])
    // },
    mounted () {
      let vm = this
      this.$store.dispatch('registerWeb3').then(
        () => {
          vm.$store.dispatch('getTopItems', 0).then(
            (items) => {
              console.log('L'+items.length)
            }
          )
        }
      ).catch((error) => {
        console.log('error ' + error)
      })
    }
  }
</script>
