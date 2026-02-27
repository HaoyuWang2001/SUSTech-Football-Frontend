/**
 * 统一API请求工具
 * 封装wx.request，提供错误处理、参数编码和统一配置
 */

const app = getApp();

/**
 * 发起API请求
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求URL（相对路径）
 * @param {string} options.method - HTTP方法，默认GET
 * @param {Object} options.data - 请求数据
 * @param {Object} options.header - 请求头
 * @param {function} options.success - 成功回调
 * @param {function} options.fail - 失败回调
 * @param {function} options.complete - 完成回调
 * @param {boolean} options.encodeParams - 是否编码参数，默认true
 * @returns {void}
 */
export function request(options) {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    success,
    fail,
    complete,
    encodeParams = true
  } = options;

  const baseURL = app.globalData.URL;
  const fullUrl = baseURL + url;

  // 如果需要编码参数，处理GET请求的URL参数
  let requestUrl = fullUrl;
  if (encodeParams && method.toUpperCase() === 'GET' && Object.keys(data).length > 0) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      params.append(key, value);
    }
    requestUrl = `${fullUrl}?${params.toString()}`;
  }

  const requestConfig = {
    url: requestUrl,
    method: method.toUpperCase(),
    header: {
      'content-type': 'application/json',
      ...header
    },
    success(res) {
      if (res.statusCode === 200) {
        success && success(res.data);
      } else {
        const error = {
          statusCode: res.statusCode,
          data: res.data,
          errMsg: `请求失败，状态码：${res.statusCode}`
        };
        fail && fail(error);
        // 统一错误提示
        wx.showToast({
          title: `请求失败: ${res.statusCode}`,
          icon: 'none',
          duration: 2000
        });
      }
    },
    fail(err) {
      console.error('API请求失败:', err);
      fail && fail(err);
      wx.showToast({
        title: '网络请求失败，请检查网络连接',
        icon: 'none',
        duration: 2000
      });
    },
    complete(res) {
      complete && complete(res);
    }
  };

  // 对于非GET请求，将data放在request data中
  if (method.toUpperCase() !== 'GET') {
    requestConfig.data = data;
  }

  wx.request(requestConfig);
}

/**
 * 获取收藏列表
 * @param {string} userId - 用户ID
 * @param {string} type - 类型：'match', 'user', 'team', 'event'
 * @param {function} success - 成功回调，接收处理后的数据
 * @param {function} fail - 失败回调
 */
export function fetchFavoriteList(userId, type, success, fail) {
  request({
    url: '/getFavorite',
    method: 'POST',
    data: {
      userId,
      type
    },
    success(res) {
      success && success(res);
    },
    fail
  });
}

/**
 * 封装需要userId的请求，如果userId未获取则加入队列
 * @param {function} task - 接收userId的函数
 */
export function requestWithUserId(task) {
  app.addToRequestQueue(task);
}

/**
 * 安全的URL参数编码
 * @param {string} param - 参数值
 * @returns {string} 编码后的参数
 */
export function encodeParam(param) {
  return encodeURIComponent(param);
}

export default {
  request,
  fetchFavoriteList,
  requestWithUserId,
  encodeParam
};