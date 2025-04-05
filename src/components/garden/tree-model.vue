<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import LightDebugPanel from './light-debug-panel.vue';

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
  },
  debug: {
    type: Boolean,
    default: false // 是否显示调试面板
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
let lightContainer: THREE.Group; // 光源容器

// 光源引用
const ambientLightRef = ref<THREE.AmbientLight | null>(null);
const directionalLightRef = ref<THREE.DirectionalLight | null>(null);
const topLightRef = ref<THREE.DirectionalLight | null>(null);

// 材质属性引用
const materialRef = ref<{
  metalness: number;
  roughness: number;
}>({
  metalness: 0.01, // 默认金属度
  roughness: 0.99  // 默认粗糙度
});

// 初始化Three.js场景
const initThreeJS = () => {
  if (!treeContainer.value) return;
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = null; // 透明背景
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
  camera.position.x = 8;
  camera.position.y = 2; // 将相机位置从2上移到4
  camera.position.z = 5;
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const containerWidth = treeContainer.value.clientWidth;
  const containerHeight = treeContainer.value.clientHeight;
  renderer.setSize(containerWidth, containerHeight); // 使用容器的实际尺寸
  renderer.setClearColor(0x000000, 0); // 透明背景
  renderer.outputColorSpace = THREE.SRGBColorSpace; // 使用sRGB色彩空间
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // 使用ACES电影色调映射
  renderer.toneMappingExposure = 2.0; // 设置曝光度
  
  // 添加渲染器到DOM
  treeContainer.value.appendChild(renderer.domElement);
  
  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enablePan = false; // 禁止平移视角，只允许旋转
  
  // 限制视角范围
  controls.minPolarAngle = Math.PI * 0.2; // 限制最小极角（防止视角太靠上）
  controls.maxPolarAngle = Math.PI * 0.5; // 限制最大极角（防止视角太靠下）
  
  // 限制缩放范围
  controls.minDistance = 6; // 最小缩放距离
  controls.maxDistance = 15; // 最大缩放距离
  
  // 创建光源容器，附加到相机上
  lightContainer = new THREE.Group();
  camera.add(lightContainer);
  scene.add(camera); // 需要将相机添加到场景中才能使其子对象可见
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // 降低环境光强度
  scene.add(ambientLight); // 环境光直接添加到场景
  ambientLightRef.value = ambientLight;
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 增加方向光强度
  directionalLight.position.set(7.2,18,-2.8); // 调整方向光位置，使光照更自然
  directionalLightRef.value = directionalLight;
  lightContainer.add(directionalLight); // 方向光添加到光源容器
  
  // 添加顶光
  const topLight = new THREE.DirectionalLight(0xffffff, 0.8); // 调整顶光强度
  topLight.position.set(0, 1, 0); // 从正上方照射，相对于相机
  topLight.castShadow = true; // 启用阴影
  topLightRef.value = topLight;
  lightContainer.add(topLight); // 顶光添加到光源容器
  
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
    
    // 处理材质，确保正确的颜色空间
    treeModel.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        // 设置材质的颜色空间
        if (mesh.material) {
          const material = mesh.material as THREE.Material;
          material.needsUpdate = true;
          
          // 注意：在Three.js 0.174.0中，材质不直接支持colorSpace属性
          // 我们通过设置渲染器的输出颜色空间来处理
          
          // 如果是标准材质，调整其属性以更接近Blender效果
          if (material.type === 'MeshStandardMaterial') {
            const stdMaterial = material as THREE.MeshStandardMaterial;
            stdMaterial.metalness = Math.min(stdMaterial.metalness, materialRef.value.metalness); // 降低金属度
            stdMaterial.roughness = Math.max(stdMaterial.roughness, materialRef.value.roughness); // 确保一定的粗糙度
            stdMaterial.envMapIntensity = 1.0; // 环境贴图强度
          }
          
          // 启用阴影
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
    
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
  
  loader.load(TreeModelNormGLB, (gltf) => {
    treeModel = gltf.scene;
    
    // 调整模型位置和大小
    treeModel.scale.set(0.2, 0.2, 0.2);
    treeModel.position.y = -1.5;
    
    // 处理材质，确保正确的颜色空间
    treeModel.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        // 设置材质的颜色空间
        if (mesh.material) {
          const material = mesh.material as THREE.Material;
          material.needsUpdate = true;
          
          // 注意：在Three.js 0.174.0中，材质不直接支持colorSpace属性
          // 我们通过设置渲染器的输出颜色空间来处理
          
          // 如果是标准材质，调整其属性以更接近Blender效果
          if (material.type === 'MeshStandardMaterial') {
            const stdMaterial = material as THREE.MeshStandardMaterial;
            stdMaterial.metalness = Math.min(stdMaterial.metalness, materialRef.value.metalness); // 降低金属度
            stdMaterial.roughness = Math.max(stdMaterial.roughness, materialRef.value.roughness); // 确保一定的粗糙度
            stdMaterial.envMapIntensity = 1.0; // 环境贴图强度
          }
          
          // 启用阴影
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
    
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

// 监听materialRef变化，更新材质属性
watch(() => materialRef.value, (newValue) => {
  if (treeModel) {
    treeModel.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (mesh.material) {
          const material = mesh.material as THREE.Material;
          if (material.type === 'MeshStandardMaterial') {
            const stdMaterial = material as THREE.MeshStandardMaterial;
            stdMaterial.metalness = Math.min(stdMaterial.metalness, newValue.metalness); // 降低金属度
            stdMaterial.roughness = Math.max(stdMaterial.roughness, newValue.roughness); // 确保一定的粗糙度
          }
        }
      }
    });
  }
});

// 处理光源更新
const updateAmbientLight = (lightData) => {
  if (ambientLightRef.value) {
    ambientLightRef.value.intensity = lightData.intensity;
    ambientLightRef.value.color.set(lightData.color);
  }
};

const updateDirectionalLight = (lightData) => {
  if (directionalLightRef.value) {
    directionalLightRef.value.intensity = lightData.intensity;
    directionalLightRef.value.color.set(lightData.color);
    directionalLightRef.value.position.set(
      lightData.position.x,
      lightData.position.y,
      lightData.position.z
    );
  }
};

const updateTopLight = (lightData) => {
  if (topLightRef.value) {
    topLightRef.value.intensity = lightData.intensity;
    topLightRef.value.color.set(lightData.color);
    topLightRef.value.position.set(
      lightData.position.x,
      lightData.position.y,
      lightData.position.z
    );
  }
};

// 更新材质属性
const updateMaterial = (materialData) => {
  materialRef.value.metalness = materialData.metalness;
  materialRef.value.roughness = materialData.roughness;
};

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
  <div class="tree-model-container" ref="treeContainer">
    <LightDebugPanel 
      v-if="props.debug && ambientLightRef && directionalLightRef && topLightRef"
      :ambient-light="ambientLightRef"
      :directional-light="directionalLightRef"
      :top-light="topLightRef"
      :material="materialRef"
      @update:ambient-light="updateAmbientLight"
      @update:directional-light="updateDirectionalLight"
      @update:top-light="updateTopLight"
      @update:material="updateMaterial"
      class="model-debug-panel"
    />
  </div>
</template>

<style scoped>
.tree-model-container {
  width: 350px;
  height: 350px;
  margin: 0 auto;
  position: relative;
}

.tree-model-container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* 调试面板样式 */
.model-debug-panel {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
}
</style>
