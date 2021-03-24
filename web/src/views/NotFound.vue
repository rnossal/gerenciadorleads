<template>
<!-- eslint-disable max-len -->
  <div>
    <div id="error-wrapper">
      <svg id="question-face" viewBox="0 0 48 48">
        <path style="fill:#FFCA28;" d="M45,24c0,11-9,20-20,20S5,35,5,24S14,4,25,4S45,13,45,24z" id="face"/>
        <g style="fill:#F44336;" data-animator-group="true" data-animator-type="1" id="question"><path id="question-path" d="M9.7,18.8c-0.3-1.1-0.4-2-0.3-2.7c0.1-0.7,0.4-1.5,0.9-2.3c0.5-0.8,0.9-1.5,1-1.9s0.1-0.9,0-1.3  C11,9.2,10.2,8.7,9,9.1C8.4,9.2,8,9.5,7.8,10c-0.3,0.4-0.3,1-0.2,1.6l-3.4,0.9C3.8,11,4,9.7,4.7,8.6s1.9-1.9,3.6-2.3  c1.7-0.5,3.1-0.4,4.2,0.1c1.1,0.6,1.9,1.6,2.3,3c0.2,0.7,0.2,1.3,0.1,2c-0.1,0.7-0.5,1.5-1,2.4L13.1,15c-0.4,0.7-0.6,1.5-0.5,2.3  l0.1,0.7L9.7,18.8z M10.4,22.5c-0.1-0.5-0.1-1,0.2-1.4s0.7-0.7,1.2-0.9c0.6-0.2,1.1-0.1,1.5,0.1c0.4,0.2,0.7,0.6,0.9,1.1  c0.1,0.5,0.1,1-0.2,1.4c-0.3,0.4-0.7,0.7-1.3,0.9c-0.6,0.2-1.1,0.1-1.5-0.1C10.8,23.4,10.5,23,10.4,22.5z"/></g>
        <path style="fill:#6D4C41;" d="M26,21c0,2.2-1.8,4-4,4s-4-1.8-4-4s1.8-4,4-4S26,18.8,26,21z" id="l-eye-ball"/>
        <path style="fill:#FFFFFF;" d="M22,19.5c0,0.8-0.7,1.5-1.5,1.5S19,20.3,19,19.5s0.7-1.5,1.5-1.5S22,18.7,22,19.5z" id="l-eye-pupil"/>
        <path style="fill:#6D4C41;" d="M40,21c0,2.2-1.8,4-4,4s-4-1.8-4-4s1.8-4,4-4S40,18.8,40,21z" id="r-eye-ball"/>
        <path style="fill:#FFFFFF;" d="M36,19.5c0,0.8-0.7,1.5-1.5,1.5S33,20.3,33,19.5s0.7-1.5,1.5-1.5S36,18.7,36,19.5z" id="r-eye-pupil"/>
        <path style="fill:#B76C09;" d="M20.9,36.5l-1.7-1c0.1-0.2,3.4-5.5,8.9-5.5c4.3,0,5.8,3.4,5.9,3.6l-1.8,0.8c0-0.1-1.1-2.4-4.1-2.4  C23.7,32,20.9,36.5,20.9,36.5z" id="mouth"/>
      </svg>
      <h1 id="not-found-title">Algo está errado aqui...</h1>
      <p id="not-found-content" >A página que você está tentando acessar não existe. Volte para o início e continue a partir de lá.</p>
      <Button id="home-button" type="primary" icon="ios-home" size="large" to="/">Início</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style lang="less">
#error-wrapper {
  width: 550px;
  margin: 0 auto;
}

#not-found-title {
  font-size: 30px;
  margin: 30px 0 5px 0;
  font-weight: bold;
}

#not-found-content {
  font-size: 14px;
  margin-bottom: 25px;
}

#question-face {
  margin-top: -30px;
  max-width: 300px;
  float: right;
}

@-webkit-keyframes question_Animation {
  0% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(0deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px) rotate(0deg)
      translate(-9.480908870697021px, -14.890146732330322px);
  }
  10% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  20% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  30% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  40% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  50% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  60% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  70% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  80% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  90% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  100% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(0deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px) rotate(0deg)
      translate(-9.480908870697021px, -14.890146732330322px);
  }
}

@keyframes question_Animation {
  0% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(0deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px) rotate(0deg)
      translate(-9.480908870697021px, -14.890146732330322px);
  }
  10% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  20% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  30% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  40% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  50% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  60% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  70% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  80% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(-20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  90% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(20deg) translate(-9.480908870697021px, -14.890146732330322px);
  }
  100% {
    -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
      rotate(0deg) translate(-9.480908870697021px, -14.890146732330322px);
    transform: translate(9.480908870697021px, 14.890146732330322px) rotate(0deg)
      translate(-9.480908870697021px, -14.890146732330322px);
  }
}

#question-face * {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-timing-function: cubic-bezier(0, 0, 1, 1);
  animation-timing-function: cubic-bezier(0, 0, 1, 1);
}

#question {
  -webkit-animation-name: question_Animation;
  animation-name: question_Animation;
  -webkit-transform: translate(9.480908870697021px, 14.890146732330322px)
    rotate(0deg) translate(-9.480908870697021px, -14.890146732330322px);
  transform: translate(9.480908870697021px, 14.890146732330322px) rotate(0deg)
    translate(-9.480908870697021px, -14.890146732330322px);
  -webkit-animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
}
</style>
