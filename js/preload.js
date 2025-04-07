// preload.js
(() => {
    const override = (name, value) => {
      Object.defineProperty(window.navigator, name, {
        get: () => value,
        configurable: true
      });
    };
  
    // 1. Webdriver 감지 우회
    override('webdriver', false);
  
    // 2. navigator.plugins 설정
    override('plugins', [1, 2, 3, 4]);
  
    // 3. navigator.languages 설정
    override('languages', ['ko-KR', 'en-US']);
  
    // 4. window.chrome 설정
    window.chrome = {
      runtime: {}
    };
  
    // 5. Permissions API 감지 우회
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  
    // 6. WebGL 렌더러 감지 우회
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === 37445) return 'Intel Inc.'; // UNMASKED_VENDOR_WEBGL
      if (parameter === 37446) return 'Intel Iris OpenGL Engine'; // UNMASKED_RENDERER_WEBGL
      return getParameter.call(this, parameter);
    };
  
    // 7. User-Agent 설정
    override('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  })();
  