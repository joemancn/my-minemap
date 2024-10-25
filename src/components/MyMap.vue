<template>
  <div id="scene-page">
    <div class="map-main-view" ref="container"></div>
    <div class="fixed-left"></div>
    <div class="fixed-right">
      <el-card v-if="props.editMode" style="background-color: #091639">
        <el-form :model="optionForm" size="small">
          <el-form-item>
            <el-radio-group v-model="optionForm.mode" @change="handleChangePointMode">
              <el-radio-button v-show="props.menu.includes('1')" :label="1">测点</el-radio-button>
              <el-radio-button v-show="props.menu.includes('2')" :label="2">路径节点</el-radio-button>
              <el-radio-button v-show="props.menu.includes('3')" :label="3">应急点</el-radio-button>
              <template v-if="props.modType !== 'hz'">
                <el-radio-button v-show="props.menu.includes('4')" :label="4">路线</el-radio-button>
              </template>
              <el-radio-button v-show="props.menu.includes('5')" :label="5">区域</el-radio-button>
              <el-radio-button v-show="props.menu.includes('6')" :label="6">应急路线</el-radio-button>
              <el-radio-button v-show="props.menu.includes('7')" :label="7">监控设备</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="optionForm.mode <= 3 || optionForm.mode === 7">
            <el-form-item>
              <el-button @click="addPoint">添加</el-button>
              <el-button @click="editPoint">修改</el-button>
              <el-button @click="delPoint">删除</el-button>
            </el-form-item>
            <el-form-item v-if="pointOpt === 2">
              <!-- 修改 -->
              <el-button @click="openEditPointdialog">确定</el-button>
            </el-form-item>
            <el-form-item v-else-if="pointOpt === 3">
              <!-- 删除 -->
              <el-button :icon="Delete" @click="submitDelPoint">确定</el-button>
            </el-form-item>
          </template>

          <template v-else-if="optionForm.mode === 4">
            <el-form-item>
              <el-button @click="addLine">添加</el-button>
              <el-button @click="delLine">删除</el-button>
              <el-button @click="plusLine">延长</el-button>
            </el-form-item>
            <el-form-item v-if="lineOpt === 1">
              <el-button @click="openCheckLineDialog">确定</el-button>
              <el-button @click="removeDrawLine">重置</el-button>
            </el-form-item>
            <template v-else-if="lineOpt === 2">
              <el-form-item>
                <el-select v-model="checkLineValue" placeholder="Select" @change="handleChangeLine" clearable>
                  <el-option v-for="item in checkLineData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button :icon="Delete" @click="delCheckLine">确定</el-button>
              </el-form-item>
            </template>
            <template v-else-if="lineOpt === 3">
              <el-form-item>
                <el-select v-model="checkLineValue" placeholder="Select" @change="handleChangeLine" clearable>
                  <el-option v-for="item in checkLineData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="openUpdateLine">确定</el-button>
                <el-button @click="removeDrawLine">重置</el-button>
              </el-form-item>
            </template>
          </template>
          <template v-else-if="optionForm.mode === 5">
            <el-form-item>
              <el-button @click="addArea">添加</el-button>
              <el-button @click="delArea">删除</el-button>
            </el-form-item>
            <template v-if="areaOpt === 1">
              <el-form-item>
                <el-button @click="openAddAreaDialog">确认</el-button>
                <el-button @click="removeAreaPoints">重置</el-button>
              </el-form-item>
            </template>
            <template v-else-if="areaOpt === 2">
              <el-form-item>
                <el-select v-model="areaId" placeholder="Select">
                  <el-option v-for="item in areaData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button :icon="Delete" @click="submitDelArea">确认</el-button>
              </el-form-item>
            </template>
          </template>
          <template v-else-if="optionForm.mode === 6">
            <el-form-item>
              <el-button @click="addSafeLine">添加</el-button>
              <el-button @click="delSafeLine">删除</el-button>
              <!-- <el-button @click="openCheckLineDialog(1)">添加</el-button> -->
              <!-- <el-button @click="removeDrawLine">重新绘制</el-button> -->
            </el-form-item>
            <template v-if="safeLineOpt === 1">
              <template v-if="showBindSelecter">
                <el-form-item>
                  <el-select v-model="bindPointId" placeholder="Select" @change="handleChangeBindPoint" clearable>
                    <el-option v-for="item in pointData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button @click="startDraweSafe">确定</el-button>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item>
                  <el-button @click="openAddSafeLineDialog">确定</el-button>
                  <el-button @click="addSafeLine">重置</el-button>
                  <el-switch v-model="isTube" @click="handleChangIsTube" />指定显示巷道
                </el-form-item>
              </template>
            </template>
            <template v-else-if="safeLineOpt === 2">
              <el-form-item>
                <el-select v-model="checkLineValue" placeholder="Select" @change="handleChangeLine" clearable>
                  <el-option v-for="item in checkLineData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button :icon="Delete" @click="delCheckLine">确定</el-button>
              </el-form-item>
            </template>
          </template>
          <el-form-item>
            <el-button @click="goback">返回</el-button>
          </el-form-item>
        </el-form>

        <div v-show="optionForm.mode === 4 && props.modType === 'ws'">
          <div>连接巡检点</div>
          <el-table :data="crossPointList" style="width: 100%" max-height="600px">
            <el-table-column prop="name" label="点位名称" />
            <el-table-column width="100px" label="x坐标">
              <template #="scope">
                {{ scope.row.posX }}
              </template>
            </el-table-column>
            <el-table-column width="100px" label="y坐标">
              <template #="scope">
                {{ scope.row.posY }}
              </template>
            </el-table-column>
            <el-table-column prop="sensorType" label="巡检次数" />
          </el-table>
        </div>
      </el-card>
      <el-card v-if="isTube" style="background-color: #091639">
        <template #header>
          <span>巷道显示</span>
        </template>
        <div v-for="item in selectedTubes" :key="item.id">{{ item.name }}</div>
      </el-card>
    </div>
    <!-- 加载进度条 -->
    <!-- <el-progress class="fixd-center" v-show="modelsProgress < 100" type="circle" :percentage="modelsProgress" /> -->
    <!-- 巡检路线弹窗 -->
    <el-dialog v-model="checkLineDialogVisible" title="添加路线" width="40%" @close="handleCloseLineDialog">
      <el-form :model="checkLineForm" :rules="checkLineRules" label-width="90px" ref="checkLineFormRef">
        <template v-if="props.modType !== 'tf'">
          <el-form-item label="路线名称" prop="name">
            <el-input v-model.trim="checkLineForm.name" />
          </el-form-item>
        </template>

        <!-- <el-form-item label="路线类型">
                    <el-radio-group v-model="checkLineForm.pathType">
                        <el-radio-button v-for="item in pathTypeOps" :key="item.value" :label="item.value">{{ item.label
                        }}</el-radio-button>
                    </el-radio-group>
                </el-form-item> -->
      </el-form>
      <div v-show="checkLineForm.pathType === 1">
        <h3>连接巡检点</h3>
        <el-table :data="crossPointList" style="width: 100%" max-height="600px">
          <el-table-column prop="id" label="id" />
          <el-table-column prop="name" label="点位名称" />
          <el-table-column width="100px" label="x坐标">
            <template #="scope">
              {{ scope.row.posX }}
            </template>
          </el-table-column>
          <el-table-column width="100px" label="y坐标">
            <template #="scope">
              {{ scope.row.posY }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="checkLineDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCheckLine(checkLineFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 延长路线 -->
    <el-dialog v-model="checkLineUpdateDialogVisible" :title="'延长路线'" width="30%">
      <h3>连接巡检点</h3>
      <el-table :data="crossPointList" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="点位名称" />
        <el-table-column label="x坐标">
          <template #="scope">
            {{ scope.row.posX }}
          </template>
        </el-table-column>
        <el-table-column label="y坐标">
          <template #="scope">
            {{ scope.row.posY }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="checkLineUpdateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateCheckLine"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加巡检点 -->
    <el-dialog v-model="pointDialogVisible" :title="pointTitle" width="30%" :before-close="handleClosePoDialog">
      <el-form :model="pointForm" :rules="pointRules" label-width="120px" ref="pointFormRef">
        <el-form-item label="坐标点名称" prop="name" v-if="
          optionForm.mode == 1 || optionForm.mode == 3 || optionForm.mode == 7
        ">
          <el-input v-model="pointForm.name" />
        </el-form-item>
        <template v-if="optionForm.mode == 1">
          <template v-if="['zh', 'ky', 'hz', 'ws'].includes(props.modType)">
            <el-form-item label="测点类型" prop="sensorType">
              <el-radio-group v-model="pointForm.sensorType">
                <el-radio-button v-for="item in sensorTypeOps" :key="item.value" :label="item.value">{{ item.label
                  }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-else-if="props.modType === 'jc'">
            <el-form-item label="测点类型" prop="sensorType">
              <el-radio-group v-model="pointForm.sensorType">
                <el-radio-button v-for="item in sensorTypeOps" :key="item.value" :label="item.value">{{ item.label
                  }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="数量" v-if="pointForm.sensorType === 44" prop="composeCount">
              <el-input-number v-model="pointForm.composeCount" :min="1" style="width: 100%" />
            </el-form-item>
          </template>
        </template>
        <template v-else-if="optionForm.mode == 3">
          <el-form-item label="应急类型" prop="sensorType">
            <el-radio-group v-model="pointForm.sensorType">
              <el-radio-button v-for="item in safeTypeOps" :key="item.value" :label="item.value">{{ item.label
                }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-else-if="optionForm.mode == 7">
          <el-form-item label="视频类型" prop="sensorType">
            <el-radio-group v-model="pointForm.sensorType">
              <el-radio-button v-for="item in videoTypeOps" :key="item.value" :label="item.value">{{ item.label
                }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
        <!-- <el-form-item label="进出风口" v-if="props.modType === 'tf' && optionForm.mode == 2"
                    prop="isInlet">
                    <el-radio-group v-model="pointForm.isInlet">
                        <el-radio-button v-for="item in isInletOpt" :key="item.value" :label="item.value">{{ item.label
                            }}</el-radio-button>
                    </el-radio-group>
                </el-form-item> -->
        <el-form-item label="x坐标">
          <el-input v-model="pointForm.transformPositionX" style="width: 100%" />
        </el-form-item>
        <el-form-item label="y坐标">
          <el-input v-model="pointForm.transformPositionY" style="width: 100%" />
        </el-form-item>
        <el-form-item label="设备id" v-if="optionForm.mode == 1">
          <el-input v-model="pointForm.deviceId" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClosePoDialog">取消</el-button>
          <el-button type="primary" @click="submitPoint(pointFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加工作面 -->
    <el-dialog v-model="addAreaDialogVisible" title="添加区域" width="30%" @close="handleCloseAreaDialog">
      <el-form :model="areaForm" :rules="areaRules" label-width="120px" ref="areaFormRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="areaForm.name" />
        </el-form-item>
        <el-form-item label="类型" prop="fenceType">
          <el-radio-group v-model="areaForm.fenceType">
            <el-radio-button v-for="item in fenceTypeOps" :key="item.value" :label="item.value">{{ item.label
              }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addAreaDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitArea"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>

    <div id="open-card" :style="popupDetailStyle" v-show="isOpenCard()" ref="popupCardRef">
      <div v-if="props.modType === 'zh'">
        <div class="open-item-1">
          {{ outDetailData?.name }}
        </div>
        <ul class="open-item-2">
          <li>工程类型: {{ outDetailData?.project.typeName }}</li>
          <li>工程名称: {{ outDetailData?.name }}</li>
          <li>工程地点: {{ outDetailData?.project.locationName }}</li>
          <li>
            工程实时周期:
            {{
              parseTime(outDetailData?.project.startTime, "{y}-{m}-{d}") +
              " ~ " +
              parseTime(outDetailData?.project.endTime, "{y}-{m}-{d}")
            }}
          </li>
          <li>工程实时负责人: {{ outDetailData?.project.assigneeName }}</li>
        </ul>
        工程进度：<el-progress :percentage="outDetailData?.project.process - 0" :text-inside="true" :stroke-width="20"
          :status="getProjectColor(outDetailData?.project.ewType)"></el-progress>
      </div>
      <div v-else-if="props.modType === 'jc'">
        <div class="card-title">
          <i style="color: #ffd500" :class="[
            'myiconfont',
            {
              'smart-pidaijiangchendian': outDetailData?.sensorType === 41,
              'smart-daxiangjiangchendian': outDetailData?.sensorType === 40,
              'smart-zhuanzaijiangchendian': outDetailData?.sensorType === 42,
              'smart-zongcaimianjiangchendian':
                outDetailData?.sensorType === 43,
            },
          ]"></i>
          {{ outDetailData?.name }}
        </div>
        <div v-if="outDetailData?.sensorType == 44" class="open-item-3">
          总数：<span style="color: #00aaff">{{
            outDetailData?.composeCount
          }}</span>
        </div>

        <div v-else class="open-item-4">
          <div class="jc-style-1">
            {{ translateSensor(outDetailData?.sensorType) }}
          </div>
          <div class="jc-style-2">{{ outDetailData?.name }}</div>
        </div>
        <el-table :data="detailTableData" style="width: 100%" height="120px" size="small"
          :show-header="outDetailData?.sensorType !== 44" v-loading="detailLoading" :header-cell-style="{
            height: '20px',
          }">
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column prop="remoteStatus" label="状态" width="50px">
            <template #="scope">
              {{ translateStatus(scope.row.remoteStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="deviceModel" label="型号" width="80px">
            #174684
          </el-table-column>
        </el-table>
      </div>
      <div class="open-item-9" v-else>
        <div class="open-item-5">
          <div class="card-title">
            {{ outDetailData?.name }}
          </div>
          <div class="open-item-6">
            <img :src="Radar" alt="" class="open-item-7" />
          </div>

          <div>&nbsp;</div>
        </div>
        <div class="open-item-8">
          <div id="chart" style="width: 100%; height: 100%" v-loading="chartLoading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="MyMap">
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import _ from "lodash";
// import * as dat from "dat.gui";
import * as echarts from "echarts";
import { gsap } from "gsap";
import { reactive, onMounted, ref, onBeforeUnmount } from "vue";
// import { storeToRefs } from "pinia";
// import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
// import useWsdataStore from "@/store/modules/wsdata";
// import usePermissionStore from "@/store/modules/permission";
import mapInfo from "@/utils/map-info.js";
// import {
//   getPointList,
//   delPointByIds,
//   saveCheckLine,
//   postInspection,
//   getCheckLineList,
//   delCheckLineById,
//   getChartById,
//   getLineModel,
//   getZhPointList,
//   addLyEFence,
//   listLyAllEFence,
//   delLyEFence,
//   updateLyInspection,
//   updateLyPath
// } from "@/api/my-map.js";
import eCardBg from "@/assets/texture/e-card.png";
import Stone1 from "@/assets/texture/stone1.png";
import Stone2 from "@/assets/texture/stone2.png";
import BlueLineTexture from "@/assets/texture/line1.jpg";
import RedLineTexture from "@/assets/texture/line2.jpg";
import GreenLineTexture from "@/assets/texture/line3.jpg";
import Worker from "@/assets/texture/worker.png";
import Radar from "@/assets/texture/radar.gif?url";
import PointPic1 from "@/assets/texture/point-1.png?url";
import PointPic2 from "@/assets/texture/point-2.png?url";
import PointPic3 from "@/assets/texture/point-3.png?url";
import PointPic4 from "@/assets/texture/point-4.png?url";
import PointPic5 from "@/assets/texture/point-5.png?url";
import TubeName from "@/assets/texture/tube-name.png?url";
import LineLight from "@/assets/texture/line-light.png";
import ZhDb0 from "@/assets/texture/zh-db-0.png";
import ZhDb1 from "@/assets/texture/zh-db-1.png";
import ZhDb2 from "@/assets/texture/zh-db-2.png";
import ZhDb3 from "@/assets/texture/zh-db-3.png";
import ZhFc0 from "@/assets/texture/zh-fc-0.png";
import ZhFc1 from "@/assets/texture/zh-fc-1.png";
import ZhFc2 from "@/assets/texture/zh-fc-2.png";
import ZhFc3 from "@/assets/texture/zh-fc-3.png";
import ZhFmh0 from "@/assets/texture/zh-fmh-0.png";
import ZhFmh1 from "@/assets/texture/zh-fmh-1.png";
import ZhFmh2 from "@/assets/texture/zh-fmh-2.png";
import ZhFmh3 from "@/assets/texture/zh-fmh-3.png";
import ZhKy0 from "@/assets/texture/zh-ky-0.png";
import ZhKy1 from "@/assets/texture/zh-ky-1.png";
import ZhKy2 from "@/assets/texture/zh-ky-2.png";
import ZhKy3 from "@/assets/texture/zh-ky-3.png";
import ZhSh0 from "@/assets/texture/zh-sh-0.png";
import ZhSh1 from "@/assets/texture/zh-sh-1.png";
import ZhSh2 from "@/assets/texture/zh-sh-2.png";
import ZhSh3 from "@/assets/texture/zh-sh-3.png";
import ZhWs0 from "@/assets/texture/zh-ws-0.png";
import ZhWs1 from "@/assets/texture/zh-ws-1.png";
import ZhWs2 from "@/assets/texture/zh-ws-2.png";
import ZhWs3 from "@/assets/texture/zh-ws-3.png";
import ZhZx0 from "@/assets/texture/zh-zx-0.png";
import ZhZx1 from "@/assets/texture/zh-zx-1.png";
import ZhZx2 from "@/assets/texture/zh-zx-2.png";
import ZhZx3 from "@/assets/texture/zh-zx-3.png";
import ZhTf0 from "@/assets/texture/zh-tf-0.png";
import ZhTf1 from "@/assets/texture/zh-tf-1.png";
import ZhTf2 from "@/assets/texture/zh-tf-2.png";
import ZhTf3 from "@/assets/texture/zh-tf-3.png";
import JcDx0 from "@/assets/texture/jc-dx-0.png";
import JcDx1 from "@/assets/texture/jc-dx-1.png";
import JcDx2 from "@/assets/texture/jc-dx-2.png";
import JcDx3 from "@/assets/texture/jc-dx-3.png";
import JcPd0 from "@/assets/texture/jc-pd-0.png";
import JcPd1 from "@/assets/texture/jc-pd-1.png";
import JcPd2 from "@/assets/texture/jc-pd-2.png";
import JcPd3 from "@/assets/texture/jc-pd-3.png";
import JcZc0 from "@/assets/texture/jc-zc-0.png";
import JcZc1 from "@/assets/texture/jc-zc-1.png";
import JcZc2 from "@/assets/texture/jc-zc-2.png";
import JcZc3 from "@/assets/texture/jc-zc-3.png";
import JcZz0 from "@/assets/texture/jc-zz-0.png";
import JcZz1 from "@/assets/texture/jc-zz-1.png";
import JcZz2 from "@/assets/texture/jc-zz-2.png";
import JcZz3 from "@/assets/texture/jc-zz-3.png";
import JcJh from "@/assets/texture/jc-jh.png";
import KyKy0 from "@/assets/texture/ky-ky-0.png";
import KyKy1 from "@/assets/texture/ky-ky-1.png";
import KyKy2 from "@/assets/texture/ky-ky-2.png";
import KyKy3 from "@/assets/texture/ky-ky-3.png";
import KyDb0 from "@/assets/texture/ky-db-0.png";
import KyDb1 from "@/assets/texture/ky-db-1.png";
import KyDb2 from "@/assets/texture/ky-db-2.png";
import KyDb3 from "@/assets/texture/ky-db-3.png";
import KyZk0 from "@/assets/texture/ky-zk-0.png";
import KyZk1 from "@/assets/texture/ky-zk-1.png";
import KyZk2 from "@/assets/texture/ky-zk-2.png";
import KyZk3 from "@/assets/texture/ky-zk-3.png";
import KyMg0 from "@/assets/texture/ky-mg-0.png";
import KyMg1 from "@/assets/texture/ky-mg-1.png";
import KyMg2 from "@/assets/texture/ky-mg-2.png";
import KyMg3 from "@/assets/texture/ky-mg-3.png";
import SafeZa from "@/assets/texture/safe-za.png";
import SafeBn from "@/assets/texture/safe-bn.png";
import SafeTs from "@/assets/texture/safe-ts.png";


const emits = defineEmits(['goback', 'playProgress', 'touchPoint', 'callHangModel', 'callAreaData', 'callCheckPoints', 'callNodePoints', 'callSafePoints', 'callVideoPoints', 'callDelPoint', 'callUpdatePoint', 'callCreatePoint', 'callPopupChart', 'backCheckLines', 'callCreateCheckLine', 'callDelCheckLine', 'callUpdateCheckLine', 'callCreateArea', 'callDelArea']);
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
  peopleLive: {
    // 无巡查人员(弃用)
    type: Boolean,
    default: false,
  },
  escapeId: {
    type: [String, Object],
  },
  showPoints: {
    // 无巡检点
    type: Boolean,
    default: true,
  },
  hasPointsDialog: {
    // 点的弹窗
    type: Boolean,
    default: false,
  },
  showSafePoints: {
    // 无巡检点
    type: Boolean,
    default: false,
  },
  control: {
    // 鼠标控制
    type: Boolean,
    default: true,
  },
  displayPeopleList: {
    // 实时定位只显示人员
    type: Array,
    default: () => [],
  },
  degrees: {
    // 角度
    type: Number,
    default: 60,
  },
  distance: {
    // 初始距离
    type: Number,
    default: 550,
  },
  maxDistance: {
    // 最大距离
    type: Number,
    default: 800,
  },
  minDistance: {
    // 最小距离
    type: Number,
    default: 10,
  },
  menu: {
    // 允许菜单
    type: Array,
    default: () => ['1', '2', '3', '4', '5', '6', '7'],
  },
  modType: {
    // 模块代号
    type: String,
    default: '',
  },
  // lineModels: {
  //   type: Array
  // }
});

// const permissionStore = usePermissionStore();

let myChart, option;

// 导入pinia模块
// let wsdataStore = useWsdataStore();
// 转为ref
// let { peopleMsgCount, pointMsgCount } = storeToRefs(wsdataStore);
// 监听人员状态改变
// watch(peopleMsgCount, (count, prevCount) => {
//   if (props.editMode || props.peopleLive === false) return;
//   changePeoples();
// });
// 监听点状态变化
// watch(pointMsgCount, (count, prevCount) => {
//   if (props.editMode) return;
//   changePointStatus();
// });
// // 纹理加载器
const textureLoader = new THREE.TextureLoader();
// 模型加载器
const gltfLoader = new GLTFLoader();

let scene, camera, renderer, labelRenderer, controls, composer;
function initScene() {
  // 创建场景
  scene = new THREE.Scene();
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1200
  );
  // 设定相机位置和观察位置

  // 角度
  let degrees = props.degrees;
  // 距离
  let distance = props.distance;
  let radians = degrees * (Math.PI / 180);
  // gsap.to(camera.position, {
  //     y: distance * Math.sin(radians),
  //     z: distance * Math.cos(radians),
  //     duration: 1.5,
  //     onUpdate: () => {
  //         camera.lookAt(0, 0, 0)
  //     }
  // })
  camera.position.set(
    0,
    distance * Math.sin(radians),
    distance * Math.cos(radians)
  );

  scene.background = null; // 背景透明
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
    alpha: true,
  });
  // renderer.localClippingEnabled = true
  labelRenderer = new CSS2DRenderer();
  controls = new MapControls(camera, labelRenderer.domElement);

  // const renderScene = new RenderPass(scene, camera);

  // const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  // bloomPass.threshold = 1.5;
  // bloomPass.strength = 1;
  // bloomPass.radius = 1;
  // const outputPass = new OutputPass( THREE.ReinhardToneMapping );

  // composer = new EffectComposer(renderer);
  // composer.addPass(renderScene);
  // composer.addPass(bloomPass);
  // composer.addPass(outputPass);
}
initScene();

controls.enabled = props.control;

// 创建GUI对象
let gui;
// 添加操作界面
// function initGui() {
//   gui = new dat.GUI();
//   gui.domElement.id = "gui";
//   const guiOptions = {
//     // sceneMode: 'ShowOnlyMode',
//     test() {
//       console.log("测试");
//       const path = [
//         { x: 496.22, y: 0, z: -145 },
//         { x: 441.09, y: 0, z: -28.32 },
//         { x: 261.17, y: 0, z: -27.74 },
//         { x: 259.55, y: 0, z: -14.22 },
//         { x: 184.41, y: 0, z: -13.7 },
//         { x: 81.27, y: 0, z: -13.73 },
//         { x: 80.36, y: 0, z: 7.11 },
//         { x: 260.67, y: 0, z: 6.92 },
//         { x: 259.75, y: 0, z: 47.7 },
//         { x: 260.75, y: 0, z: 193.06 },
//         { x: 260.56, y: 0, z: 221.53 },
//         { x: 316.88, y: 0, z: 262.98 },
//       ];
//       playWorkerPath(path);
//     },
//     delPoint,
//     pointMode: 1,
//     canSetline: false,
//     openCheckLineDialog,
//     stopPathMovie,
//     delCheckLine,
//     speed: 1,
//     pointFilter: -1,
//   };
//   gui.add(guiOptions, "test").name("测试方法");
// }

// 引入挂载DOM的ref
const container = ref();

// 辅助点击平面
let floorBase;
function initClickPlane() {
  const geometry = new THREE.PlaneGeometry(4800, 2400);
  const material = new THREE.MeshBasicMaterial({
    color: 0x333333,
    // side: THREE.DoubleSide,
    transparent: true, // 开启透明
    opacity: 0, // 透明度为0
  });
  floorBase = new THREE.Mesh(geometry, material);
  floorBase.rotateX(-Math.PI / 2);
  scene.add(floorBase);
}

const cadGroup = new THREE.Group();
cadGroup.name = "CAD图纸";
let offset = [];
const modelList = ref([]);
// 获取巷道数据
function getHangModel() {
  emits('callHangModel')
}

function backHangModel(data) {
  const group = new THREE.Group();
  group.name = "巷道";
  data.forEach((element) => {
    createTunnel(group, element);
  });
  scene.add(group);
}

function createTunnel(group, data) {
  const raidus = data.width; // 半径
  const tubeColor = data.color
    ? new THREE.Color(data.color)
    : new THREE.Color("#e6e6e6");

  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: tubeColor,
    shininess: 100,
    // depthTest: false
  });
  const tubeMaterial = new THREE.MeshPhongMaterial({
    color: tubeColor,
    shininess: 100,
    // depthTest: false
  });
  const points = [
    new THREE.Vector3(
      mapInfo.cadToWeb3dX(data.startX),
      0,
      mapInfo.cadToWeb3dY(data.startY)
    ),
    new THREE.Vector3(
      mapInfo.cadToWeb3dX(data.endX),
      0,
      mapInfo.cadToWeb3dY(data.endY)
    ),
  ];
  // 创建封口两个球面
  const sphereGeo = new THREE.SphereGeometry(raidus, 32, 16);
  const sphere1 = new THREE.Mesh(sphereGeo, sphereMaterial);
  // sphere1.renderOrder = 0
  const sphere2 = sphere1.clone();
  sphere1.position.set(points[0].x, points[0].y, points[0].z);
  sphere2.position.set(points[1].x, points[1].y, points[1].z);
  group.add(sphere1);
  group.add(sphere2);
  // 创建曲线
  const curve = new THREE.CatmullRomCurve3(points);
  curve.curveType = "catmullrom";
  curve.closed = false; //设置是否闭环
  curve.tension = 0; //设置线的张力，0为无弧度折线
  const geometry = new THREE.TubeGeometry(curve, 2, raidus, 16, false);
  const tube = new THREE.Mesh(geometry, tubeMaterial);
  // tube.renderOrder = 1
  tube.name = "hangtube";
  tube.userData = data;
  group.add(tube);
}


// 绘制巡检路线带流动动画效果

function drawLines2(group, lines, offset, scale) {
  const raidus = 1; // 半径
  const material = new THREE.MeshPhongMaterial({
    color: 0x55a9ff,
    side: THREE.DoubleSide,
    transparent: true, // 开启透明
    // opacity: 0.5, // 透明度
    shininess: 100,
  });
  lines.forEach((item, index) => {
    if (item.vertices.length > 1) {
      const points = item.vertices.map((point) => {
        const geometry = new THREE.SphereGeometry(raidus, 32, 16);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
          mapInfo.cadToWeb3dX(point.x),
          0,
          mapInfo.cadToWeb3dY(point.y)
        );
        group.add(sphere);

        return new THREE.Vector3(
          mapInfo.cadToWeb3dX(point.x),
          0,
          mapInfo.cadToWeb3dY(point.y)
        );
      });
      const curve = new THREE.CatmullRomCurve3(points);
      curve.curveType = "catmullrom";
      curve.closed = false; //设置是否闭环
      curve.tension = 0; //设置线的张力，0为无弧度折线
      const geometry = new THREE.TubeGeometry(curve, 2, raidus, 16, false);
      const tube = new THREE.Mesh(geometry, material);
      group.add(tube);
    }
  });
}

