<template>
  
<dropdown class="my-dropdown-toggle"
          :options="arrayOfObjects" 
          :selected="object" 
          v-on:updateOption="methodToRunOnSelect" 
          :placeholder="'เลือกผู้ใช้'"
          :closeOnOutsideClick="true">
</dropdown>
</template>
 
<script>
import dropdown from 'vue-dropdowns';

export default {
        data() {
          return {
            arrayOfObjects: [{
                name: 'farmer1',
            },
            {
                name: 'farmer2',
            },
            {
                name: 'cert1',
            },
            {
                name: 'school1',
            }],
            object: {
              name: this.user,
            }
          }
        },
        created(){
          this.object = this.$store.state.user
        },
        computed: {
    user () {
      return this.$store.state.user
    }
  },
 
        components: {
            'dropdown': dropdown,
        },
 
        methods: {
          methodToRunOnSelect(payload) {
            this.$store.commit('setUser', payload.name)
            console.log(this.$store.state.user);
            // this.object = payload;
          }
        }
      }
</script> 
 
