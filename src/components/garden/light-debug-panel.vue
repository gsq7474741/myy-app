<script lang="ts" setup>
import { ref } from 'vue';
import type * as THREE from 'three';

interface LightProps {
  intensity: number;
  color: THREE.Color;
  position?: THREE.Vector3;
}

const props = defineProps({
  ambientLight: { type: Object, required: true },
  directionalLight: { type: Object, required: true },
  topLight: { type: Object, required: true }
});

const emit = defineEmits(['update:ambientLight', 'update:directionalLight', 'update:topLight']);

// 光源参数
const lights = {
  ambient: {
    intensity: ref(props.ambientLight.intensity),
    color: ref('#' + props.ambientLight.color.getHexString()),
    position: null
  },
  directional: {
    intensity: ref(props.directionalLight.intensity),
    color: ref('#' + props.directionalLight.color.getHexString()),
    position: {
      x: ref(props.directionalLight.position.x),
      y: ref(props.directionalLight.position.y),
      z: ref(props.directionalLight.position.z)
    }
  },
  top: {
    intensity: ref(props.topLight.intensity),
    color: ref('#' + props.topLight.color.getHexString()),
    position: {
      x: ref(props.topLight.position.x),
      y: ref(props.topLight.position.y),
      z: ref(props.topLight.position.z)
    }
  }
};

// 映射函数
const mapToSlider = (value: number, min: number, max: number): number => {
  return ((value - min) / (max - min)) * 100;
};

const mapFromSlider = (sliderValue: number, min: number, max: number): number => {
  return min + (sliderValue / 100) * (max - min);
};

// 滑动条值映射
const sliderValues = {
  ambient: {
    intensity: ref(mapToSlider(lights.ambient.intensity.value, 0, 10))
  },
  directional: {
    intensity: ref(mapToSlider(lights.directional.intensity.value, 0, 10)),
    position: {
      x: ref(mapToSlider(lights.directional.position.x.value, -20, 20)),
      y: ref(mapToSlider(lights.directional.position.y.value, -20, 20)),
      z: ref(mapToSlider(lights.directional.position.z.value, -20, 20))
    }
  },
  top: {
    intensity: ref(mapToSlider(lights.top.intensity.value, 0, 5)),
    position: {
      x: ref(mapToSlider(lights.top.position.x.value, -20, 20)),
      y: ref(mapToSlider(lights.top.position.y.value, -20, 20)),
      z: ref(mapToSlider(lights.top.position.z.value, -20, 20))
    }
  }
};

// 处理滑动条输入
const handleSlider = (event: any, lightType: 'ambient' | 'directional' | 'top', property: string, subProperty?: string) => {
  const sliderValue = event.detail.value;
  const light = lights[lightType];
  const slider = sliderValues[lightType];
  
  if (subProperty && property === 'position' && light.position) {
    // 处理位置属性 (x, y, z)
    (slider as any)[property][subProperty].value = sliderValue;
    (light as any)[property][subProperty].value = mapFromSlider(sliderValue, -20, 20);
  } else if (property === 'intensity') {
    // 处理强度属性
    (slider as any)[property].value = sliderValue;
    (light as any)[property].value = mapFromSlider(sliderValue, 0, 5);
  }
  
  // 更新光源
  updateLight(lightType);
};

// 更新光源
const updateLight = (lightType: 'ambient' | 'directional' | 'top') => {
  const light = lights[lightType];
  
  if (lightType === 'ambient') {
    emit('update:ambientLight', {
      intensity: light.intensity.value,
      color: light.color.value
    });
  } else if (lightType === 'directional' && light.position) {
    emit('update:directionalLight', {
      intensity: light.intensity.value,
      color: light.color.value,
      position: {
        x: light.position.x.value,
        y: light.position.y.value,
        z: light.position.z.value
      }
    });
  } else if (lightType === 'top' && light.position) {
    emit('update:topLight', {
      intensity: light.intensity.value,
      color: light.color.value,
      position: {
        x: light.position.x.value,
        y: light.position.y.value,
        z: light.position.z.value
      }
    });
  }
};

// 颜色选择器引用
const colorInputRefs = {
  ambient: ref<HTMLInputElement | null>(null),
  directional: ref<HTMLInputElement | null>(null),
  top: ref<HTMLInputElement | null>(null)
};

// 触发颜色选择器
const triggerColorPicker = (lightType: 'ambient' | 'directional' | 'top') => {
  const inputEl = colorInputRefs[lightType].value;
  if (inputEl) {
    inputEl.click();
  }
};

// 更新颜色
const updateColor = (lightType: 'ambient' | 'directional' | 'top') => {
  updateLight(lightType);
};

// 显示/隐藏调试面板
const showPanel = ref(false);
const togglePanel = () => {
  showPanel.value = !showPanel.value;
};
</script>

