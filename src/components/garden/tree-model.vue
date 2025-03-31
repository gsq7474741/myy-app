<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 导入模型文件
import TreeModelNormGLB from '@/assets/models/norm/norm.glb';
// 注意：bin文件会由GLTFLoader自动加载，不需要显式导入

const props = defineProps({
  isWatering: {
    type: Boolean,
    default: false
  },
  modelType: {
    type: String,
    default: 'glb' // 可选值: 'glb', 'gltf'
  },
  animationSpeed: {
    type: Number,
    default: 1 // 动画速度倍率，1.0为正常速度
  }
});

// Three.js 相关变量
const treeContainer = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let treeModel: THREE.Group;
let animationFrameId: number;
let mixer: THREE.AnimationMixer | null = null; // 动画混合器
let animations: THREE.AnimationClip[] = []; // 存储动画片段
let clock = new THREE.Clock(); // 用于动画计时

// 初始化Three.js场景
const initThreeJS = () => {
  if (!treeContainer.value) return;
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = null; // 透明背景
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 3.5; // 将相机位置从2上移到4
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const containerWidth = treeContainer.value.clientWidth;
  const containerHeight = treeContainer.value.clientHeight;
  renderer.setSize(containerWidth, containerHeight); // 使用容器的实际尺寸
  renderer.setClearColor(0x000000, 0); // 透明背景
  
  // 添加渲染器到DOM
  treeContainer.value.appendChild(renderer.domElement);
  
  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // 添加顶光
  const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
  topLight.position.set(0, 10, 0); // 从正上方照射
  topLight.castShadow = true; // 启用阴影
  scene.add(topLight);
  
  // 根据modelType加载不同类型的模型
  loadModel(props.modelType);
};

// 加载模型函数
const loadModel = (modelType: string) => {
  // 清除之前的模型和动画
  if (treeModel) {
    scene.remove(treeModel);
    if (mixer) {
      mixer = null;
    }
  }
  
  if (modelType === 'glb') {
    loadGLBModel();
  } else if (modelType === 'gltf') {
    loadGLTFModel();
  }
};

// 加载GLB模型
const loadGLBModel = () => {
  const loader = new GLTFLoader();
  
  loader.load(TreeModelNormGLB, (gltf) => {
    treeModel = gltf.scene;
    
    // 调整模型位置和大小
    treeModel.scale.set(1, 0.95, 1);
    treeModel.position.y = -1.5;
    
    // 处理动画
    if (gltf.animations && gltf.animations.length > 0) {
      animations = gltf.animations;
      mixer = new THREE.AnimationMixer(treeModel);
      
      // 播放所有动画并应用速度
      animations.forEach((clip) => {
        if (mixer) { // 添加null检查
          const action = mixer.clipAction(clip);
          action.setEffectiveTimeScale(props.animationSpeed); // 设置动画速度
          action.play();
        }
      });
    }
    
    scene.add(treeModel);
    animate();
  }, undefined, (error) => {
    console.error('加载GLB模型出错:', error);
  });
};

// 加载GLTF+BIN模型
const loadGLTFModel = () => {
  const loader = new GLTFLoader();
  
  loader.load(TreeModelNormGLTF, (gltf) => {
    treeModel = gltf.scene;
    
    // 调整模型位置和大小
    treeModel.scale.set(0.2, 0.2, 0.2);
    treeModel.position.y = -1.5;
    
    // 处理动画
    if (gltf.animations && gltf.animations.length > 0) {
      animations = gltf.animations;
      mixer = new THREE.AnimationMixer(treeModel);
      
      // 播放所有动画并应用速度
      animations.forEach((clip) => {
        if (mixer) { // 添加null检查
          const action = mixer.clipAction(clip);
          action.setEffectiveTimeScale(props.animationSpeed); // 设置动画速度
          action.play();
        }
      });
    }
    
    scene.add(treeModel);
    animate();
  }, undefined, (error) => {
    console.error('加载GLTF模型出错:', error);
  });
};

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  // 更新动画混合器
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }
  
  // 添加额外的旋转
  if (treeModel) { // 确保treeModel存在
    treeModel.rotation.y += 0.0005; 
  }
  
  controls.update();
  renderer.render(scene, camera);
};

// 处理窗口大小变化
const handleResize = () => {
  if (!camera || !renderer || !treeContainer.value) return;
  
  const width = treeContainer.value.clientWidth;
  const height = treeContainer.value.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
};

// 监听animationSpeed属性变化，更新动画速度
watch(() => props.animationSpeed, (newValue) => {
  if (mixer && animations.length > 0) {
    // 更新所有动画的速度
    animations.forEach((clip) => {
      if (mixer) { 
        const action = mixer.clipAction(clip);
        action.setEffectiveTimeScale(newValue);
      }
    });
  }
});

// 监听modelType变化，重新加载模型
watch(() => props.modelType, (newValue) => {
  loadModel(newValue);
});

onMounted(() => {
  initThreeJS();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  window.removeEventListener('resize', handleResize);
  
  // 清理Three.js资源
  if (renderer) {
    renderer.dispose();
    if (treeContainer.value) {
      treeContainer.value.removeChild(renderer.domElement);
    }
  }
  
  if (treeModel) {
    scene.remove(treeModel);
  }
  
  if (controls) {
    controls.dispose();
  }
});
</script>

<template>
  <div class="tree-model-container" ref="treeContainer"></div>
</template>

<style scoped>
.tree-model-container {
  width: 350px;
  height: 350px;
  margin: 0 auto;
}

.tree-model-container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