/**
 * 线拉伸成平面
 * @param { {x: number, y: number}[] } points 点
 * @param { number } radius 拉伸半径(宽度)
 * @returns { THREE.Vector2[] }
 */
function createShapeFromPoints(points, radius = 1) {
  let left = [];
  let right = [];

  for (let i = 0, len = points.length; i < len; i++) {
    let prev = points[i - 1] || {};
    let curr = points[i];
    let next = points[i + 1] || {};

    let v1 = [curr.x - prev.x, curr.y - prev.y];
    let v2 = [next.x - curr.x, next.y - curr.y];
    if (!prev.x && prev.x !== 0) {
      v1 = [...v2];
    } else if (!next.x && next.x !== 0) {
      v2 = [...v1];
    }

    let modelV1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2);
    let modelV2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2);
    // 单位向量
    v1 = [v1[0] / modelV1, v1[1] / modelV1];
    v2 = [v2[0] / modelV2, v2[1] / modelV2];
    // 方向和的单位向量
    let vector = [v1[0] + v2[0], v1[1] + v2[1]];
    let modelVector = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
    vector = [vector[0] / modelVector, vector[1] / modelVector];

    // 扩散点的方向和转角处的角度偏移
    let Lvector = rotateVector(vector, -Math.PI / 2);
    let Rvector = rotateVector(vector, Math.PI / 2);

    let deflection = vectorAngleCosHalf(v1, v2);

    deflection = deflection !== deflection ? 1 : deflection;

    left.push(
      new THREE.Vector2(
        curr.x + Lvector[0] * (radius / deflection),
        curr.y + Lvector[1] * (radius / deflection)
      )
    );
    right.unshift(
      new THREE.Vector2(
        curr.x + Rvector[0] * (radius / deflection),
        curr.y + Rvector[1] * (radius / deflection)
      )
    );

    prev = curr;
  }

  return left.concat(right);
}

/**
 * 向量夹角的cos值
 * @param { [number, number] } a
 * @param { [number, number] } b
 * @returns
 */
function vectorAngleCos(a, b) {
  return (
    (a[0] * b[0] + a[1] * b[1]) /
    (Math.sqrt(a[0] ** 2 + a[1] ** 2) * Math.sqrt(b[0] ** 2 + b[1] ** 2))
  );
}

/**
 * 向量夹角的一半的cos值
 * @param { [number, number] } a
 * @param { [number, number] } b
 * @returns
 */
function vectorAngleCosHalf(a, b) {
  return Math.sqrt((1 + vectorAngleCos(a, b)) / 2);
}

/**
 * 将点绕原点旋转
 * @param { [number, number] } param0
 * @param { number } angle
 * @returns { [number, number] }
 */
function rotateVector([x1, y1], angle) {
  let x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
  let y2 = y1 * Math.cos(angle) + x1 * Math.sin(angle);

  return [x2, y2];
}


// const floorGroup = new THREE.Group();
// floorGroup.name = "floor";
// let floorStone = null;

// 轮廓地图
// function initStoneFloor(data) {
//   const floorData = data.points;
//   const centerPoints = [...mapInfo.mapCenter];
//   centerPoints[0] += 450; // 轮廓图偏移
//   centerPoints[1] -= 500;
//   const shape = new THREE.Shape();
//   floorData.push(floorData[0]); // 闭合线路
//   const points = [];
//   floorData.forEach((item, index) => {
//     if (index === 1) {
//       shape.moveTo(item[0] - centerPoints[0], item[1] - centerPoints[1]);
//     } else {
//       shape.lineTo(item[0] - centerPoints[0], item[1] - centerPoints[1]);
//     }
//     points.push(
//       new THREE.Vector3(item[0] - centerPoints[0], item[1] - centerPoints[1], 0)
//     );
//   });

//   const canvas = document.createElement("canvas");
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   const ctx = canvas.getContext("2d");
//   // 创建线渐变色 - 四个参数为坐标
//   // const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight)
//   // gradient.addColorStop(0, '#3bb3ff')
//   // gradient.addColorStop(0.5, '#2060c1')
//   // gradient.addColorStop(1, '#3bb3ff')
//   // ctx.fillStyle = gradient
//   ctx.fillStyle = "#05647d";
//   ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
//   const canvasTexture = new THREE.CanvasTexture(canvas);

