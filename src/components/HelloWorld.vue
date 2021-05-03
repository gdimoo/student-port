<template>
  <div class="hello">
            <div id="nav">
      <ul>
        <li><router-link to="/login">login</router-link></li>
        <li><router-link to="/login">ข้อมูลส่วนตัว</router-link></li>
        <li><router-link to="/login">SCAN</router-link></li>
        <li><router-link to="/produc">การผลิต</router-link></li>
        <li><router-link to="/" class="active">Home</router-link></li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
