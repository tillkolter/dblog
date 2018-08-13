<template>
  <div>
    <template v-if="blogPosts && blogPosts.length > 0">
      <div v-for="post in blogPosts">
          <div v-if="post.pos">{{post.pos + 1}}</div>
          <div v-if="post.title">TITLE: {{post.title}}</div>
          <div v-if="post.content" v-html="post.content"></div>
        <!--</template>-->
      </div>
      {{blogPosts.length}}
    </template>
    <template v-else>
      <div>No blog posts yet</div>
    </template>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'BlogIndex',
    computed: {
      ...mapGetters(['blogPosts'])
    },
    mounted () {
      // this.$store.dispatch('getTopItems', 10)
    }
  }
</script>