//   canvasTexture.colorSpace = THREE.SRGBColorSpace;
//   // canvasTexture.wrapT = THREE.RepeatWrapping;
//   canvasTexture.repeat.set(0.00009, 0.00009);
//   canvasTexture.offset.set(0.5, 0.5);
//   // 创建形状的几何体
//   const geometry = new THREE.ShapeGeometry(shape);
//   // 创建材质
//   const material = new THREE.MeshBasicMaterial({
//     color: 0x05647d,
//     // map:canvasTexture,
//     // color: 0xffffff,
//     // blending: THREE.AdditiveBlending,//在使用此材质显示对象时要使用何种混合。加法
//     transparent: true,
//     opacity: 0.4, // 透明度为0
//   });

//   floorStone = new THREE.Mesh(geometry, material);
//   floorStone.position.z = 0;
//   floorGroup.add(floorStone);

//   // 边缘线条
//   const lineMaterial2 = new LineMaterial({
//     color: 0xaaaaaa, // 线条颜色
//     linewidth: 5, // 线条宽度
//   });
//   lineMaterial2.resolution.set(window.innerWidth, window.innerHeight);
//   const lineMaterial = new THREE.LineBasicMaterial();

//   const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

//   const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
//   const lineGeometry2 = new LineGeometry();
//   lineGeometry2.fromLineSegments(lineSegments);
//   const line2 = new Line2(lineGeometry2, lineMaterial2);
//   floorGroup.add(line2);

//   const wall = creatWallByPath(floorData, centerPoints);
//   floorGroup.add(wall);

//   floorGroup.rotation.x = -Math.PI / 2; // 图纸旋转90度

//   floorGroup.scale.set(mapInfo.mapScale, mapInfo.mapScale, mapInfo.mapScale);
//   // floorGroup.position.y = 0.5 // 位置提高一点，方便浏览
//   scene.add(floorGroup);
// }

// function creatWallByPath(data, offset) {
//   // 1.1向y方向拉伸顶点
//   const verticesByTwo = data.reduce((arr, [x, y]) => {
//     return arr.concat([
//       [
//         [x - offset[0], y - offset[1], 0],
//         [x - offset[0], y - offset[1], -200],
//       ],
//     ]);
//   }, []);
//   // 2.解析需要渲染的四边形 每4个顶点为一组
//   const verticesByFour = verticesByTwo.reduce((arr, item, i) => {
//     if (i === verticesByTwo.length - 1) return arr;
//     return arr.concat([[item, verticesByTwo[i + 1]]]);
//   }, []);
//   // 3.将四边形面转换为需要渲染的三顶点面
//   const verticesByThree = verticesByFour.reduce((arr, item) => {
//     const [[point1, point2], [point3, point4]] = item;
//     return arr.concat(
//       ...point2,
//       ...point1,
//       ...point4,
//       ...point1,
//       ...point3,
//       ...point4
//     );
//   }, []);

//   const geometry = new THREE.BufferGeometry();
//   // 4. 设置position
//   const vertices = new Float32Array(verticesByThree);
//   geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
//   // 5. 设置uv 6个点为一个周期 [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1]

//   // 5.1 以18个顶点为单位分组
//   const pointsGroupBy18 = new Array(verticesByThree.length / 3 / 6)
//     .fill(0)
//     .map((item, i) => {
//       return verticesByThree.slice(i * 3 * 6, (i + 1) * 3 * 6);
//     });
//   // 5.2 按uv周期分组
//   const pointsGroupBy63 = pointsGroupBy18.map((item, i) => {
//     return new Array(item.length / 3)
//       .fill(0)
//       .map((it, i) => item.slice(i * 3, (i + 1) * 3));
//   });
//   // 5.3根据BoundingBox确定uv平铺范围
//   geometry.computeBoundingBox();
//   const { min, max } = geometry.boundingBox;
//   const rangeX = max.x - min.x;
//   const uvs = [].concat(
//     ...pointsGroupBy63.map((item) => {
//       const point0 = item[0];
//       const point5 = item[5];
//       const distance =
//         new THREE.Vector3(...point0).distanceTo(new THREE.Vector3(...point5)) /
//         (rangeX / 10);
//       return [0, 1, 0, 0, distance, 1, 0, 0, distance, 0, distance, 1];
//     })
//   );
//   geometry.setAttribute(
//     "uv",
//     new THREE.BufferAttribute(new Float32Array(uvs), 2)
//   );
//   // 更新法线
//   // geometry.computeVertexNormals();
//   // const myColors = verticesByFour.reduce((arr, item) => {
//   //     const [[point1, point2], [point3, point4]] = item;
//   //     const color1 = [0, 0, 0]
//   //     const color2 = [255, 255, 255]
//   //     return arr.concat(
//   //         ...color2,
//   //         ...color1,
//   //         ...color2,
//   //         ...color1,
//   //         ...color1,
//   //         ...color2
//   //     );
//   // }, []);

//   // geometry.setAttribute(
//   //     "color",
//   //     new THREE.BufferAttribute(new Float32Array(myColors), 3)
//   // );
//   // 顶点着色器
//   const vertexShader = `
//   uniform vec3 u_color;

//   uniform float time;
//   uniform float u_height;
//   varying float v_opacity;

//   void main() {
//     vec3 vPosition = position;
//     v_opacity = mix(1.0, 0.0, -position.z / u_height * 1.0) * (1.0 + sin(time) * 0.5);
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1);
// }
// `;

//   // 片元着色器
//   const fragmentShader = `
//           uniform vec3 u_color;
//           uniform float u_opacity;
//           varying float v_opacity;
//           void main() {
//               gl_FragColor = vec4(u_color, v_opacity * u_opacity);
//           }`;

//   const meshMat = new THREE.ShaderMaterial({
//     uniforms: {
//       u_height: {
//         value: 200,
//       },
//       u_opacity: {
//         value: 1,
//       },
//       u_color: {
//         value: new THREE.Color(0xc9d3da),
//       },
//     },
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     vertexShader: vertexShader,
//     fragmentShader: fragmentShader,
//   });

//   return new THREE.Mesh(geometry, meshMat);
// }

let reWorker;

// gltfLoader.load('../model/worker.glb', function (gltf) {
//     worker = gltf.scene;
//     worker.children[0].rotateY(Math.PI)
//     //   缩放
//     const sc = 10
//     worker.scale.set(sc, sc, sc)
// }, function (xhr) {
// })

function initWorker() {
  const texture = textureLoader.load(Worker);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture });
  reWorker = new THREE.Sprite(material);
  reWorker.scale.set(14, 14);
  reWorker.position.y = 5;
  // scene.add(worker)
}
initWorker();

function initLight() {
  // 加入环境光
  const ambientlight = new THREE.AmbientLight(0x404040); // 柔和的白光
  scene.add(ambientlight);
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position = THREE.Object3D.DEFAULT_UP

  scene.add(directionalLight);
}



// 实时监听人员定位
const peopleList = [];
// 限制显示人物
const displayPeopleList = props.displayPeopleList;

function changePeoples(peoplesData) {
  // 排列人物id
  const newPeoples = peoplesData.map((item) => item.userId);
  const oldPeoples = peopleList
    .filter((item) => item.visible)
    .map((item) => item.userData.userId);
  // 要新增显示的人物id
  const plusPeopleIds = _.difference(newPeoples, oldPeoples);
  // 要隐藏的人物id
  const minusPeopleIds = _.difference(oldPeoples, newPeoples);
  // 交集元素
  const samePeopleIds = _.intersection(newPeoples, oldPeoples);

  // 从人物数组中找出下线人物并隐藏
  if (minusPeopleIds.length > 0) {
    peopleList.forEach((item) => {
      if (minusPeopleIds.includes(item.userData.userId)) {
        item.visible = false;
        item.children.forEach((child) => {
          child.visible = false;
        });
      }
    });
  }
  // 新增人物
  if (plusPeopleIds.length > 0) {
    // 找出数组中是否已存在隐藏中的
    plusPeopleIds.forEach((itemId) => {
      // 找出符合id的对象
      const people = peopleList.find((item) => {
        return item.userData.userId === itemId;
      });
      // 找出当前数据
      const curPeopData = peoplesData.find((item) => {
        return item.userId === itemId;
      });

      if (displayPeopleList.length > 0) {
        if (!displayPeopleList.includes(curPeopData.userId)) return;
      }

      if (people === undefined) {
        // 对象没找到
        // 载入人物模型
        const worker = createWorkerModel(curPeopData);
        peopleList.push(worker);
        scene.add(worker);
      } else {
        // 对象处于隐藏状态
        people.position.set(
          mapInfo.cadToWeb3dX(curPeopData.x),
          people.position.y,
          mapInfo.cadToWeb3dY(curPeopData.y)
        );
        people.userData = curPeopData;
        people.visible = true; // 显示对象
        people.children.forEach((child) => {
          child.visible = true;
        });
      }
    });
  }

  // 当前存在的人物移动位置
  if (samePeopleIds.length > 0) {
    samePeopleIds.forEach((itemId) => {
      const people = peopleList.find((item) => {
        return item.userData.userId === itemId;
      });
      const curPeopData = peoplesData.find((item) => item.userId === itemId);
      gsap.to(people.position, {
        x: curPeopData.x,
        z: curPeopData.y,
        duration: 2,
      });
    });
  }
}

/**
 *
 * @param {{x:number,y:number,userId:any,username:string}} data
 * @returns THREE.Object3D
 */
function createWorkerModel(data) {
  // 载入人物模型
  const vertices = [0, 0, 0];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const material = new THREE.PointsMaterial({
    transparent: true,
    opacity: 0, // 透明度为0
  });
  const worker = new THREE.Points(geometry, material);
  worker.position.y = 2;
  worker.scale.set(20, 20);
  worker.position.set(data.x, worker.position.y, data.y);
  worker.userData = data;
  worker.name = "people";
  worker.add(create2DPeopleModel(data));
  // worker.add(createPeopleLableObj(data.username))
  return worker;
}

/**
 * 创建巡检人物
 * @param {*} param0
 */
function createPeopleSimple({ x, y, z, name, state }) {
  const texture = textureLoader.load(Worker);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture });
  const worker = new THREE.Sprite(material);
  worker.scale.set(10, 10);
  worker.position.set(x, 2, z);
  worker.add(createPeopleLableObj(name, state));
  peopleList.push(worker);
  scene.add(worker);
}

function showPeoples() {
  peopleList.forEach((item) => {
    item.visible = true;
  });
}

function hidePeoples() {
  peopleList.forEach((item) => {
    item.visible = false;
  });
}

// 新建人物头顶标签
function createPeopleLableObj(text) {
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "laber-name";
  const html = `<div style="background: url(${eCardBg}) no-repeat; background-size: 100% 100%;padding: 9px 13px 9px;">
        <div style="color:#fff;">${text}</div>
                </div>`;
  laberDiv.innerHTML = html;

  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0.5, 0);
  pointLabel.center.set(0.5, 1);
  // pointLabel.layers.set(0);
  return pointLabel;
}
/**
 * 建立人物模型
 * @param {any} data
 * @returns CSS2DObject
 */
function create2DPeopleModel(data) {
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "laber-name";
  const html = `<div style="position: relative;">
        <img style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px" src="${Worker}" alt="">
        <div style="position: absolute; top: -60px; left: 50%; transform: translate(-50%, 0); background: url(${eCardBg}) no-repeat; background-size: 100% 100%;padding: 9px 13px 9px;">
            <div style="color:#fff; white-space:nowrap;">${data.username}</div>
        </div>
    </div>`;
  laberDiv.innerHTML = html;

  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0);
  pointLabel.center.set(0.5, 0.5);
  // pointLabel.layers.set(0);
  return pointLabel;
}

function createPointDetailEs(data) {
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "p-detail";
  const html = `<div style="padding: 10px; background-color: #00000060; color: #fff;border: 1px solid #409EFF;border-radius: 5px;">
        ${data.name}
                </div>`;
  laberDiv.innerHTML = html;
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 12, 0);
  pointLabel.center.set(0.5, 1);
  pointLabel.visible = false;
  pointLabel.name = "detailDom";
  return pointLabel;
}


/**
 * 图表显示
 * @param {{ labels: string[], data:{ name:string, data:number[] } [] }} data
 */
function initChart(data) {
  if (data.data.length === 0) return;
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(document.getElementById("chart"));
  const clone = _.cloneDeep(data.data);
  clone.forEach((item) => {
    item.type = "line";
    item.showSymbol = false;
    item.smooth = true;
  });

  const legend = data.data.map((item) => item.name);

  // 指定图表的配置项和数据
  option = {
    xAxis: {
      type: "category",
      data: data.labels,
      axisLabel: {
        color: "#fff", //坐标的字体颜色
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "#fff", //坐标轴的颜色
          width: 0.5,
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff", //坐标的字体颜色
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "#fff", //坐标轴的颜色
          width: 0.5,
        },
      },
      splitLine: {
        lineStyle: {
          color: "#fff",
          width: 0.5,
          type: "dotted",
        },
      },
    },
    legend: {
      data: legend,
      icon: "circle",
      itemGap: 10,
      itemHeight: 8,
      align: "left",
      itemWidth: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: "#fff",
        fontSize: 14,
      },
      top: 30,
      right: 0,
    },
    grid: {
      top: 60,
      left: 30,
      right: 5,
      bottom: 20,
    },
    series: clone,
  };

  // // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

// 巡检点列表
let pointList = [];
const pointColor = 0x67c23a;
// 路线节点
let nodeList = [];
const nodeColor = 0xe6a23c;

let safeList = [];
const safeColor = 0x409eff;

let videoList = [];
const videoColor = 0xc700ed;
// 绘制点方法
// function initAllpoints(rows) {
//     removeAllPoints()
//     // 如果之前没有加载模型就重新建立
//     if (pointMode == 1) {
//         initCheckPoints(rows)
//     } else {
//         initNodePoints(rows)
//     }
// }

const pointData = ref([]);
// 加载巡检点模型
function initCheckPoints() {
  emits('callCheckPoints')
}

function backCheckPoints(data) {
  data.forEach((item, index) => {
    if (props.editMode) {
      pointList[index] = createPointModelEs(item, pointColor, "point");
    } else {
      pointList[index] = createPointModel(item);
    }
    scene.add(pointList[index]);
  });

  if (!props.editMode) {
    nearValue = controls.getDistance();
    mergePointData(pointList);
  }
  pointData.value = data;
}

async function putCheckPoints(rows) {
  console.log(rows);
  rows.forEach((item, index) => {
    if (props.editMode) {
      pointList[index] = createPointModelEs(item, pointColor, "point");
    } else {
      pointList[index] = createPointModel(item);
    }
    scene.add(pointList[index]);
  });
}
// 聚合数据函数
function mergePointData(data) {
  data.forEach((item) => {
    item.children[0].visible = true;
  });
  data.forEach((item, index) => {
    if (index === 0 || item.children[0].visible) {
      item.includeIds = [];
      data.forEach((item2, index2) => {
        if (index2 > 0 && item.id !== item2.id && item2.children[0].visible) {
          if (hasNearPoint(item, item2)) {
            item2.children[0].visible = false;
            item.includeIds.push(item2.uuid);
          }
        }
      });
    }
  });
  initMergeNumer(data);
}
let nearValue; // 靠近距离
// 判断靠近点
function hasNearPoint(item, item2) {
  return item.position.distanceTo(item2.position) < nearValue / 10;
}

// 新建标签
function createTextLableObj(text) {
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.style.fontWeight = "bold";
  laberDiv.style.fontSize = "18px";
  laberDiv.style.color = "#fff";
  laberDiv.innerHTML = text;
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0);
  pointLabel.center.set(0.5, 0.1);
  return pointLabel;
}

function initMergeNumer(data) {
  data.forEach((item) => {
    if (item.children[0].visible) {
      if (item.children[0].children.length > 0) {
        item.children[0].remove(item.children[0].children[0]);
      }
      if (item.includeIds.length + 1 > 1) {
        const css2d = createTextLableObj(item.includeIds.length + 1);
        item.children[0].add(css2d);
      }
    } else {
      if (item.children[0].children.length > 0) {
        item.children[0].remove(item.children[0].children[0]);
      }
    }
  });
}

