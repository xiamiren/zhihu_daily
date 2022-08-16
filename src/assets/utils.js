// 检测是否为纯粹的对象
export const isPlainObject = function isPlainObject(obj) {
  let proto, Ctor;
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]")
    return false;
  proto = Object.getPrototypeOf(obj);
  if (!proto) return true;
  Ctor = proto.hasOwnProperty("constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor === Object;
};

// 处理最大宽度
export const handleMaxWidth = function() {
  let HTML = document.documentElement,
    app = document.querySelector("#app"),
    size = parseFloat(HTML.style.fontSize);
  if (size > 75) {
    //如果页面的字体大于75则设置HTML的字体为75,app的最大宽度设置为750px
    HTML.style.fontSize = "75px";
    app.style.width = "750px";
    return;
  }
  // 如果页面的字体小于75则设置宽度为100%
  app.style.width = "100%";
  app.style.minHeight = HTML.clientHeight + "px";
};

// 日期格式化
export const formatTime = function(time, template) {
  if (typeof time !== "string") {
    time = new Date().toLocaleString("zh-CN", { hour12: false });
  }
  if (typeof template !== "string") {
    template = "{0}年{1}月{2}日 {3}:{4}:{5}";
  }
  // 解析出年月日等信息
  let arr = [];
  if (/^\d{8}$/.test(time)) {
    let [_, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time);
    arr.push($1, $2, $3);
  } else {
    arr = time.match(/\d+/g);
  }
  // 把获取的数据替换成模板
  return template.replace(/\{(\d+)\}/g, (_, $1) => {
    let time = arr[$1] || "00";
    if (time.length < 2) time = "0" + time;
    return time;
  });
};