<template>
  <div class="light-debug-panel">
    <button class="toggle-btn" @click="togglePanel">
      {{ showPanel ? '隐藏调试面板' : '显示调试面板' }}
    </button>
    
    <div v-if="showPanel" class="panel-content">
      <!-- 环境光 -->
      <div class="light-section">
        <h3>环境光</h3>
        <div class="control-group">
          <label>强度:</label>
          <slider
            min="0" max="100" step="1"
            :value="sliderValues.ambient.intensity"
            @changing="(e) => handleSlider(e, 'ambient', 'intensity')"
            block-size="20"
            activeColor="#4CAF50"
            backgroundColor="#d3d3d3"
          />
          <span>{{ lights.ambient.intensity.value.toFixed(1) }}</span>
        </div>
        <div class="control-group">
          <label>颜色:</label>
          <div 
            class="color-box" 
            :style="{ backgroundColor: lights.ambient.color.value }" 
            @click="triggerColorPicker('ambient')"
          ></div>
          <div class="color-input-wrapper">
            <span class="color-input-text">点我</span>
            <input 
              type="color" 
              ref="colorInputRefs.ambient"
              v-model="lights.ambient.color.value" 
              @input="() => updateColor('ambient')" 
              class="hidden-color-input"
            />
          </div>
        </div>
      </div>
      
      <!-- 方向光 -->
      <div class="light-section">
        <h3>方向光</h3>
        <div class="control-group">
          <label>强度:</label>
          <slider
            min="0" max="100" step="1"
            :value="sliderValues.directional.intensity"
            @changing="(e) => handleSlider(e, 'directional', 'intensity')"
            block-size="20"
            activeColor="#4CAF50"
            backgroundColor="#d3d3d3"
          />
          <span>{{ lights.directional.intensity.value.toFixed(1) }}</span>
        </div>
        <div class="control-group">
          <label>颜色:</label>
          <div 
            class="color-box" 
            :style="{ backgroundColor: lights.directional.color.value }" 
            @click="triggerColorPicker('directional')"
          ></div>
          <div class="color-input-wrapper">
            <span class="color-input-text">点我</span>
            <input 
              type="color" 
              ref="colorInputRefs.directional"
              v-model="lights.directional.color.value" 
              @input="() => updateColor('directional')" 
              class="hidden-color-input"
            />
          </div>
        </div>
        
        <!-- 方向光位置 -->
        <template v-if="lights.directional.position">
          <div 
            v-for="axis in ['x', 'y', 'z']" 
            :key="'directional-' + axis" 
            class="control-group"
          >
            <label>位置 {{ axis.toUpperCase() }}:</label>
            <slider
              min="0" max="100" step="1"
              :value="sliderValues.directional.position[axis]"
              @changing="(e) => handleSlider(e, 'directional', 'position', axis)"
              block-size="20"
              activeColor="#4CAF50"
              backgroundColor="#d3d3d3"
            />
            <span>{{ lights.directional.position[axis].value.toFixed(1) }}</span>
          </div>
        </template>
      </div>
      
      <!-- 顶光 -->
      <div class="light-section">
        <h3>顶光</h3>
        <div class="control-group">
          <label>强度:</label>
          <slider
            min="0" max="100" step="1"
            :value="sliderValues.top.intensity"
            @changing="(e) => handleSlider(e, 'top', 'intensity')"
            block-size="20"
            activeColor="#4CAF50"
            backgroundColor="#d3d3d3"
          />
          <span>{{ lights.top.intensity.value.toFixed(1) }}</span>
        </div>
        <div class="control-group">
          <label>颜色:</label>
          <div 
            class="color-box" 
            :style="{ backgroundColor: lights.top.color.value }" 
            @click="triggerColorPicker('top')"
          ></div>
          <div class="color-input-wrapper">
            <span class="color-input-text">点我</span>
            <input 
              type="color" 
              ref="colorInputRefs.top"
              v-model="lights.top.color.value" 
              @input="() => updateColor('top')" 
              class="hidden-color-input"
            />
          </div>
        </div>
        
        <!-- 顶光位置 -->
        <template v-if="lights.top.position">
          <div 
            v-for="axis in ['x', 'y', 'z']" 
            :key="'top-' + axis" 
            class="control-group"
          >
            <label>位置 {{ axis.toUpperCase() }}:</label>
            <slider
              min="0" max="100" step="1"
              :value="sliderValues.top.position[axis]"
              @changing="(e) => handleSlider(e, 'top', 'position', axis)"
              block-size="20"
              activeColor="#4CAF50"
              backgroundColor="#d3d3d3"
            />
            <span>{{ lights.top.position[axis].value.toFixed(1) }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.light-debug-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  z-index: 1000;
}

.toggle-btn {
  width: 100%;
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.panel-content {
  margin-top: 10px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
}

.light-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.light-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.control-group {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.control-group label {
  width: 60px;
  font-size: 14px;
}

.control-group slider {
  flex: 1;
  margin: 0 10px;
}

.control-group span {
  width: 40px;
  text-align: right;
  font-size: 14px;
}

.color-box {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  margin-right: 10px;
}

.color-input-wrapper {
  position: relative;
  display: inline-block;
}

.color-input-text {
  font-size: 12px;
  color: #4caf50;
  cursor: pointer;
}

.hidden-color-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