// 屏幕点模型
function createPointModel(item) {
  const vertices = [0, 0, 0];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const material = new THREE.PointsMaterial({
    transparent: true,
    opacity: 0, // 透明度为0
  });
  const point = new THREE.Points(geometry, material);
  point.name = "point";
  point.userData = item;
  point.position.set(
    mapInfo.cadToWeb3dX(item.posX),
    0,
    mapInfo.cadToWeb3dY(item.posY)
  );
  let css2Model;
  if (props.modType === "zh") {
    // 灾害
    css2Model = create2DPointModelForZh(item);
  } else if (props.modType === "jc") {
    // 降尘
    css2Model = create2DPointModelForJc(item);
  } else if (props.modType === "ky") {
    // 矿压
    css2Model = create2DPointModelForKy(item);
  } else {
    // 瓦斯
    css2Model = create2DPointModelForWs(item);
  }
  css2Model.name = "pointModel";
  point.add(css2Model);
  return point;
}

// 屏幕点模型
function createSafe2DModel(item) {
  const vertices = [0, 0, 0];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const material = new THREE.PointsMaterial({
    transparent: true,
    opacity: 0, // 透明度为0
  });
  const point = new THREE.Points(geometry, material);
  point.name = "point";
  point.userData = item;
  point.position.set(
    mapInfo.cadToWeb3dX(item.posX),
    0,
    mapInfo.cadToWeb3dY(item.posY)
  );
  const css2Model = create2DPointModelForSafe(item);
  css2Model.name = "pointModel";
  point.add(css2Model);
  return point;
}

function createPointModelEs(item, color, name) {
  const geometry = new THREE.ConeGeometry(3, 10, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  // 灰色
  const grayMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
  geometry.rotateX(Math.PI);
  geometry.translate(0, 5, 0);
  let point
  if (item.boundTask == 0 && item.pointType == 1) {
    point = new THREE.Mesh(geometry, grayMaterial);
  } else {
    point = new THREE.Mesh(geometry, material);
  }
  point.name = name;
  point.userData = item;
  point.position.set(
    mapInfo.cadToWeb3dX(item.posX),
    0,
    mapInfo.cadToWeb3dY(item.posY)
  );
  if (name === "point") {
    point.add(createPointDetailEs(item));
  }
  return point;
}

function create2DPointModelForWs(item) {
  const pointPics = [PointPic1, PointPic2, PointPic3, PointPic4, PointPic5];
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "p-model";
  const html = `<div style="background: url(${pointPics[item.inspecStatus]
    }) no-repeat; background-size: 100% 100%; width: 124px; height: 106px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 12px; color: #fff;">
        ${item.name}
    </div>`;
  laberDiv.innerHTML = html;
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0); // 在父元素的相对位置
  pointLabel.center.set(0.5, 1); // DOM元素中心点位置（1，1）=（100%，100%）
  laberDiv.addEventListener("mouseenter", function (event) {
    debouncedClose.cancel();
    if (props.hasPointsDialog) {
      showPopupDetail(event, item);
    }
  });
  laberDiv.addEventListener("mouseleave", debouncedClose);
  return pointLabel;
}

function removePathMesh() {
  pathMesh.geometry.dispose();
  pathMesh.material.dispose();
  scene.remove(pathMesh);
}

function create2DPointModelForSafe(item) {
  let object;
  switch (item.sensorType) {
    case 90:
      object = SafeZa;
      break;
    case 91:
      object = SafeTs;
      break;
    case 92:
      object = SafeBn;
      break;
  }
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "p-model";
  const html = `<div style="display: flex;flex-direction: column;align-items: center;"><div>${item.name}</div>
    <div style="background: url(${object}) no-repeat; background-size: 100% 100%; width: 50px; height: 60px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 12px; color: #fff;">
        </div></div>`;
  laberDiv.innerHTML = html;
  laberDiv.style.zIndex = 9;
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0); // 在父元素的相对位置
  pointLabel.center.set(0.5, 1); // DOM元素中心点位置（1，1）=（100%，100%）
  return pointLabel;
}
// 八大灾害图标
const zhBd = [ZhDb0, ZhDb1, ZhDb2, ZhDb3];
const zhFc = [ZhFc0, ZhFc1, ZhFc2, ZhFc3];
const zhFmh = [ZhFmh0, ZhFmh1, ZhFmh2, ZhFmh3];
const zhKy = [ZhKy0, ZhKy1, ZhKy2, ZhKy3];
const zhSh = [ZhSh0, ZhSh1, ZhSh2, ZhSh3];
const zhWs = [ZhWs0, ZhWs1, ZhWs2, ZhWs3];
const zhZx = [ZhZx0, ZhZx1, ZhZx2, ZhZx3];
const zhTf = [ZhTf0, ZhTf1, ZhTf2, ZhTf3];

function create2DPointModelForZh(item) {
  let object;
  switch (item.sensorType) {
    case 20:
      object = zhTf;
      break;
    case 21:
      object = zhFc;
      break;
    case 22:
      object = zhWs;
      break;
    case 23:
      object = zhFmh;
      break;
    case 24:
      object = zhSh;
      break;
    case 25:
      object = zhBd;
      break;
    case 26:
      object = zhKy;
      break;
    case 27:
      object = zhZx;
      break;
    // default:
    //     object = zhZx
    //     break;
  }
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "p-model";
  const html = `<div style="background: url(${object[item.inspecStatus]
    }) no-repeat; background-size: 100% 100%; width: 50px; height: 60px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 12px; color: #fff;"></div>`;
  laberDiv.innerHTML = html;
  laberDiv.style.zIndex = 9;
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0); // 在父元素的相对位置
  pointLabel.center.set(0.5, 1); // DOM元素中心点位置（1，1）=（100%，100%）
  laberDiv.addEventListener("mouseenter", function (event) {
    debouncedClose.cancel();
    if (props.hasPointsDialog) {
      showPopupDetail(event, item);
    }
  });
  laberDiv.addEventListener("mouseleave", debouncedClose);
  return pointLabel;
}

function create2DPointModelForTf(item) {
  let object;
  switch (item.sensorType) {
    case "cgq":
      object = zhTf;
      break;
    case "kzq":
      object = zhBd;
      break;
    default:
      object = zhTf;
      break;
  }
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "p-model";
  const html = `<div style="background: url(${object[item.inspecStatus]
    }) no-repeat; background-size: 100% 100%; width: 50px; height: 60px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 12px; color: #fff;"></div>`;
  laberDiv.innerHTML = html;
  laberDiv.style.zIndex = 9;
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0); // 在父元素的相对位置
  pointLabel.center.set(0.5, 1); // DOM元素中心点位置（1，1）=（100%，100%）
  laberDiv.addEventListener("mouseenter", function (event) {
    debouncedClose.cancel();
    if (props.hasPointsDialog) {
      showPopupDetail(event, item);
    }
  });
  laberDiv.addEventListener("mouseleave", debouncedClose);
  return pointLabel;
}
const jCDx = [JcDx0, JcDx1, JcDx2, JcDx3];
const jCPd = [JcPd0, JcPd1, JcPd2, JcPd3];
const jCZc = [JcZc0, JcZc1, JcZc2, JcZc3];
const jCZz = [JcZz0, JcZz1, JcZz2, JcZz3];
const jcJh = JcJh;
/**
 * 降尘点模型
 * @param {*} item
 * @returns {CSS2DObject}
 */
function create2DPointModelForJc(item) {
  let object;
  switch (item.sensorType) {
    case 40:
      object = jCDx;
      break;
    case 41:
      object = jCPd;
      break;
    case 42:
      object = jCZc;
      break;
    case 43:
      object = jCZz;
      break;
    case 44:
      object = jcJh;
      break;
  }
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "p-model";
  if (item.sensorType === 44) {
    laberDiv.innerHTML = `<div style="background: url(${object}) no-repeat; background-size: 100% 100%; width: 96px; height: 69px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 24px; color: #fff;line-height: 26px;">
        ${item.composeCount}
    </div>`;
  } else {
    laberDiv.innerHTML = `<div style="background: url(${object[item.inspecStatus]
      }) no-repeat; background-size: 100% 100%; width: 140px; height: 106px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 12px; color: #fff;line-height: 26px;">
        ${item.name}
    </div>`;
  }
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0); // 在父元素的相对位置
  pointLabel.center.set(0.5, 1); // DOM元素中心点位置（1，1）=（100%，100%）
  laberDiv.addEventListener("mouseenter", function (event) {
    debouncedClose.cancel();
    if (props.hasPointsDialog) {
      showPopupDetail(event, item);
    }
  });
  laberDiv.addEventListener("mouseleave", debouncedClose);
  return pointLabel;
}

const kyky = [KyKy0, KyKy1, KyKy2, KyKy3];
const kydb = [KyDb0, KyDb1, KyDb2, KyDb3];
const kyzk = [KyZk0, KyZk1, KyZk2, KyZk3];
const kymg = [KyMg0, KyMg1, KyMg2, KyMg3];
/**
 * 矿压点模型
 * @param {*} item
 * @returns {CSS2DObject}
 */
function create2DPointModelForKy(item) {
  let object;
  switch (item.sensorType) {
    case 50:
      object = kyky;
      break;
    case 51:
      object = kydb;
      break;
    case 52:
      object = kymg;
      break;
    case 53:
      object = kyzk;
      break;
  }
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "p-model";
  if (item.sensorType === 44) {
    laberDiv.innerHTML = `<div style="background: url(${object}) no-repeat; background-size: 100% 100%; width: 96px; height: 69px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 24px; color: #fff;line-height: 26px;">
        ${item.composeCount}
    </div>`;
  } else {
    laberDiv.innerHTML = `<div style="background: url(${object[item.inspecStatus]
      }) no-repeat; background-size: 100% 100%; width: 140px; height: 106px;padding: 8px 2px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 12px; color: #fff;line-height: 26px;">
        ${item.name}
    </div>`;
  }
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(0, 0, 0); // 在父元素的相对位置
  pointLabel.center.set(0.5, 1); // DOM元素中心点位置（1，1）=（100%，100%）
  laberDiv.addEventListener("mouseenter", function (event) {
    debouncedClose.cancel();
    if (props.hasPointsDialog) {
      showPopupDetail(event, item);
    }
  });
  laberDiv.addEventListener("mouseleave", debouncedClose);
  return pointLabel;
}

// 加载路径节点点模型
function initNodePoints() {
  emits('callNodePoints')
}

function backNodePoints(data) {
  data.forEach((item, index) => {
    nodeList[index] = createPointModelEs(item, nodeColor, "node");
    scene.add(nodeList[index]);
  });
}

function initSafePoints() {
  emits('callSafePoints')
}

function backSafePoints(data) {
  data.forEach((item, index) => {
    if (props.editMode) {
      safeList[index] = createPointModelEs(item, safeColor, "point");
    } else {
      safeList[index] = createSafe2DModel(item);
    }
    scene.add(safeList[index]);
  });
}

function initVideoPoints() {
  emits('callVideoPoints')
}

function backVideoPoints(data) {
  data.forEach((item, index) => {
    videoList[index] = createPointModelEs(item, videoColor, "point");
    scene.add(videoList[index]);
  });
}
/**
 * 建立单个避难点
 * @param {*} item
 */
function putSimpleSafePoint(item) {
  const point = createSafe2DModel(item);
  scene.add(point);
}

// 在场景中隐藏所有点
function hiddenAllPoints() {
  hiddenCheckPoints();
  hiddenNodePoints();
}

function hiddenCheckPoints() {
  pointList.forEach((item) => {
    item.visible = false;
  });
}

function hiddenNodePoints() {
  nodeList.forEach((item) => {
    item.visible = false;
  });
}

// 在场景中删除所有点
function removeAllPoints() {
  removeCheckPoints();
  removeNodePoints();
  removeSafePoints();
  removeVideoPoints();
}

function removeCheckPoints() {
  scene.remove(...pointList);
  pointList = [];
}

function removeNodePoints() {
  scene.remove(...nodeList);
  nodeList = [];
}

function removeSafePoints() {
  scene.remove(...safeList);
  safeList = [];
}

function removeVideoPoints() {
  scene.remove(...videoList);
  videoList = [];
}
// 获取点数据 1是巡检点，2是路径节点
const pointType = ref(1);
// getPointData(pointMode)

function getPointData(value) {
  removeAllPoints();
  // 标记点
  if (value === 1) {
    initCheckPoints();
  } else if (value == 2) {
    initNodePoints();
  } else if (value == 3) {
    initSafePoints();
  } else if (value == 4) {
    initVideoPoints();
  }
}

function getAllPointData() {
  initCheckPoints();
  initNodePoints();
  initSafePoints();
}


// 实时改变点的状态
function changePointStatusForWs(pointData) {
  const point = pointList.find(
    (item) => item.userData.id == pointData.id
  );
  if (point !== undefined) {
    point.remove(point.children[0]);
    const css2Model = create2DPointModelForWs(point.userData);
    css2Model.name = "pointModel";
    point.add(css2Model);
    point.userData = pointData;
  }
}

// 重置巡检带点颜色
function resetPointColor() {
  if (currentObj) {
    pointList.forEach((item) => {
      if (item.currentHex) {
        item.material.color.setHex(item.currentHex);
      }
    });
    nodeList.forEach((item) => {
      if (item.currentHex) {
        item.material.color.setHex(item.currentHex);
      }
    });
    safeList.forEach((item) => {
      if (item.currentHex) {
        item.material.color.setHex(item.currentHex);
      }
    });
    currentObj = null;
  }
}

let currentObj;

// 窗口位置
// const appMain = document.getElementsByClassName('app-main')[0]
// const mainContainer = document.getElementsByClassName('main-container')[0]

let offsetTop = 0; //appMain.offsetTop // 84
let offsetLeft = 0; //mainContainer.offsetLeft200 // 200

let inspectPthInfo = [];
// 巡检路线坐标
let checkLinePoints = ref([]);
// 巡检路线
let checkLine;

let crossPointList = ref([]);
// 画巡检路线
function drawCheckLine(intersect) {
  // 创建线条材质
  const lineMaterial = new LineMaterial({
    color: 0xff0000, // 线条颜色
    linewidth: 5, // 线条宽度
    dashed: false, // 是否是虚线
    depthTest: false, //
  });
  //材质的分辨率必须设置，要不显示的线宽度不正确
  lineMaterial.resolution.set(window.innerWidth, window.innerHeight);

  if (intersect.object.name === "node" || intersect.object.name === "point") {
    // 相同点不处理
    if (
      inspectPthInfo.length > 0 &&
      inspectPthInfo[inspectPthInfo.length - 1] === intersect.object.userData.id
    )
      return;
    checkLinePoints.value.push(
      intersect.object.position.x,
      intersect.object.position.y,
      intersect.object.position.z
    );
    inspectPthInfo.push(intersect.object.userData.id);

    if (intersect.object.name === "point") {
      crossPointList.value.push(intersect.object.userData);
    }
    if (checkLinePoints.value.length >= 6) {
      // 移除之前的线条
      if (checkLine) {
        scene.remove(checkLine);
      }
      const lineGeometry = new LineGeometry();
      lineGeometry.setPositions(new Float32Array(checkLinePoints.value));
      // 创建 Line2 对象
      checkLine = new Line2(lineGeometry, lineMaterial);

      // 将线条添加到场景中
      scene.add(checkLine);
      // 路径经过巡检点
      // postPointsForCheck(formatPosition(checkLinePoints)).then(res => {
      //     crossPointList.value = res.data
      // })
    }
  }
}

const pathTypeOps = [
  { label: "巡检路线", value: 0 },
  { label: "逃生路线", value: 1 },
];
// 路径弹窗
const checkLineDialogVisible = ref(false);

const checkLineFormRef = ref();
// 表单校验
const checkLineRules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
});

const lineOpt = ref(0); // 0: 关闭 1:添加 2:删除 3: 延长
// 添加巡检路线
function addLine() {
  if (message) {
    message.close();
  }
  canSelectPoint.value = true;
  canSetline.value = true;
  message = ElMessage({
    message: "请在选择线路经过的标点",
    type: "info",
    duration: 0,
  });
  lineOpt.value = 1;
  hideChangeLine();
}

// 提交元素
const checkLineForm = reactive({
  name: "",
  pathType: "", // 1:巡检路线 2:救援路线
});
// 巡检路线弹窗
function openCheckLineDialog() {
  if (checkLinePoints.value.length > 1) {
    checkLineForm.pathType = 1;
    checkLineDialogVisible.value = true;
  }
}
// 关闭添加线路弹窗
function handleCloseLineDialog() {
  message.close();
  canSelectPoint.value = false;
  canSetline.value = false;
  removeDrawLine();
  lineOpt.value = 0;
}

