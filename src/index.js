//index.js
import MyMinemap from "@/components/MyMap.vue"; // 引入封装好的组件

export { MyMinemap } //实现按需引入*


const components = [MyMinemap];
const install = function (App, options) {
    components.forEach((component) => {
        App.component(component.name, component);
    });
};
export default { install } // 批量的引入*
