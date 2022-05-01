/*
 * @Author: Joey
 * @Date: 2022-04-24 21:25:35
 * @LastEditors: Joey
 * @LastEditTime: 2022-04-24 21:28:14
 * @FilePath: \my-electron-app\utils.js
 */
function downFile(jsonObj) {
    var elementA = document.createElement('a');

    elementA.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(jsonObj));
    elementA.setAttribute('download', +new Date() + ".tpl");
    elementA.style.display = 'none';
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
}