function delLine() {
  if (message) {
    message.close();
  }
  hideChangeLine();
  lineOpt.value = 2;
}
function plusLine() {
  if (message) {
    message.close();
  }
  canSelectPoint.value = true;
  canSetline.value = true;
  message = ElMessage({
    message: "请在选择线路经过的标点",
    type: "info",
    duration: 0,
  });
  removeDrawLine();
  hideChangeLine();
  lineOpt.value = 3;
}
let currentPathData;

const checkLineUpdateDialogVisible = ref(false);
function openUpdateLine() {
  if (message) {
    message.close();
  }
  currentPathData = checkLineList.find((item) => {
    return item.userData.id === checkLineValue.value;
  }).userData;
  checkLineUpdateDialogVisible.value = true;
}

// 提交点表单数据
function updateLineSubmitData() {
  let tempForm = {};
  const oldInspectionPath = currentPathData.inspectionPath;
  const endPointPosition = oldInspectionPath[oldInspectionPath.length - 1];
  const endPointPositionV3 = transformVector3(
    endPointPosition.x,
    endPointPosition.y,
    endPointPosition.z
  );
  const newInspectionPath = formatPosition(checkLinePoints.value);
  const newStartPointPositionV3 = transformVector3(
    newInspectionPath[0].x,
    newInspectionPath[0].y,
    newInspectionPath[0].z
  );
  if (endPointPositionV3.distanceTo(newStartPointPositionV3) < 0.1) {
    // 两个点距离太靠近认为同一个地点了就去除一个
    newInspectionPath.shift();
  }
  tempForm.inspectionPath = JSON.stringify([
    ...oldInspectionPath,
    ...newInspectionPath,
  ]);

  const oldInspectPthInfo = currentPathData.inspectPthInfo.split(",");
  const endInspect = oldInspectPthInfo[oldInspectPthInfo.length - 1];
  if (endInspect === inspectPthInfo[0]) {
    // 第一个巡检点与新巡检点相同，去除一个
    inspectPthInfo.shift();
  }
  tempForm.inspectPthInfo = [...oldInspectPthInfo, ...inspectPthInfo].join(",");
  tempForm.id = currentPathData.id;
  return tempForm;
}
// 修改延长巡检路线
function updateCheckLine() {
  // updateLyPath(updateLineSubmitData());
  emits('callUpdateCheckLine', updateLineSubmitData())
  // removeDrawLine();
  // hideChangeLine();
  // lineOpt.value = 0;
  // canSelectPoint.value = false;
  // canSetline.value = false;
  // checkLineUpdateDialogVisible.value = false;
}

function backUpdateCheckLine() {
  removeDrawLine();
  hideChangeLine();
  lineOpt.value = 0;
  canSelectPoint.value = false;
  canSetline.value = false;
  checkLineUpdateDialogVisible.value = false;
}
const bindPointId = ref();
const safeLineOpt = ref(0); // 0:关闭 1:添加 2:删除
const showBindSelecter = ref(false);
function addSafeLine() {
  if (message) {
    message.close();
  }
  canSelectPoint.value = false;
  canSetline.value = false;
  showBindSelecter.value = true;
  safeLineOpt.value = 1;
  bindPointId.value = null;
  removeDrawLine();
  hideChangeLine();
}

function startDraweSafe() {
  canSelectPoint.value = true;
  canSetline.value = true;
  showBindSelecter.value = false;
  message = ElMessage({
    message: "请在选择线路经过的标点",
    type: "info",
    duration: 0,
  });
  const object = pointList.find((item) => {
    return item.userData.id === bindPointId.value;
  });
  const intersect = {
    object,
  };
  drawCheckLine(intersect);
  selcetPointForline(intersect);
}

function openAddSafeLineDialog() {
  if (checkLinePoints.value.length > 1) {
    checkLineForm.pathType = 2;
    checkLineDialogVisible.value = true;
  }
}

function delSafeLine() {
  if (message) {
    message.close();
  }
  canSelectPoint.value = false;
  canSetline.value = false;
  showBindSelecter.value = true;
  safeLineOpt.value = 2;
  bindPointId.value = null;
  removeDrawLine();
  hideChangeLine();
}

function handleChangeBindPoint(val) { }

// 巡检路线坐标数组转换成x，y，z
/**
 * 格式转换：[ 1,2,3,... ] => [ {x:1,y:2,z:3},... ]
 * @param { number[] } arr
 * @returns { {x:number,y:number,z:number}[] }
 */
function formatPosition(arr) {
  const ops = ["x", "y", "z"];
  const tempArr = [];
  const tempObj = {};
  arr.forEach((item, index) => {
    if (ops[index % 3] == "x") {
      tempObj[ops[index % 3]] = mapInfo.web3dToCadX(item);
    } else if (ops[index % 3] == "y") {
      tempObj[ops[index % 3]] = item;
    } else {
      tempObj[ops[index % 3]] = mapInfo.web3dToCadY(item);
    }

    // tempObj[ops[index % 3]] = item
    if (index % 3 === 2) {
      tempArr.push({ ...tempObj }); // 复制对象避免数据污染
    }
  });
  // y 轴坐标重置为0
  tempArr.forEach((item) => {
    item.y = 0;
  });
  return tempArr;
}

/**
 * CAD转换世界坐标
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
function transformVector3(x, y, z) {
  return new THREE.Vector3(mapInfo.cadToWeb3dX(x), y, mapInfo.cadToWeb3dY(z));
}

// 移除巡检路线
function removeDrawLine() {
  resetPointColor();
  scene.remove(checkLine);
  checkLinePoints.value = [];
  inspectPthInfo = [];
  crossPointList.value = [];
}

// 提交点表单数据
function checkLineSubmitData() {
  const tempForm = { ...checkLineForm };
  tempForm.inspectionPath = JSON.stringify(
    formatPosition(checkLinePoints.value)
  );
  tempForm.inspectPthInfo = inspectPthInfo.join(",");
  tempForm.workspaceId = bindPointId.value;
  tempForm.modType = props.modType;
  tempForm.laneJson = JSON.stringify(selectedTubes.value);
  return tempForm;
}
// function escapeLineSubmitData() {
//     const tempForm = { ...checkLineForm }
//     tempForm.modType = props.modType
//     tempForm.workspaceId = bindPointId.value
//     tempForm.manualEscapePath = JSON.stringify(formatPosition(checkLinePoints.value))
//     return tempForm
// }

async function submitCheckLine(formEl) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // await saveCheckLine(checkLineSubmitData());
      emits('callCreateCheckLine', checkLineSubmitData())
      // checkLineDialogVisible.value = false;
      // ElMessage({
      //   message: "添加成功",
      //   type: "success",
      // });
      // checkLineFormRef.value?.resetFields();
      // getPointData(1);
      // removeDrawLine();
      // getCheckLineData(pathType.value);
    } else {
      console.log("error submit!", fields);
    }
  });
}


function backCreateCheckLine() {
  checkLineDialogVisible.value = false;
  ElMessage({
    message: "添加成功",
    type: "success",
  });
  checkLineFormRef.value?.resetFields();
  getPointData(1);
  removeDrawLine();
  getCheckLineData(pathType.value);
}

// 选择点
function selcetPoint(intersect) {
  if (intersect.object.name === "point" || intersect.object.name === "node") {
    if (currentObj != intersect.object) {
      if (currentObj) currentObj.material.color.setHex(currentObj.currentHex);

      currentObj = intersect.object;
      currentObj.currentHex = currentObj.material.color.getHex();
      currentObj.material.color.setHex(0xffffff);
    } else {
      if (currentObj) currentObj.material.color.setHex(currentObj.currentHex);
      currentObj = null;
    }
  }
  // hiddenAllDetail()
}

function selcetPointForline(intersect) {
  if (intersect.object.name === "point" || intersect.object.name === "node") {
    currentObj = intersect.object;
    currentObj.currentHex = currentObj.material.color.getHex();
    currentObj.material.color.setHex(0xffffff);
  }
  // hiddenAllDetail()
}


const sensorTypeOps = ref([]);

const safeTypeOps = ref([
  { label: "障碍物", value: 90 },
  { label: "避难硐室", value: 91 },
  { label: "临时避难点", value: 92 },
]);

const videoTypeOps = ref([
  { label: "监控主机", value: -1 },
  { label: "摄像头", value: 60 },
]);
function getSensors() {
  if (props.modType === "zh") {
    sensorTypeOps.value = [
      { label: "通风", value: 20 },
      { label: "粉尘", value: 21 },
      { label: "瓦斯", value: 22 },
      { label: "防灭火", value: 23 },
      { label: "水害", value: 24 },
      { label: "顶板", value: 25 },
      { label: "科研", value: 26 },
      { label: "专项", value: 27 },
    ];
  } else if (props.modType === "jc") {
    sensorTypeOps.value = [
      { label: "大巷", value: 40 },
      { label: "皮带", value: 41 },
      { label: "转载", value: 42 },
      { label: "综采", value: 43 },
      { label: "聚合", value: 44 },
      { label: "分站", value: -1 },
    ];
  } else if (props.modType === "ky") {
    sensorTypeOps.value = [
      { label: "矿压", value: 50 },
      { label: "顶板", value: 51 },
      { label: "锚杆", value: 52 },
      { label: "钻孔", value: 53 },
    ];
  } else if (props.modType === "hz") {
    sensorTypeOps.value = [
      { label: "煤柱", value: 0 },
      { label: "密闭墙", value: 1 },
      { label: "采面", value: 2 },
      { label: "分站", value: -1 },
    ];
  } else if (props.modType === "ws") {
    sensorTypeOps.value = [
      { label: "1巡点", value: 1 },
      { label: "2巡点", value: 2 },
      { label: "3巡点", value: 3 },
    ];
  }
}
getSensors();

function translateSensor(val) {
  const res = sensorTypeOps.value.find((item) => item.value === val);
  if (res) {
    return res.label;
  } else {
    return "未知";
  }
}

// 弹窗
const pointDialogVisible = ref(false);
//弹窗标题
const pointTitle = ref();
// 提交元素
const pointForm = reactive({
  name: "",
  posX: 0,
  posY: 0,
  posZ: 0,
  isInlet: null,
  sensorType: props.modType == "ws" ? 1 : null,
  transformPositionX: 0,
  transformPositionY: 0,
  deviceId: "",
});
// 表单校验
const pointFormRef = ref();
const pointRules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  sensorType: [{ required: true, message: "请选择类型", trigger: "change" }],
  isInlet: [{ required: true, message: "请选择类型", trigger: "change" }],
  composeCount: [{ required: true, message: "输入数量", trigger: "blur" }],
});

// 提交点表单数据
function pointSubmitData() {
  const tempForm = { ...pointForm };
  tempForm.pointType = pointType.value;
  tempForm.posX = pointForm.transformPositionX;
  tempForm.posY = pointForm.transformPositionY;
  if (optionForm.mode === 1) {
    tempForm.modType = props.modType;
  }

  return tempForm;
}

// 打开弹窗
function openAddPointDialog(intersect) {
  // console.log(intersect.point.x, intersect.point.z);
  pointForm.posX = intersect.point.x;
  pointForm.posY = intersect.point.z;
  pointForm.posZ = 0;
  // 修改坐标
  pointForm.transformPositionX = mapInfo.web3dToCadX(intersect.point.x);
  pointForm.transformPositionY = mapInfo.web3dToCadY(intersect.point.z);

  pointDialogVisible.value = true;
  pointTitle.value = "添加坐标";
}
//取消按钮
function handleClosePoDialog() {
  delete pointForm.id;
  pointForm.name = "";
  pointForm.posX = 0;
  pointForm.posY = 0;
  pointForm.posZ = 0;
  pointForm.transformPositionX = 0;
  pointForm.transformPositionY = 0;
  pointForm.isInlet = null;
  if (props.modType === "ws") {
    pointForm.sensorType = 1;
  } else {
    pointForm.sensorType = null;
  }
  pointDialogVisible.value = false;
  canPutPoint.value = false;
  canSelectPoint.value = false;
  message.close();
}
// 添加巡检点
async function submitPoint(formEl) {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const temp = pointSubmitData();
      if (isNaN(temp.posX) || isNaN(temp.posY) || isNaN(temp.posZ))
        return ElMessage.error("坐标错误");
      if (temp.id) {
        emits('callUpdatePoint', pointSubmitData())
        // const res = await updateLyInspection(pointSubmitData());

        // ElMessage({
        //   message: "修改成功",
        //   type: "success",
        // });
        // handleClosePoDialog();
        // getPointData(pointType.value);
      } else {
        emits('callCreatePoint', pointSubmitData())
        // const res = await postInspection(pointSubmitData());

        // ElMessage({
        //   message: "添加成功",
        //   type: "success",
        // });
        // getPointData(pointType.value);
        // handleClosePoDialog();
      }
    } else {
      console.log("error submit!", fields);
    }
  });
}


function backCreateUpdatePoint() {
  ElMessage({
    message: "操作成功",
    type: "success",
  });
  handleClosePoDialog();
  getPointData(pointType.value);

}
//修改巡检点弹窗
// function delPoint() {
//     if (currentObj !== undefined) {
//         pointForm.posX = currentObj.userData.posX
//         pointForm.posY = currentObj.userData.posY
//         pointForm.posZ = currentObj.userData.posZ
//         pointForm.id = currentObj.userData.id
//         pointForm.name = currentObj.userData.name
//         pointDialogVisible.value = true
//         pointTitle.value = "修改坐标"
//     }
// }
let checkLineData = ref([]);
// threejs实体数据
let checkLineList = [];
// 获取巡检路线
async function getCheckLineData(pathType) {
  emits('callCheckLines', pathType)
  // const res = await getCheckLineList({
  //   modType: props.modType,
  //   pathType,
  // });
  // if (res.rows.length === 0) return;
  // checkLineData.value = res.rows.map((item) => {
  //   if (item.inspectionPath !== "") {
  //     item.inspectionPath = JSON.parse(item.inspectionPath);
  //   }
  //   return item;
  // });
  // initCheckLineList(checkLineData.value);
}

function backCheckLines(data) {
  if (data.length === 0) return;
  checkLineData.value = data.map((item) => {
    if (item.inspectionPath !== "") {
      item.inspectionPath = JSON.parse(item.inspectionPath);
    }
    return item;
  });
  initCheckLineList(checkLineData.value);
}

function initCheckLineList(rows) {
  if (checkLineList.length > 0) {
    scene.remove(...checkLineList);
  }
  checkLineList = rows.map((item) => {
    return createCheckLine2(item);
  });
  scene.add(...checkLineList);
}

function showAllLine() {
  checkLineData.value.forEach((item) => {
    const line = createCheckLine(item);
    scene.add(line);
    // console.log(createCheckLine(item));
  });
}
// 绘制巡检路线
function createCheckLine(item) {
  const v3Arr = [];
  if (item.inspectionPath !== "") {
    const path = item.inspectionPath;
    path.forEach((point) => {
      // y 轴抬高一点好辨识
      v3Arr.push(
        mapInfo.cadToWeb3dX(point.x),
        point.y + 1.0,
        mapInfo.cadToWeb3dY(point.z)
      );
    });
  }
  const lineMaterial = new LineMaterial({
    color: 0xff0000, // 线条颜色
    linewidth: 4, // 线条宽度
    dashed: false, // 是否是虚线
  });
  //材质的分辨率必须设置，要不显示的线宽度不正确
  lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
  const lineGeometry = new LineGeometry();
  lineGeometry.setPositions(new Float32Array(v3Arr));
  // 创建 Line2 对象
  const line2 = new Line2(lineGeometry, lineMaterial);
  line2.userData = item;
  // line2.visible = true
  return line2;
}

// 绘制巡检路线带流动动画效果
function createCheckLine2(item) {
  const checkLineTexture = textureLoader.load(BlueLineTexture);
  let curve;
  if (item.inspectionPath !== "") {
    const path = item.inspectionPath;
    const points = path.map((item) => transformVector3(item.x, item.y, item.z));
    curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = "catmullrom";
    curve.closed = false; //设置是否闭环
    curve.tension = 0; //设置线的张力，0为无弧度折线
  }

  checkLineTexture.colorSpace = THREE.SRGBColorSpace;
  checkLineTexture.wrapS = THREE.RepeatWrapping;
  const length = curve.getLength(); // 获取线段长度
  checkLineTexture.repeat.set(length / 10, 1);
  gsap.to(checkLineTexture.offset, {
    x: -1,
    duration: 1,
    repeat: -1,
    ease: "none",
  });

  const geometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
  const material = new THREE.MeshBasicMaterial({
    // color: 0x00ff00,
    map: checkLineTexture,
    side: THREE.DoubleSide,
    depthTest: false
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = item;
  mesh.visible = false;
  return mesh;
}

function drawCheckLineSimple(inspectionPath) {
  const v3Arr = [];
  if (inspectionPath !== "") {
    const path = inspectionPath;
    path.forEach((point) => {
      // y 轴抬高一点好辨识
      v3Arr.push(
        mapInfo.cadToWeb3dX(point.x),
        point.y + 1.0,
        mapInfo.cadToWeb3dY(point.z)
      );
    });
  }
  const lineMaterial = new LineMaterial({
    color: 0x28a7e6, // 线条颜色
    linewidth: 4, // 线条宽度
    dashed: false, // 是否是虚线
  });
  //材质的分辨率必须设置，要不显示的线宽度不正确
  lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
  const lineGeometry = new LineGeometry();
  lineGeometry.setPositions(new Float32Array(v3Arr));
  // 创建 Line2 对象
  const line2 = new Line2(lineGeometry, lineMaterial);
  scene.add(line2);
}
/**
 *
 * @param {object} inspectionPath
 */
