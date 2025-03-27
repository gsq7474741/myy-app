<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
// 使用相对路径导入STL模型
import TreeModelTest from '@/assets/models/tree-test.stl';

const props = defineProps({
  isWatering: {
    type: Boolean,
    default: false
  }
});

// Three.js 相关变量
const treeContainer = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let treeModel: THREE.Mesh;
let animationFrameId: number;

// 初始化Three.js场景
const initThreeJS = () => {
  if (!treeContainer.value) return;
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = null; // 透明背景
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 2;
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(300, 300); // 设置合适的尺寸
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
  
  // 从assets中加载STL模型文件
  const loader = new STLLoader();
  
  // 创建两种材质：一种用于树叶（绿色），一种用于树干（棕色）
  const leavesMaterial = new THREE.MeshStandardMaterial({ 
    color: props.isWatering ? 0x4CAF50 : 0x8BC34A 
  });
  const trunkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513 // 棕色
  });
  
  loader.load(TreeModelTest, (geometry) => {
    // 分析模型几何结构，将模型分为树干和树叶两部分
    const positions = geometry.attributes.position.array;
    const vertexCount = positions.length / 3;
    
    // 创建两个新的几何体，分别用于树干和树叶
    const leavesGeometry = new THREE.BufferGeometry();
    const trunkGeometry = new THREE.BufferGeometry();
    
    // 用于存储树干和树叶的顶点、法线
    const leavesPositions: number[] = [];
    const leavesNormals: number[] = [];
    const trunkPositions: number[] = [];
    const trunkNormals: number[] = [];
    
    // 获取模型的边界框，用于确定阈值
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) {
      console.error('无法计算模型边界框');
      return;
    }
    
    // 注意：由于我们对模型应用了rotation.x = -Math.PI / 2的旋转
    // 在STL模型中，z轴可能是高度轴，而不是y轴
    const minZ = box.min.z;
    const maxZ = box.max.z;
    const heightThreshold = minZ + (maxZ - minZ) * 0.4; // 假设树干占模型底部40%的高度
    
    // 遍历所有三角形
    for (let i = 0; i < vertexCount; i += 3) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];
      
      const x2 = positions[(i + 1) * 3];
      const y2 = positions[(i + 1) * 3 + 1];
      const z2 = positions[(i + 1) * 3 + 2];
      
      const x3 = positions[(i + 2) * 3];
      const y3 = positions[(i + 2) * 3 + 1];
      const z3 = positions[(i + 2) * 3 + 2];
      
      // 计算三角形的平均z值（在旋转后的模型中可能是高度轴）
      const avgZ = (z1 + z2 + z3) / 3;
      
      // 根据高度判断是树干还是树叶
      if (avgZ < heightThreshold) {
        // 树干部分
        trunkPositions.push(x1, y1, z1, x2, y2, z2, x3, y3, z3);
        
        // 如果有法线属性，也复制法线
        if (geometry.attributes.normal) {
          const normals = geometry.attributes.normal.array;
          trunkNormals.push(
            normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2],
            normals[(i + 1) * 3], normals[(i + 1) * 3 + 1], normals[(i + 1) * 3 + 2],
            normals[(i + 2) * 3], normals[(i + 2) * 3 + 1], normals[(i + 2) * 3 + 2]
          );
        }
      } else {
        // 树叶部分
        leavesPositions.push(x1, y1, z1, x2, y2, z2, x3, y3, z3);
        
        // 如果有法线属性，也复制法线
        if (geometry.attributes.normal) {
          const normals = geometry.attributes.normal.array;
          leavesNormals.push(
            normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2],
            normals[(i + 1) * 3], normals[(i + 1) * 3 + 1], normals[(i + 1) * 3 + 2],
            normals[(i + 2) * 3], normals[(i + 2) * 3 + 1], normals[(i + 2) * 3 + 2]
          );
        }
      }
    }
    
    // 设置树叶几何体的属性
    leavesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(leavesPositions, 3));
    if (leavesNormals.length > 0) {
      leavesGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(leavesNormals, 3));
    } else {
      leavesGeometry.computeVertexNormals();
    }
    
    // 设置树干几何体的属性
    trunkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trunkPositions, 3));
    if (trunkNormals.length > 0) {
      trunkGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(trunkNormals, 3));
    } else {
      trunkGeometry.computeVertexNormals();
    }
    
    // 创建树叶和树干的网格
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
    // 创建一个组来包含树叶和树干
    treeModel = new THREE.Group() as unknown as THREE.Mesh;
    treeModel.add(trunk);
    treeModel.add(leaves);
    
    // 调整树模型的位置和大小
    treeModel.scale.set(0.2, 0.2, 0.2); // 根据实际模型大小调整缩放比例
    treeModel.rotation.x = -Math.PI / 2; // 调整模型方向
    treeModel.position.y = -3; // 调整位置
    
    scene.add(treeModel);
    animate();
  }, undefined, (error) => {
    console.error('加载模型出错:', error);
  });


};

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  if (treeModel) {
    treeModel.rotation.z += 0.005; // 缓慢旋转
  }
  
  controls.update();
  renderer.render(scene, camera);
};

// 处理窗口大小变化
const handleResize = () => {
  if (!camera || !renderer || !treeContainer.value) return;
  
  const width = 300;
  const height = 300;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

// 监听isWatering属性变化，更新模型颜色
watch(() => props.isWatering, (newValue) => {
  if (treeModel && treeModel.children && treeModel.children.length > 1) {
    // 获取树叶部分（第二个子元素）
    const leaves = treeModel.children[1] as THREE.Mesh;
    if (leaves && leaves.material) {
      const material = leaves.material as THREE.MeshStandardMaterial;
      material.color.set(newValue ? 0x4CAF50 : 0x8BC34A);
    }
  }
});

// 组件挂载时初始化
onMounted(() => {
  // 确保DOM已经渲染完成
  setTimeout(() => {
    if (treeContainer.value) {
      initThreeJS();
      window.addEventListener('resize', handleResize);
      console.log('3D模型初始化完成');
    } else {
      console.error('treeContainer元素不存在');
    }
  }, 300);
});

// 组件卸载时清理资源
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  if (renderer) {
    renderer.dispose();
  }
  
  if (controls) {
    controls.dispose();
  }
  
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div ref="treeContainer" class="tree-container"></div>
</template>

<style scoped>
.tree-container {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tree-container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
