<template>
  <div
    class="tagBall"
    ref="tagBall"
    @mouseover.self.stop="mouseOver"
    @mouseleave.self.stop="mouseLeave"
  >
    <p v-for="(item, index) in tagsDTO" :key="index" class="tag">{{ item }}</p>
  </div>
</template>

<script setup>
let tagEle;
let paper = "";
const RADIUS = 150;
const fallLength = 500;
const tagsDTO = ["Python", "Java", "C++", "C", "Go", "Matlab"];
const tags = [];
let angleX = Math.PI / fallLength;
let angleY = Math.PI / fallLength;
let CX = "";
let CY = "";
let EX = "";
let EY = "";
let timing = null;
const tagBall = ref();
const init = () => {
  for (let i = 0; i < tagEle.length; i++) {
    let a, b;
    const k = (2 * (i + 1) - 1) / tagEle.length - 1;
    a = Math.acos(k);
    b = a * Math.sqrt(tagEle.length * Math.PI);
    const x = RADIUS * Math.sin(a) * Math.cos(b);
    const y = RADIUS * Math.sin(a) * Math.sin(b);
    const z = RADIUS * Math.cos(a);
    tagEle[i].style.color =
      "rgb(" +
      parseInt(Math.random() * 255) +
      "," +
      parseInt(Math.random() * 255) +
      "," +
      parseInt(Math.random() * 255) +
      ")";
    tags.push({ ele: tagEle[i], x, y, z });
  }
};
const tag = ({ ele, x, y, z }) => {
  const scale = fallLength / (fallLength - z);
  const alpha = (z + RADIUS) / (2 * RADIUS);
  ele.style.fontSize = 15 * scale + "px";
  ele.style.opacity = alpha + 0.5;
  ele.style.filter = "alpha(opacity = " + (alpha + 0.5) * 100 + ")";
  ele.style.zIndex = parseInt(scale * 100);
  ele.style.left = x + CX - ele.offsetWidth / 2 + "px";
  ele.style.top = y + CY - ele.offsetHeight / 2 + "px";
};
const rotateX = () => {
  const cos = Math.cos(angleX);
  const sin = Math.sin(angleX);
  tags.forEach((item) => {
    const y1 = item.y * cos - item.z * sin;
    const z1 = item.z * cos + item.y * sin;
    item.y = y1;
    item.z = z1;
  });
};
const rotateY = () => {
  const cos = Math.cos(angleY);
  const sin = Math.sin(angleY);
  tags.forEach((item) => {
    const x1 = item.x * cos - item.z * sin;
    const z1 = item.z * cos + item.x * sin;
    item.x = x1;
    item.z = z1;
  });
};
const animate = () => {
  timing = setInterval(() => {
    rotateX();
    rotateY();
    tags.forEach((item) => {
      tag(item);
    });
  }, 20);
};
const mouseOver = (event) => {
  const x = event.clientX - EX - CX;
  const y = event.clientY - EY - CY;
  console.log(x, y);
  angleY = x * 0.0001;
  angleX = y * 0.0001;
  if (!timing) animate();
};
const mouseLeave = (event) => {
  const x = event.clientX - EX - CX;
  const y = event.clientY - EY - CY;
  angleY = x * 0.0001;
  angleX = y * 0.0001;
};

onMounted(() => {
  tagEle = tagBall.value.children;
  paper = tagBall.value;
  CX = paper.offsetWidth / 2;
  CY = paper.offsetHeight / 2;
  EX =
    paper.offsetLeft +
    document.body.scrollLeft +
    document.documentElement.scrollLeft;
  EY =
    paper.offsetTop +
    document.body.scrollTop +
    document.documentElement.scrollTop;
  init();
  animate();
});
</script>

<style scoped>
.tagBall {
  width: 100%;
  height: 300px;
  margin: 25px auto;
  position: relative;
}
.tag {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  color: #000;
  text-decoration: none;
  font-size: 15px;
  font-weight: bold;
}
</style>