function drawEscapeLine(inspectionPath) {
  const checkLineTexture = textureLoader.load(BlueLineTexture);
  let curve;
  if (inspectionPath !== "") {
    const path = inspectionPath;
    const points = path.map((item) => transformVector3(item.x, item.y, item.z));
    curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = "catmullrom";
    curve.closed = false; //设置是否闭环
    curve.tension = 0; //设置线的张力，0为无弧度折线
  }

  checkLineTexture.colorSpace = THREE.SRGBColorSpace;
  checkLineTexture.wrapS = checkLineTexture.wrapT = THREE.RepeatWrapping;
  const length = curve.getLength(); // 获取线段长度
  checkLineTexture.repeat.set(length / 10, 1);
  gsap.to(checkLineTexture.offset, {
    x: -1,
    duration: 1,
    repeat: -1,
    ease: "none",
  });
  const geometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
  const material = new THREE.MeshBasicMaterial({
    map: checkLineTexture,
    depthTest: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

let pathMesh;
// 选择点显示巡检路线
function createShowLine(inspectionPath) {
  const checkLineTexture3 = textureLoader.load(BlueLineTexture);
  let curve;
  if (inspectionPath !== "") {
    const path = inspectionPath;
    const points = path.map((item) => transformVector3(item.x, item.y, item.z));
    curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = "catmullrom";
    curve.closed = false; //设置是否闭环
    curve.tension = 0; //设置线的张力，0为无弧度折线
  }

  checkLineTexture3.colorSpace = THREE.SRGBColorSpace;
  checkLineTexture3.wrapS = checkLineTexture3.wrapT = THREE.RepeatWrapping;
  const length = curve.getLength(); // 获取线段长度
  checkLineTexture3.repeat.set(length / 10, 1);
  gsap.to(checkLineTexture3.offset, {
    x: -1,
    duration: 1,
    repeat: -1,
    ease: "none",
  });

  const geometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
  const material = new THREE.MeshBasicMaterial({
    // color: 0x00ff00,
    map: checkLineTexture3,
    side: THREE.DoubleSide,
  });
  pathMesh = new THREE.Mesh(geometry, material);
  scene.add(pathMesh);
}

// 选中线路 单选
const checkLineValue = ref();
function handleChangeLine(value) {
  checkLineList.forEach((item) => {
    item.visible = false;
  });
  checkLineList.forEach((item) => {
    if (item.userData.id === value) {
      item.visible = true;
    }
  });
}
function hideChangeLine() {
  checkLineList.forEach((item) => {
    item.visible = false;
  });
  checkLineValue.value = null;
}
// 选中线路 多选
const checkLineValue2 = ref();
function handleChangeLine2() {
  // console.log(checkLineValue2.value);
  checkLineList.forEach((item) => {
    item.visible = false;
  });

  checkLineList.forEach((item) => {
    if (checkLineValue2.value.includes(item.userData.id)) {
      item.visible = true;
    }
  });
}
// 移除所有巡检线路
function removeAllCheckLine() {
  scene.remove(...checkLineList);
}
// 删除巡检线路
async function delCheckLine() {
  if (checkLineValue.value) {
    // await delCheckLineById(checkLineValue.value);
    emits('callDelCheckLine', checkLineValue.value)
    // removeAllCheckLine();
    // getCheckLineData(pathType.value);
    // checkLineValue.value = "";
  }
}

function backDelCheckLine() {
  removeAllCheckLine();
  getCheckLineData(pathType.value);
  checkLineValue.value = "";
}

// 回放线路
function playWorkerPath(path) {
  scene.remove(reWorker);
  makeCurve(path);
  scene.add(reWorker);
  // walkAction.play()
  reWorker.position.set(path[0].x, reWorker.position.y, path[0].z);
  isStop = false;
}
let curve; // 存放路径对象
let progress = 0; // 物体运动时在运动路径的初始位置，范围0~1
let velocity = 1 / 5000; // 影响运动速率的一个值，范围0~1，需要和渲染频率结合计算才能得到真正的速率

function changePlayVelcoity(val) {
  velocity = val / 5000;
}
// 绘制线路
function makeCurve(path) {
  //Create a closed wavey loop

  const points = path.map((item) => transformVector3(item.x, item.y, item.z));
  // console.log(points);
  curve = new THREE.CatmullRomCurve3(points);
  curve.curveType = "catmullrom";
  curve.closed = false; //设置是否闭环
  curve.tension = 0.1; //设置线的张力，0为无弧度折线
}

// 播放控制
let isStop = true;
// 物体沿线移动方法
function moveOnCurve() {
  if (isStop) return;
  if (curve == null || reWorker == null) {
    // console.log("Loading")
  } else {
    emits("playProgress", progress);
    if (progress <= 1 - velocity) {
      const point = curve.getPointAt(progress); //获取样条曲线指定点坐标
      const pointBox = curve.getPointAt(progress + velocity); //获取样条曲线指定点坐标
      hasTouchPoint(point);
      // 粒子效果
      // createFlash(point)

      // 建立路线尾部画线
      pathPointsBuf.push(point.x, 1, point.z);
      pathVertices = new Float32Array(pathPointsBuf);

      pathGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(pathVertices, 3)
      );
      // 建立路线尾部画线
      createMovePathLine();
      if (point && pointBox) {
        reWorker.position.set(point.x, reWorker.position.y, point.z);
        controls.enabled = false;
        camera.position.set(point.x, point.y + 100, point.z + 100);
        camera.lookAt(point.x, point.y, point.z);
        reWorker.lookAt(pointBox.x, pointBox.y, pointBox.z); //因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。
      }
      progress += velocity;
    } else {
      progress = 0;
      stopPathMovie();
    }
  }
}
let taskIndex = ref(0);
// 触碰距离
const touchDistance = 5;
// 需要巡查的点数组
let taskPoints = [];
function hasTouchPoint(peoplePosition) {
  if (taskPoints.length === 0) return;
  const tar = new THREE.Vector3(
    mapInfo.cadToWeb3dX(taskPoints[taskIndex.value].posX),
    taskPoints[taskIndex.value].posZ,
    mapInfo.cadToWeb3dY(taskPoints[taskIndex.value].posY)
  );
  if (tar.distanceTo(peoplePosition) < 5) {
    emits("touchPoint", taskIndex.value);
    const point = pointList.find(
      (po) => po.userData.id === taskPoints[taskIndex.value].id
    );
    taskPoints[taskIndex.value].inspecStatus = 1;
    point.remove(point.children[0]);
    const css2Model = create2DPointModelForWs(taskPoints[taskIndex.value]);
    css2Model.name = "pointModel";
    point.add(css2Model);
    if (taskPoints.length - 1 > taskIndex.value) {
      taskIndex.value++;
    }
  }
}
// function hasTouchPoint(peoplePosition) {
//     if (taskPoints.length === 0) return
//     taskPoints.forEach(item => {
//         const tar = new THREE.Vector3(mapInfo.cadToWeb3dX(item.posX), 0, mapInfo.cadToWeb3dY(item.posY))
//         if (tar.distanceTo(peoplePosition) < touchDistance) {
//             if (item.inspecStatus === 0) {
//                 // console.log('抵达');
//                 const point = pointList.find(po => po.userData.id === item.id)
//                 item.inspecStatus = 1
//                 point.remove(point.children[0])
//                 const css2Model = create2DPointModelForWs(item)
//                 css2Model.name = 'pointModel'
//                 point.add(css2Model)
//             }
//         }
//     })

// }

const pathMaterial = new THREE.LineBasicMaterial();
const pathGeometry = new THREE.BufferGeometry();
let pathPointsBuf = [];
let pathVertices = new Float32Array(pathPointsBuf);
let pathLine2;
function createMovePathLine() {
  const pathLineMaterial = new LineMaterial({
    color: 0xe6a23c, // 线条颜色
    linewidth: 8, // 线条宽度
    depthTest: false,
  });
  //材质的分辨率必须设置，要不显示的线宽度不正确
  pathLineMaterial.resolution.set(window.innerWidth, window.innerHeight);

  pathGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(pathVertices, 3)
  );
  const pathLine = new THREE.LineSegments(pathGeometry, pathMaterial);
  const pathLineGeometry = new LineGeometry();
  if (pathPointsBuf.length > 6) {
    if (pathLine2) {
      removePathLine2();
    }
    pathLineGeometry.fromLineSegments(pathLine);
    pathLine2 = new Line2(pathLineGeometry, pathLineMaterial);
    scene.add(pathLine2);
  }
}

function removePathLine2() {
  scene.remove(pathLine2);
  pathLine2.geometry.dispose();
  pathLine2.material.dispose();
  pathLine2 = null;
}

// 停止回放
function stopPathMovie() {
  // controls.enabled = true
  isStop = true;
  curve = null;
  progress = 0;
  // scene.remove(worker)
  // // 初始化相机状态
  // camera.position.set(0, 150, 100)
  // camera.lookAt(0, 0, 0)
  // controls.target.set(0, 0, 0)
}

// 显示详情
function showDetail(object) {
  object.traverse((item) => {
    if (item.name === "detailDom") {
      item.visible = true;
    }
  });
}
// 隐藏所有的标签
function hiddenAllDetail() {
  scene.traverse((item) => {
    if (item.name === "detailDom") {
      // if (item.parent.uuid !== currentObj?.uuid) {
      item.visible = false;
      // }
    }
  });
}
const raycaster = new THREE.Raycaster();
// 获取投射目标
function getIntersects({ clientX, clientY }) {
  if (container.value.offsetWidth) {
    const mouse = new THREE.Vector2(
      ((clientX - offsetLeft) / container.value.offsetWidth) * 2 - 1,
      -((clientY - offsetTop) / container.value.offsetHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene, true);
    return intersects;
  } else {
    return [];
  }
}
// 鼠标单击场景
function handleClickScene(event) {
  if (!props.editMode) return;
  const intersects = getIntersects(event);
  if (intersects.length <= 0) return void 0;
  if (isTube.value) {
    selectTube(intersects[0]);
  } else {
    if (canSetline.value && canSelectPoint.value) {
      // 绘制巡检路线
      drawCheckLine(intersects[0]);
      selcetPointForline(intersects[0]);
    } else if (canDrawArea.value) {
      drawMineArea(intersects[0]);
    } else if (canSelectPoint.value) {
      selcetPoint(intersects[0]);
    }
  }
}
// 处理点击底部添加点
function handllerdblclickScene(event) {
  if (!props.editMode) return;
  const intersects = getIntersects(event);
  if (intersects.length <= 0) return void 0;
  if (canPutPoint.value) {
    // 添加点弹窗
    openAddPointDialog(intersects[0]);
  }
}
// 鼠标经过处理
async function handleMousemoveScene(event) {
  const intersects = getIntersects(event);
  handleDetail(intersects, event);
}
function handleDetail(intersects, event) {
  if (!props.editMode) {
    // if (props.modType === 'tf') {
    //     if (intersects.length > 0) {
    //         const flag = intersects.some(item => item.object.name == 'airLine')
    //         if (flag) {
    //             const airLine = intersects.find(item => item.object.name == 'airLine')
    //             showAirDetail(event, airLine.object.userData)
    //         } else {
    //             hiddenAirDetail()
    //         }
    //     }
    // }
  } else {
    hiddenAllDetail();
    if (intersects.length > 0) {
      if (intersects[0].object.name === "point") {
        showDetail(intersects[0].object);
      }
    }
  }
}

const chartLoading = ref(false);
// async function getChartData(id) {
//   chartLoading.value = true;

//   const res = await getChartById({
//     workspaceId: id,
//     modType: props.modType,
//   }).finally(() => {
//     chartLoading.value = false;
//   });
//   return res.data;
// }

const popupDetailStyle = reactive({
  top: 0,
  left: 0,
  display: "none",
});
const outDetailData = ref(null);

function isOpenCard() {
  if (outDetailData.value) {
    return true;
  } else {
    return false;
  }
}

let currentChartId = "";
const detailTableData = ref([]);
const detailLoading = ref(false);
const popupCardRef = ref()
function showPopupDetail(event, object) {
  const top = event.target.getBoundingClientRect().top;
  const left = event.target.getBoundingClientRect().left;
  // console.log(event.target.getBoundingClientRect());
  popupDetailStyle.display = "block";
  setTimeout(() => {
    // console.log('弹出窗口', popupCardRef.value.getBoundingClientRect());
    popupDetailStyle.top = (top - popupCardRef.value.getBoundingClientRect().height) + "px";
    popupDetailStyle.left = left + "px";
  }, 0)


  // popupDetailStyle.top = event.clientY > (offsetTop + 210) ? (event.clientY - offsetTop) - 220 + 'px' : 0 + 'px'
  // popupDetailStyle.left = (event.clientX - offsetLeft + 10) + 'px'

  outDetailData.value = object;
  if (currentChartId === object.id || chartLoading.value) return;
  currentChartId = object.id;
  if (myChart) {
    myChart.dispose();
    myChart = undefined;
  }
  if (props.modType === "zh") return;

  setTimeout(() => {
    emits('callPopupChart', object.id)
    detailLoading.value = true;
    chartLoading.value = true;
    // const data = await getChartData(object.id).finally(() => {
    //   detailLoading.value = false;
    // });
    // if (props.modType === "jc") {
    //   detailTableData.value = data.data;
    // } else {
    //   initChart(data);
    //   myChart.resize();
    // }
  }, 0);
}

function backPopupChart(data) {
  chartLoading.value = false;
  detailLoading.value = false;
  if (props.modType === "jc") {
    detailTableData.value = data.data;
  } else {
    initChart(data);
    myChart.resize();
  }

}

function hiddenOutDetail() {
  popupDetailStyle.display = "none";
}

const optionForm = reactive({
  mode: 1,
});
// 允许添加点
let canPutPoint = ref(false);
// 允许添加点
let canSelectPoint = ref(false);
// 绘制巡检路线
let canSetline = ref(false);
// 可绘制区域
let canDrawArea = ref(false);
const pathType = ref(0);
// 改变点模式
function handleChangePointMode(val) {
  removeAllPoints();
  removeDrawLine();
  removeAreaPoints();
  hideChangeLine();
  canPutPoint.value = false;
  canSelectPoint.value = false;
  canSetline.value = false;
  canDrawArea.value = false;
  pointOpt.value = 0;
  lineOpt.value = 0;
  areaOpt.value = 0;
  if (message) {
    message.close();
  }
  if (val <= 3) {
    pointType.value = val;
    getPointData(val);
  } else if (val == 4) {
    getPointData(1);
    resetPointColor();
    removeDrawLine();
    getCheckLineData(1);
    pathType.value = 1;
  } else if (val == 5) {
    // handleChangeSetLine(false)
  } else if (val == 6) {
    getAllPointData();
    resetPointColor();
    removeDrawLine();
    getCheckLineData(2);
    pathType.value = 2;
  } else if (val == 7) {
    pointType.value = 4;
    getPointData(4);
  }
}
// 设置巡检路线
function handleChangeSetLine(val) {
  canSetline.value = val;
  resetPointColor();
  removeDrawLine();
}

const showForm = reactive({
  pointFilter: -1,
});
// 过滤巡检点
function handleChangePointFilter(val) {
  pointFilter = val - 0;
  if (pointType.value === 1) {
    if (pointFilter === -1) {
      getPointData(pointType.value);
    } else {
      filterPointType(pointFilter);
    }
  }
}

/**
 * 播放线路带路线上所有的巡检点
 * @param {string} pathStr
 * @param {any[]} pointData
 */
async function playWorkerPathOnAllPoints(path, pointData) {
  pointData.forEach((item) => {
    item.inspecStatus = 0;
  });
  pointData.forEach((item, index) => {
    const point = createPointModel(item, false);
    pointList.push(point);
    scene.add(point);
  });
  taskPoints = pointData;
  taskIndex.value = 0;
  playWorkerPath(path);
}

let animationId;
// 销毁场景
function clearScene() {
  cancelAnimationFrame(animationId);
  scene.traverse((child) => {
    if (child.material) {
      child.material.dispose();
    }
    if (child.geometry) {
      child.geometry.dispose();
    }
    child = null;
  });
  // renderer.forceContextLoss();
  renderer.dispose();
  scene.clear();
}

/*
                                  x pt
                                x   |         |
                              x     |         |
                            x       |         |
                          x         |         |
                        x           |         |
                      x             |         |
                    x               |         | --> Vector = (pt - targetPt), distance = |pt-targetPt|
                  x                 |         |
                x                   |         |
              x                     |         |
            x                       |         |
          x    cost@                |         |
          pt1----------pt2          targetPt     warningPt
      */
function calculateDistance(pt1, pt2, pt) {
  const egdeV1 = new THREE.Vector3().subVectors(pt2, pt1);
  const egdeV2 = new THREE.Vector3().subVectors(pt, pt1);

  // translate to normalize
  const v1Norm = egdeV1.clone().normalize();
  const v2Norm = egdeV2.clone().normalize();
  // calculate the cos@ between vector 1 and vector 2
  const cos1 = v1Norm.dot(v2Norm);

  const egdeV3 = new THREE.Vector3().subVectors(pt, pt2);
  const egdeV4 = new THREE.Vector3().subVectors(pt1, pt2);
  const v3Norm = egdeV3.clone().normalize();
  const v4Norm = egdeV4.clone().normalize();
  // calculate the cos@ between vector 1 and vector 2
  const cos2 = v3Norm.dot(v4Norm);

  // make sure to angel are less than 90, the distance will be located at red line
  if (cos2 > 0 && cos1 > 0) {
    const sin = Math.sqrt(1 - cos1 * cos1);

    const yDistance = pt1.distanceTo(pt);
    const distance = yDistance * sin;

    // calculate target point
    const xDistance = yDistance * cos1;
    const dir = egdeV1.clone().normalize().multiplyScalar(xDistance);
    const targetPt = pt1.clone().add(dir);

    return {
      pt1: pt1,
      pt2: pt2,
      pt: pt,
      distance: distance,
      targetPt: targetPt,
    };
  }

  return null;
}
// const vec1 = new THREE.Vector3(0, 0, 3);
// const vec2 = new THREE.Vector3(3, 0, 0);
// const vec = new THREE.Vector3(-1, 0, -1);
// const temp = calculateDistance(vec1, vec2, vec)
// console.log(temp);

let completeLines = [];

function drawCompleteLine(positionList) {
  const lineMaterial = new LineMaterial({
    color: 0x3ab904, // 线条颜色
    linewidth: 5, // 线条宽度
    dashed: false, // 是否是虚线
  });
  lineMaterial.resolution.set(window.innerWidth, window.innerHeight);

  positionList.forEach((item) => (item.y = 1.0));
  const material = new THREE.LineBasicMaterial();
  const points = positionList.map((item) =>
    transformVector3(item.x, item.y, item.z)
  );
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.LineSegments(geometry, material);
  const lineGeometry = new LineGeometry();
  lineGeometry.fromLineSegments(line);
  const line2 = new Line2(lineGeometry, lineMaterial);
  completeLines.push(line2);
  scene.add(line2);
}

// 移除所有完成路线的线路
// function removeCompleteLines() {
//   scene.remove(...completeLines);
//   completeLines = [];
// }
// drawCompleteLine(linePositions)

// const router = useRouter();
// 返回路由
function goback() {
  emits('goback')
  // router.back();
}


let areaPoints = [];
const areaGroup = new THREE.Group();
areaGroup.name = "area";
areaGroup.rotation.x = Math.PI / 2; // 图纸旋转90度
areaGroup.position.y = 0;
let drawShapeMash;
scene.add(areaGroup);
// 画平面fixme
function drawMineArea(intersect) {
  clearAreaGroup();
  areaPoints.push(intersect.point);
  createAreaFlag(areaPoints);
  const shape = new THREE.Shape();
  areaPoints.forEach((item, index) => {
    if (index === 0) {
      shape.moveTo(item.x, item.z);
    } else {
      shape.lineTo(item.x, item.z);
    }
  });
  shape.lineTo(areaPoints[0].x, areaPoints[0].z); // 闭合路径
  // 创建形状的几何体
  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6, // 透明度为0
    side: THREE.DoubleSide,
    depthTest: false,
  });
  drawShapeMash = new THREE.Mesh(geometry, material);
  areaGroup.add(drawShapeMash);
}
let areaFlagGroup = [];

