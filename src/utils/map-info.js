const mapCenter = [500, 500]
const mapScale = 1

/**
 * 在web3D坐标转换成CAD坐标
 * @param {number} x
 * @return {number}
 */
function web3dToCadX(x) {
    return (x / mapScale + mapCenter[0]).toFixed(2) - 0
}
/**
 * 在web3D坐标转换成CAD坐标 y轴转换到web3D的z轴
 * @param {number} y
 * @return {number}
 */
function web3dToCadY(y) {
    return ((-y / mapScale) + mapCenter[1]).toFixed(2) - 0
}


/**
 * CAD坐标转换到web3D坐标
 * @param {number} x
 * @return {number}
 */
function cadToWeb3dX(x) {
    return ((x - mapCenter[0]) * mapScale).toFixed(2) - 0
}


/**
 * CAD坐标转换到web3D坐标
 * @param {number} y
 * @return {number}
 */
function cadToWeb3dY(y) {
    return (-(y - mapCenter[1]) * mapScale).toFixed(2) - 0
}

const mapInfo = {
    mapCenter,
    mapScale,
    web3dToCadX,
    web3dToCadY,
    cadToWeb3dX,
    cadToWeb3dY
}


export default mapInfo