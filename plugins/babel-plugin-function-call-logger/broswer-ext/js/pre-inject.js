(() => {
  const CLOBAL_CONFIG_CACHE = ''
  setInterval(() => {
    try {
      const MARK = "__call__trace__";
      const GLOBAL_CONFIG_MARK = MARK + "config__";
      const newConfig = localStorage.getItem(GLOBAL_CONFIG_MARK);
      if (newConfig !== CLOBAL_CONFIG_CACHE) {
        window[GLOBAL_CONFIG_MARK].enabledList = JSON.parse(newConfig).enabledList;
      }
    } catch (error) {}
  }, 200);
})();