function createAreaFlag(areaPoints) {
  clearAreaFlagGroup();
  areaPoints.forEach((item) => {
    const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const capsule = new THREE.Mesh(geometry, material);
    capsule.position.x = item.x;
    capsule.position.y = item.y;
    capsule.position.z = item.z;
    scene.add(capsule);
    areaFlagGroup.push(capsule);
  });
}
function clearAreaFlagGroup() {
  areaFlagGroup.forEach((obj) => {
    scene.remove(obj);
    obj.geometry.dispose();
    obj.material.dispose();
  });
  areaFlagGroup = [];
}

function clearAreaGroup() {
  // areaPointList.forEach(obj => {
  //     areaGroup.remove(obj)
  //     obj.geometry.dispose();
  //     obj.material.dispose();
  // })
  // areaPointList = []

  if (drawShapeMash) {
    areaGroup.remove(drawShapeMash);
    drawShapeMash.geometry.dispose();
    drawShapeMash.material.dispose();
  }
}

const areaData = ref([]);
// 获取工作面数据
async function getAreaData() {
  clearMineFaceGroup();
  emits('callAreaData')
}

function backAreaData(data) {
  areaData.value = data.map((item) => {
    item.points = JSON.parse(item.points);
    item.points.forEach((item) => {
      item.x = mapInfo.cadToWeb3dX(item.x);
      item.z = mapInfo.cadToWeb3dY(item.z);
    });
    return item;
  });
  areaData.value.forEach((item, index) => {
    initMineFace(item);
  });
}

let mineFaceGroup = new THREE.Group();
mineFaceGroup.name = "mineFace";
mineFaceGroup.rotation.x = Math.PI / 2; // 图纸旋转90度
scene.add(mineFaceGroup);
// 配置工作面纹理素材
const areaTexture1 = textureLoader.load(Stone1);
areaTexture1.colorSpace = THREE.SRGBColorSpace
areaTexture1.wrapS = areaTexture1.wrapT = THREE.RepeatWrapping;
areaTexture1.repeat.set(0.02, 0.02);
areaTexture1.offset.set(0.5, 0.5)

const areaTexture2 = textureLoader.load(Stone2);
areaTexture2.colorSpace = THREE.SRGBColorSpace
areaTexture2.wrapS = areaTexture2.wrapT = THREE.RepeatWrapping;
areaTexture2.repeat.set(0.02, 0.02);
areaTexture2.offset.set(0.5, 0.5)
// 建立工作面模型
function initMineFace(data) {
  const shape = new THREE.Shape();
  let maxX, minX, maxZ, minZ;
  data.points.forEach((item, index) => {
    if (index === 0) {
      maxX = item.x;
      minX = item.x;
      maxZ = item.z;
      minZ = item.z;
      shape.moveTo(item.x, item.z);
    } else {
      shape.lineTo(item.x, item.z);
      if (maxX < item.x) {
        maxX = item.x;
      }
      if (minX > item.x) {
        minX = item.x;
      }
      if (maxZ < item.z) {
        maxZ = item.z;
      }
      if (minZ > item.z) {
        minZ = item.z;
      }
    }
  });
  const xLength = maxX - minX;
  const zLength = maxZ - minZ;
  //计算中心点
  const center = { x: maxX - xLength / 2, y: maxZ - zLength / 2, z: 0 };

  shape.lineTo(data.points[0].x, data.points[0].z); // 闭合路径

  let texture
  if (data.fenceType === 1) {
    texture = areaTexture1
  } else if (data.fenceType === 2) {
    texture = areaTexture2
  }
  // 创建形状的几何体
  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    // transparent: true,
    // opacity: 0.6, // 透明度为0
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  // const css2Obj = createAreaLableObj(data.name, center);
  mesh.name = "faceObj";
  // mesh.add(css2Obj) //
  const plane = createTextPlane(data.name, center, data.angle)
  mesh.add(plane)
  mineFaceGroup.add(mesh);
}

// 新建标签
function createAreaLableObj(text, center) {
  let laberDiv = document.createElement("div"); //创建div容器
  // laberDiv.textContent = text;
  // laberDiv.style.color = '#409eff'
  const html = `
        <div style="color:#fff; font-family: 'PangMenZhengDao';font-size: 20px;">${text}</div>`;
  laberDiv.innerHTML = html;

  let label = new CSS2DObject(laberDiv);
  label.position.set(center[0], center[1], 0);
  label.center.set(0.5, 0.5);
  return label;
}

function clearMineFaceGroup() {
  mineFaceGroup.children.forEach((mesh) => {
    mesh.remove(mesh.children[0]);
  });
  scene.remove(mineFaceGroup);
  mineFaceGroup = new THREE.Group();
  mineFaceGroup.name = "mineFace";
  mineFaceGroup.rotation.x = Math.PI / 2; // 图纸旋转90度
  mineFaceGroup.position.y = 1;
  scene.add(mineFaceGroup);
}
const areaForm = reactive({
  name: "",
  fenceType: 2,
});

const fenceTypeOps = [
  { value: 1, label: "煤区" },
  { value: 2, label: "采空区" },
];

const areaRules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  fenceType: [{ required: true, message: "请选择类型", trigger: "change" }],
});
const areaFormRef = ref();
const addAreaDialogVisible = ref(false);

function addArea() {
  if (message) {
    message.close();
  }
  canDrawArea.value = true;
  message = ElMessage({
    message: "请在地图上标记",
    type: "info",
    duration: 0,
  });

  areaOpt.value = 1;
}

// 打开添加工作面接口
function openAddAreaDialog() {
  if (areaPoints.length > 2) {
    addAreaDialogVisible.value = true;
  }
}

async function submitArea() {
  const valid = await areaFormRef.value.validate();
  if (valid) {
    const transformAreaPoints = areaPoints.map((item) => {
      return {
        x: mapInfo.web3dToCadX(item.x),
        y: item.y,
        z: mapInfo.web3dToCadY(item.z),
      };
    });
    emits('callCreateArea', {
      ...areaForm,
      points: JSON.stringify(transformAreaPoints),
    })
    // await addLyEFence({
    //   ...areaForm,
    //   points: JSON.stringify(transformAreaPoints),
    // });

    // addAreaDialogVisible.value = false;
    // getAreaData();
  }
}
function backCreateArea() {
  addAreaDialogVisible.value = false;
  getAreaData();
}

const areaOpt = ref(0); // 0: 关闭 1:添加 2:删除

function delArea() {
  if (message) {
    message.close();
  }
  canDrawArea.value = false;
  removeAreaPoints();
  areaOpt.value = 2;
}

const areaId = ref("");

async function submitDelArea() {
  if (areaId.value) {
    emits('callDelArea',areaId.value)
    // await delLyEFence(areaId.value);
    // getAreaData();
    // areaId.value = null;
  }
}

function backDelArea() {
  getAreaData();
  areaId.value = null
}

function handleCloseAreaDialog() {
  message.close();
  removeAreaPoints();
  areaFormRef.value.resetFields();
  canDrawArea.value = false;
}

function removeAreaPoints() {
  clearAreaFlagGroup();
  clearAreaGroup();
  areaPoints = [];
}


let onlyPeopleList = [];

function setCurrentTask(data) {
  onlyPeopleList = data.map((item) => item.peopleInfo.userId);
  // console.log(data);
  data.forEach((item) => {
    createStateLine(item.inspectionPath, item.completeInspectionPath);
    createPeopleSimple(item.peopleInfo);
    item.inspections.forEach((inspection) => {
      scene.add(createPointModel(inspection, false));
    });
  });
}

function createStateLine(inspectionPath, completeInspectionPath) {
  drawCheckLineSimple(JSON.parse(inspectionPath));
  drawCompleteLine(JSON.parse(completeInspectionPath));
}

// 获取表格的对应内容
function getTableValue(value) {
  return outDetailData.value.realTimeData[value];
}

function tableHeader(index) {
  if (outDetailData.value.dataFields === undefined) return "";
  if (outDetailData.value.dataFields.length >= index + 1) {
    return outDetailData.value.dataFields[index].label;
  } else {
    return "";
  }
}

function tableBody(index) {
  if (outDetailData.value.dataFields === undefined) return "";
  if (outDetailData.value.dataFields.length >= index + 1) {
    return getTableValue(outDetailData.value.dataFields[index].value);
  } else {
    return "";
  }
}

function tableData(val) {
  const value = outDetailData.value.realTimeData[val];
  if (value === undefined) {
    return "";
  } else {
    return value;
  }
}
// 坐标转换
const getCadX = mapInfo.web3dToCadX;
const getCadY = mapInfo.web3dToCadY;

function returnThreeX(num) {
  return ((num - mapInfo.mapCenter[0]) / 10).toFixed(2) - 0;
}
function returnThreeY(num) {
  return ((num - mapInfo.mapCenter[1]) / -10).toFixed(2) - 0;
}
// function getCadX(x) {
//     return x * 10 + mapInfo.mapCenter[0]
// }
// function getCadY(y) {
//     return y * 10 + mapInfo.mapCenter[1]
// }

// const transformPositionX = computed({
//     get: () => pointForm.posX * 10 + mapInfo.mapCenter[0],
//     set: (val) => {
//         if (isNaN((val - mapInfo.mapCenter[0]) / 10)) {
//             pointForm.posX = ''
//         } else {
//             pointForm.posX = (val - mapInfo.mapCenter[0]) / 10
//         }
//     }
// })

// const transformPositionY = computed({
//     get: () => pointForm.posZ * 10 + mapInfo.mapCenter[1],
//     set: (val) => {
//         if (isNaN((val - mapInfo.mapCenter[0]) / 10)) {
//             pointForm.posX = ''
//         } else {
//             pointForm.posZ = (val - mapInfo.mapCenter[1]) / 10
//         }
//     }
// })

function optionPointName() {
  if (props.modType == "hz") {
    return "工作点";
  } else if (props.modType == "tf") {
    return "节点";
  } else {
    return "巡检点";
  }
}
const isInletOpt = [
  { label: "无", value: 1 },
  { label: "进风口", value: 2 },
  { label: "出风口", value: 3 },
];
const pointOpt = ref(0); //0:关闭 1:添加 2:修改, 3:删除
let message;
function addPoint() {
  if (message) {
    message.close();
  }
  resetPointColor();
  pointOpt.value = 1;
  canPutPoint.value = true;
  message = ElMessage({
    message: "请在地图上双击添加标点",
    type: "info",
    duration: 0,
  });
}
// 修改节点
function editPoint() {
  if (message) {
    message.close();
  }
  pointOpt.value = 2;
  canSelectPoint.value = true;
  message = ElMessage({
    message: "请在选择修改标点",
    type: "info",
    duration: 0,
  });
}

// 修改节点
function openEditPointdialog() {
  if (currentObj !== undefined) {
    pointDialogVisible.value = true;
    pointForm.id = currentObj.userData.id;
    pointForm.name = currentObj.userData.name;
    pointForm.posX = mapInfo.cadToWeb3dX(currentObj.userData.posX);
    pointForm.posY = mapInfo.cadToWeb3dY(currentObj.userData.posY);
    pointForm.isInlet = currentObj.userData.isInlet;
    pointForm.transformPositionX = currentObj.userData.posX;
    pointForm.transformPositionY = currentObj.userData.posY;
    pointForm.deviceId = currentObj.userData.deviceId;
  }
  // canSelectPoint.value = false
  // resetPointColor()
  // message.close()
}

// 删除巡检点
async function delPoint() {
  if (message) {
    message.close();
  }
  resetPointColor();
  pointOpt.value = 3;
  message = ElMessage({
    message: "请在选择删除标点",
    type: "error",
    duration: 0,
  });
  canSelectPoint.value = true;
}

// 删除巡检点
function submitDelPoint() {
  if (message) {
    message.close();
  }
  if (currentObj !== undefined) {
    const id = currentObj.userData.id;
    // await delPointByIds(id);
    emits('callDelPoint', id)
  }
  canSelectPoint.value = false;
}

function backDelPoint() {
  getPointData(pointType.value);
  resetPointColor();
}

