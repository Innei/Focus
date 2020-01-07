<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-bg">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h1>oops!</h1>
      <h2>Page Not Found</h2>
      <nuxt-link to="/">go home</nuxt-link>
      <a href="javascript:history.go(-1)">go back</a>
    </div>
  </div>
</template>
<script>
export default {
  head: {
    titleTemplate: '404 - Focus'
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}

#notfound {
  position: relative;
  height: 100vh;
  background-color: #fafbfd;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.notfound {
  max-width: 520px;
  width: 100%;
  text-align: center;
}

.notfound .notfound-bg {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: -1;
}

.notfound .notfound-bg > div {
  width: 100%;
  background: #fff;
  border-radius: 90px;
  height: 125px;
}

.notfound .notfound-bg > div:nth-child(1) {
  box-shadow: 5px 5px 0px 0px #f3f3f3;
}

.notfound .notfound-bg > div:nth-child(2) {
  transform: scale(1.3);
  box-shadow: 5px 5px 0px 0px #f3f3f3;
  position: relative;
  z-index: 10;
}

.notfound .notfound-bg > div:nth-child(3) {
  box-shadow: 5px 5px 0px 0px #f3f3f3;
  position: relative;
  z-index: 90;
}

.notfound h1 {
  font-family: 'Quicksand', sans-serif;
  font-size: 86px;
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 8px;
  color: #151515;
}

.notfound h2 {
  font-family: 'Quicksand', sans-serif;
  font-size: 26px;
  margin: 0;
  font-weight: 700;
  color: #151515;
}

.notfound a {
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  text-decoration: none;
  text-transform: uppercase;
  background: #18e06f;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  margin-top: 20px;
}

.notfound-social {
  margin-top: 20px;
}

.notfound-social > a {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 40px;
  font-size: 14px;
  color: #fff;
  background-color: #dedede;
  margin: 3px;
  padding: 0px;
  transition: 0.2s all;
}
.notfound-social > a:hover {
  background-color: #18e06f;
}

@media only screen and (max-width: 767px) {
  .notfound .notfound-bg {
    width: 287px;
    margin: auto;
  }

  .notfound .notfound-bg > div {
    height: 85px;
  }
}

@media only screen and (max-width: 480px) {
  .notfound h1 {
    font-size: 68px;
  }

  .notfound h2 {
    font-size: 18px;
  }
}
/* vietnamese */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/quicksand/v19/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkBgv58m-xDwxUD2GF9Zc.woff)
    format('woff');
  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/quicksand/v19/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkBgv58i-xDwxUD2GF9Zc.woff)
    format('woff');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/quicksand/v19/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkBgv58a-xDwxUD2GFw.woff)
    format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}
</style>
