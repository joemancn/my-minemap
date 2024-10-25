<template>
    <div class="map-main-view" ref="container"></div>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, ref } from "vue";

const container = ref()
// 动画渲染
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update()
    renderer.render(scene, camera);
}

let cube, renderer, camera, scene, controls
onMounted(() => {
    // console.log(container.value.getBoundingClientRect().width);
    // console.log(window.innerWidth);
    // console.log(container.value.clientWidth);
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.value.getBoundingClientRect().width / container.value.getBoundingClientRect().height, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.value.getBoundingClientRect().width, container.value.getBoundingClientRect().height);
    container.value.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    cube = new THREE.Mesh(geometry, material);

    
    scene.add(cube);

    camera.position.z = 5;

    controls = new OrbitControls(camera, renderer.domElement);
    // 控制器阻尼感
    controls.enableDamping = true

    // 监听画面变化，更新渲染画面
    window.addEventListener('resize', function (event) {
        // 更新摄像头
        camera.aspect = container.value.getBoundingClientRect().width / container.value.getBoundingClientRect().height
        // 更新投影几的投影矩阵
        camera.updateProjectionMatrix()
        // 更新渲染器尺寸
        renderer.setSize(container.value.getBoundingClientRect().width, container.value.getBoundingClientRect().height)
        // 设置当前设备的像素比,pc和移动端区别
        renderer.setPixelRatio(window.devicePixelRatio)
    })

    animate()
})
</script>

<style lang="scss" scoped>
.map-main-view {
    height: 100%;
}
</style>