function createAirPath(item) {
  const points = item.points.map((item) =>
    transformVector3(item.x, item.y, item.z)
  );
  const curve = new THREE.CatmullRomCurve3(points);
  curve.curveType = "catmullrom";
  curve.closed = false; //设置是否闭环
  curve.tension = 0; //设置线的张力，0为无弧度折线

  const length = curve.getLength(); // 获取线段长度
  let texture;
  // 颜色划分
  if (item.resultVal - 0 > 0) {
    texture = BlueLineTexture;
  } else {
    texture = RedLineTexture;
  }
  if (item.needWind) {
    texture = GreenLineTexture;
  }
  const airLineTexture = textureLoader.load(texture);
  airLineTexture.colorSpace = THREE.SRGBColorSpace;
  airLineTexture.wrapS = THREE.RepeatWrapping;
  airLineTexture.repeat.set(length / 10, 1);
  gsap.to(airLineTexture.offset, {
    x: -1,
    duration: 1,
    repeat: -1,
    ease: "none",
  });
  const geometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
  const material = new THREE.MeshBasicMaterial({
    // color: 0x00ff00,
    map: airLineTexture,
    side: THREE.DoubleSide,
  });
  const airLine = new THREE.Mesh(geometry, material);
  airLine.userData = item;
  airLine.name = "airLine";
  return airLine;
}

function getProjectColor(type) {
  if (type == 1) {
    return "success";
  } else if (type == 2) {
    return "warning";
  } else {
    return "exception";
  }
}

/**
 * 创建半径颜色的圆形
 * @param {number} radius
 * @param {string} color
 */
function putCircleAara(x, y, radius, color) {
  const worldX = mapInfo.cadToWeb3dX(x);
  const worldY = mapInfo.cadToWeb3dY(y);

  const worldRadius = mapInfo.mapScale * radius;
  const geometry = new THREE.CircleGeometry(worldRadius, 32);

  // const count = geometry.attributes.position.count;
  // geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

  // const colorT1 = new THREE.Color(color1);
  // const colorT2 = new THREE.Color(color2);
  // const colors = geometry.attributes.color;
  // for (let i = 0; i < count; i++) {
  //     if (i == 0) {
  //         colors.setXYZ(i, colorT1.r, colorT1.g, colorT1.b);
  //     } else {
  //         colors.setXYZ(i, colorT2.r, colorT2.g, colorT2.b);
  //     }
  // }
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    depthTest: false,
    // vertexColors: true,
    transparent: true,
    opacity: 0.5,
  });
  const circle = new THREE.Mesh(geometry, material);
  circle.rotateX(-Math.PI / 2);
  circle.position.set(worldX, 0, worldY);
  scene.add(circle);
}

function createFlash(position) {
  if (Math.random() > 0.5) return;

  const texture = textureLoader.load(LineLight);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, opacity: 1 });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(10, 10);
  gsap.to(material, {
    opacity: 0,
    duration: 2,
    repeat: 0,
    ease: "none",
  });
  sprite.position.set(position.x, 2, position.z);
  scene.add(sprite);
  setTimeout(() => {
    scene.remove(sprite);
    material.dispose();
    texture.dispose();
  }, 2000);
}

const debouncedClose = _.debounce(hiddenOutDetail, 800);
function translateStatus(val) {
  if (val === 1) {
    return "开启";
  } else {
    return "关闭";
  }
}



// 建立时钟对象
const clock = new THREE.Clock(); //计时器
const FPS = 60; // 指的是 60帧每秒的情况
const singleFrameTime = 1 / FPS;
let timeStamp = 0;
// 动画函数
function animate() {
  animationId = requestAnimationFrame(animate);

  const delta = clock.getDelta(); //获取距离上次请求渲染的时间

  timeStamp += delta;

  if (timeStamp > singleFrameTime) {
    render(); //渲染
    // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
    timeStamp = timeStamp % singleFrameTime;
  }
  // composer.render();
}

function render() {
  // if (mixer) {
  //     mixer.update(time)
  // }
  moveOnCurve();

  renderer.render(scene, camera);

  labelRenderer.render(scene, camera);
}

// 改变屏幕尺寸调整3D比例
async function resizeView() {
  if (!container.value) return;
  // 更新摄像头
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  // 更新投影几的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器尺寸
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  // 设置当前设备的像素比,pc和移动端区别
  renderer.setPixelRatio(window.devicePixelRatio);

  labelRenderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  );
  // composer.setSize( container.value.clientWidth, container.value.clientHeight );
}

// 挂载生命周期
onMounted(() => {
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  labelRenderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  );
  // composer.setSize( container.value.clientWidth, container.value.clientHeight );

  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  container.value.appendChild(renderer.domElement);
  container.value.appendChild(labelRenderer.domElement);

  // 垂直旋转的角度的上限
  controls.maxPolarAngle = Math.PI / 3;
  // 水平旋转的角度的上限
  controls.minAzimuthAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;
  // 垂直旋转的角度的上限
  controls.maxDistance = props.maxDistance;
  controls.minDistance = props.minDistance;

  // 控制器改变事件
  controls.addEventListener("change", function (event) {
    if (!props.editMode) {
      if (
        controls.target.x < -600 ||
        controls.target.x > 600 ||
        controls.target.z < -200 ||
        controls.target.z > 400
      ) {
        controls.reset();
      } else {
        controls.saveState();
      }
      nearValue = controls.getDistance();
      mergePointData(pointList);
    }
  });

  // gui移入当前vue
  if (gui) {
    container.value.appendChild(gui.domElement);
  }

  window.addEventListener("resize", resizeView);
  setTimeout(() => {
    offsetTop = container.value.getBoundingClientRect().top;
    offsetLeft = container.value.getBoundingClientRect().left;
    resizeView();
  }, 0);

  const openCard = document.getElementById("open-card");

  openCard.addEventListener("mouseenter", debouncedClose.cancel);
  openCard.addEventListener("mouseleave", debouncedClose);
  animate();
  // 鼠标双击事件
  container.value.addEventListener("dblclick", handllerdblclickScene);
  // 鼠标单击事件
  container.value.addEventListener("click", handleClickScene);

  container.value.addEventListener("mousemove", handleMousemoveScene);
});
onBeforeUnmount(() => {
  clearScene();

  // gui.destroy()
});



const isTube = ref(false);
const selectedTubes = ref([]);
let currentTube
function selectTube(intersect) {
  if (intersect.object.name === "hangtube") {
    currentTube = intersect.object;
    currentTube.currentHex = currentObj.material.color.getHex();
    currentTube.material.color.setHex(0x00ff00);
    selectedTubes.value.push(currentTube.userData);
  }
  // hiddenAllDetail()
}

function putTubeName(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    data.forEach((item) => {
      const label = createTubeNameLable(item)
      scene.add(label)
    });
  } catch { }
}

function createTubeNameLable(item) {
  const centerX = (item.startX + item.endX) / 2;
  const centerY = (item.startY + item.endY) / 2;
  const pointPics = TubeName;
  let laberDiv = document.createElement("div"); //创建div容器
  laberDiv.className = "tube-name";
  const html = `<div style="background: url(${pointPics}) no-repeat; background-size: 100% 100%; width: 80px; height: 60px; padding-top: 4px;box-sizing: border-box;overflow: hidden;white-space: nowrap;text-overflow:ellipsis; text-align: center;font-size: 10px; color: #fff;">
        ${item.name}
    </div>`;
  laberDiv.innerHTML = html;
  let pointLabel = new CSS2DObject(laberDiv);
  pointLabel.position.set(mapInfo.cadToWeb3dX(centerX), 0, mapInfo.cadToWeb3dY(centerY)); // 在父元素的相对位置
  pointLabel.center.set(0.5, 1); // DOM元素中心点位置（1，1）=（100%，100%）
  return pointLabel;
}

function handleChangIsTube(value) {
  if (!isTube.value) {
    resetTube()
  }
}

function resetTube() {
  const tubeGroup = scene.children.find(item => item.name === '巷道')
  tubeGroup.children.forEach(item => {
    if (item.currentHex) {
      item.material.color.setHex(item.currentHex);
    }
  })
  selectedTubes.value = []
  currentTube = null
}

/**
 * 创建显示文字平面
 */
function createTextPlane(text, position, angle = 0, scale = 1) {
  const geometry = new THREE.PlaneGeometry(text.length * 12 * scale, 14 * scale);
  const textBase64 = textToImg(text)
  const texture = textureLoader.load(textBase64);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(position.x, position.y, position.z)
  plane.rotateX(Math.PI)
  plane.rotateZ(angle)
  return plane
}

function textToImg(text, color = "#FFFFFF") {
  const fsize = 120;
  const fontWeight = "bolder";
  const canvas = document.createElement('canvas');
  canvas.width = text.length * 12 * 10;
  canvas.height = 14 * 10;
  const context = canvas.getContext("2d");
  // 设置文字阴影的颜色为黑色，透明度为20%
  context.shadowColor = 'rgba(0, 0, 0, 0.6)';
  // 将阴影向右移动15px，向上移动10px
  context.shadowOffsetX = 6;
  context.shadowOffsetY = 6;
  // 轻微模糊阴影
  context.shadowBlur = 2;
  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = fontWeight + " " + fsize + "px sans-serif";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(text, 0, 0);
  return canvas.toDataURL("image/png")
}


defineExpose({
  clearScene, //
  playWorkerPathOnAllPoints, // 回放
  drawCheckLineSimple, // 
  createPeopleSimple, // 人员显示
  drawCompleteLine, // 画完成路线
  drawEscapeLine, // 建立逃生路线
  changePlayVelcoity, // 改变播放速度
  setCurrentTask, // 传递当前任务
  putCheckPoints, //瓦斯回放显示巡检点
  putCircleAara, // 画圆圈
  initSafePoints, // 显示应急点
  putSimpleSafePoint, // 建立单个避难点
  putTubeName, // 巷道名称
  changePeoples, // 动态改变巡检员
  changePointStatusForWs, // 动态改变点位置

  backHangModel, // 返回巷道数据
  backAreaData, // 返回区域
  backCheckPoints, // 点数据
  backNodePoints,
  backSafePoints,
  backVideoPoints,
  backDelPoint,
  backCreateUpdatePoint,
  backPopupChart,
  backCheckLines,
  backCreateCheckLine,
  backDelCheckLine,
  backUpdateCheckLine,
  backCreateArea,
  backDelArea
});

function init() {
  // initGui()
  // 巷道模型
  getHangModel();
  // 辅助点击平面
  initClickPlane();
  // 区域图
  getAreaData();

  // 光照
  initLight();

  if (props.showPoints) {
    initCheckPoints();
  }
  if (props.showSafePoints) {
    initSafePoints();
  }
}

init();
// watchEffect(() => {
//   console.log('巷道', props.LineModel);

// })
</script>

<style lang="scss" scoped>
#scene-page {
  position: relative;
  height: 100%;

  .map-main-view {
    height: 100%;
  }

  .fixed-left {
    position: absolute;
    top: 0px;
    left: 0px;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  .fixed-right {
    position: absolute;
    top: 150px;
    right: 0px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    z-index: 99999;
  }

  .fixd-center {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
  }
}

ul,
li {
  list-style: none;
  padding: 0px;
  margin: 0px;
}

#open-card {
  width: 384px;
  height: 197px;
  color: #fff;
  position: absolute;
  z-index: 100;
  background: url("data:image/png;base64,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") no-repeat;
  background-size: 100% 100%;
  padding: 12px 23px;

  .card-title {
    font-size: 18px;
    margin-bottom: 15px;
    width: 78px;
    white-space: nowrap;
    text-shadow: 0 0 10px #ffffff60, 0 0 10px #ffffff60, 0 0 20px #ffffff60,
      0 0 20px #ffffff60;
  }

  .open-item-1 {
    font-size: 14px;
    margin-bottom: 15px;
  }

  .open-item-2 {
    font-size: 12px;
    margin-bottom: 15px;
  }

  .open-item-3 {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .open-item-4 {
    position: absolute;
    right: 20px;
    top: 10px;
  }

  .open-item-5 {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 5px;
  }

  .open-item-6 {
    height: 115px;
  }

  .open-item-7 {
    height: 78px;
    width: 78px;
  }

  .open-item-8 {
    flex: 1;
  }

  .open-item-9 {
    display: flex;
    height: 100%;
  }
}


.jc-style-1 {
  font-size: 12px;
  text-align: center;
  width: 150px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAUCAYAAABvecQxAAAAAXNSR0IArs4c6QAAAl5JREFUaEPtmqFvFEEUh3/vze7MUYMiBBBgLqtoeorwF0AQKBSykuAQKLg7HAJHUgEah0EQgsIRDNcWdTlBEFzSgKmBm9mbeeT2WsgdbUK2bS60b5LNqvc28+WXnd2Zj7Lw8C0mgygiIQHVNZ5clCQSEMBUUpISQiVSCgwEihzAMVAkbwSBhDyNU6BEPk/JU4nAYRwMyDd+kjfjWJKwVM/SsTACySQzPpXbURYbMaOGsLEli5McVgxZIXKRxMHACrEDJI/EFiw5iByATAArkFyYcoAMWEx1R2IkMAhMpuy8a26O7i1spvrgY0dgsGyfkBm33zc3/N1jNzud0MIIDJbdU+LYWV/ajs/Pfyk/8HQp1KEEahFIDB5ezK/8OE2rlJUPrgrxHSQ51/wU7tfqqEVKAMDgsn0MxpBE1miXCMV2v1j3t5WQEqhLoL/iXojpFtW/4O9gpfbnoudv1W2qdUqgv2Jfinl0aT5YX4uev6l4lEBdAv2WeyXcvTAXrM5W0RvdqNtU65RAv+VeC3fPzr+xvhc9f03xKIG6BPot90a4e2Y2WNL5VnwcXa/bVOuUwN7BSu2toud1KdR81Caw31KoH++1kWrhhMA+H++63aDxOBiBvbcbdIP0YFS1GjMbpHqko4k4LALTIx0eksQ14tjeWNpOz/QQ+rDwntw+fw6hzapqMyc3B0c280qbUdHvyPie2MaV6DerJqcE8L+pyYIAyI6anAKJUTX5P4jSRE0uc+N8Q9xUTYYt88wKJyfGWCHZUZPZCmGqJhvKkSa6Mtu/1eRdLRlZpSaDaKIm/wJMRzySSajJowAAAABJRU5ErkJggg==") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.jc-style-2 {
  font-size: 12px;
  text-align: center;
  width: 150px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAUCAYAAABvecQxAAAAAXNSR0IArs4c6QAAAlhJREFUaEPtmr9LHEEUx79vdm8XBIuF4CFXGBDNnxDyFySccIVEkGBhYRRCuhT5GyzSJYLmCgtJlyZFIFbpQrqkzIkEi0POBK4Q5G53Z16YXU9vZYt0A8M7OOZH853vew92mPchbrePUf40mA2MMdA6B3MOYzSMSaF1BuasGPM8BXN6vZ8CGBd7dtQ6BdEYQVDO47hcR9EYMzMZiPhaSwYXEWAmXF01kKYxmCPkeQwgAmDXt/MwLPeCIIJS0dTYAFEDQdAo9pUKQBQiCEIQUbEG7B/Enc5XXF6+cuFTND2NwOzsG+LV1W8YDl96alFsuYhAkrwlXl//gdGoi+HwO5QyLs4hmp5EwBiFJHmIOH5OvLb2CGH4AszzGAxee2JRbLiIwNzcLpQ6B7BHE33e2PiFfv+Zi/OIpicRaLU+0NHRg+LyflNYm5u/cXb21BOLYsNFBBYWPtLh4f1qYW1t9XF62nFxHtH0JAKLi5+o221VC2t7e4CTk7YnFsWGiwgsLX2mg4NmtbB2dv6i13vs4jyi6UkElpe/0P7+vbuF9Qe93hNPLIoNFxGoLSz5FLpIhV+atZ9Cubz7lWQXbmov7/Lc4CIVfmnWPjfIA6lfSXbhZvqB9KalY8w8Li6kpeMiIb5oNpu7IDpHnu/ZJvRPjEbvpQntS3Yd+qg0oQWbcZgJT6WT5J2Afp7m1qmtAvRbWTkGF8SwxZBNgSf/D5pscWQiiyjXo8lAijAUNNlphu+IT6PJWVaiyFrfoskWRbZIchVNtjhyuWeR5AmaXM4tkjxBkxWUUhM0+R9J/BcRoNG8xwAAAABJRU5ErkJggg==") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// gui 样式
:deep(#gui) {
  position: absolute;
  top: 0;
  right: 0;
  mix-blend-mode: difference;
}
</style>
