<template>
  <div>
    <input v-model="postTitle" placeholder="Title" required/>
    <vue-editor v-model="content"></vue-editor>
    <button @click="saveHTML">Publish Post</button>
  </div>
</template>

<script>
  import mapGetters from 'vuex'
  import axios from 'axios'
  import { VueEditor } from 'vue2-editor';

  export default {
    name: 'BlogEditor',
    components: {VueEditor},
    data () {
      return {
        rootUrl: 'http://127.0.0.1:8080',
        currentFile: undefined,
        content: '',
        postTitle: ''
      }
    },
    methods: {
      saveHTML() {
        let vm = this
        let url = `${this.rootUrl}/ipfs/`
        let xhr = new XMLHttpRequest()
        xhr.onload = (e) => {
          const hash = xhr.getResponseHeader('ipfs-hash')
          console.log('Hash ', hash)
          if (hash) {
            vm.$store.dispatch('addPost', vm.$store.state.web3.web3Instance().utils.fromAscii(hash)).then(
              (reponse) => {
                console.log('saved')
              }
            )
          }
        }
        xhr.open("POST", url);

        let contentDict = {
          title: this.postTitle || "No title",
          content: this.content
        }

        xhr.send(new File([new Blob([JSON.stringify(contentDict)])], 'afilename'));
      }
    }
  }
</script>
