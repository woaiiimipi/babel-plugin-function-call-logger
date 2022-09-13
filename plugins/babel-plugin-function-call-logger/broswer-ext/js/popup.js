const getConfigBtn = document.getElementById("getConfig");
const selectAllBtn = document.getElementById("selectAll");
const clearBtn = document.getElementById("clear");
const formDom = document.getElementById("form");
const responseDataPanel = document.getElementById("responseData");

/** show options */
const lang = "简体中文";
const i18n = {
  简体中文: {
    normal: "函数声明",
    arrow: "箭头函数",
    anonymous: "匿名函数",
    reactComponent: "React 函数组件",
    reactHooks: "React Hooks",
    applySuccess: "应用成功",
  },
  English: {
    normal: "Function Declaration",
    arrow: "Arrow Function",
    anonymous: "Anonymous",
    reactComponent: "React Function Component",
    reactHooks: "React Hooks",
    applySuccess: "Apply Success",
  },
};
const __EnabledTypeList = {
  normal: "normal",
  arrow: "arrow",
  anonymous: "anonymous",
  reactComponent: "reactComponent",
  reactHooks: "reactHooks",
};
let timer
const apply = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action: "setConfig",
        payload: {
          enabledList: (() => {
            return Array.from(formDom.querySelectorAll("input"))
              .map((el) => {
                if (el.checked) {
                  return el.id;
                }
                return null;
              })
              .filter(Boolean);
          })(),
        },
      },
      function (response) {
        document.getElementById("tip").innerText = "应用成功";
        timer = setTimeout(() => {
          clearTimeout(timer)
          document.getElementById("tip").innerText = "";
        }, 2000);
      }
    );
  });
};
const showConfigUI = (enabledList = []) => {
  const map = {
    [__EnabledTypeList.normal]: {},
    [__EnabledTypeList.arrow]: {},
    [__EnabledTypeList.anonymous]: {},
    [__EnabledTypeList.reactComponent]: {},
    [__EnabledTypeList.reactHooks]: {},
  };
  Object.keys(map).forEach((key) => {
    map[key].value = key;
    map[key].checked = enabledList.includes(key);
  });
  const list = [[map.normal, map.arrow], [map.anonymous], [map.reactComponent, map.reactHooks]];

  list.forEach((line) => {
    const lineDiv = document.createElement("div");
    line.forEach((option) => {
      const div = document.createElement("div");
      div.classList.add("form-item");
      const input = document.createElement("input");
      input.onchange = (e) => {
        apply();
      };
      input.type = "checkbox";
      input.checked = option.checked;
      input.id = option.value;

      const label = document.createElement("label");
      label.innerHTML = i18n[lang][option.value];
      label.htmlFor = option.value;
      div.append(input, label);
      lineDiv.append(div);
    });
    formDom.append(lineDiv);
  });
};

selectAllBtn.addEventListener("click", () => {
  Array.from(formDom.querySelectorAll("input")).forEach((el) => {
    el.checked = true;
  });
  apply();
});
clearBtn.addEventListener("click", () => {
  Array.from(formDom.querySelectorAll("input")).forEach((el) => {
    el.checked = false;
  });
  apply();
});

/** When open popup, read page localStorage's config */
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getConfig" }, function (response) {
    showConfigUI((response || {}).enabledList || []);
  });
});
