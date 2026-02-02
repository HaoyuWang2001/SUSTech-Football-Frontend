/**
 * 封装的模态框方法
 * @param {Object} options - 配置对象
 */
const showModal = function ({
  title = '', 
  content = '', 
  confirmText = '确认',
  confirmColor = '#576B95',
  cancelText = '取消',
  cancelColor = '#000000',
  onConfirm = null,
  onCancel = null,
  onComplete = null,
  editable = false,
  placeholderText = '',
} = {}) {
  wx.showModal({
    title: title,
    content: content,
    confirmText: confirmText,
    confirmColor: confirmColor,
    cancelText: cancelText,
    cancelColor: cancelColor,
    editable: editable,
    placeholderText: placeholderText,
    success(res) {
      if (res.confirm) {
        // 判断 onConfirm 是否为函数，防止未传入时报错
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
      } else if (res.cancel) {
        if (typeof onCancel === 'function') {
          onCancel();
        }
      }
    },
    complete(res) {
      if (res.confirm) {
        if (typeof onComplete === 'function') {
          onComplete(res);
        }
      }
    }
  });
}

module.exports = {
  showModal,
}