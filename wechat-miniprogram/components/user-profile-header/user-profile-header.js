Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 头像URL
    avatarUrl: {
      type: String,
      value: ''
    },
    // 用户名称
    name: {
      type: String,
      value: ''
    },
    // 用户ID
    userId: {
      type: [String, Number],
      value: ''
    },
    // 横幅图片URL
    bannerImage: {
      type: String,
      value: 'https://www.sustech.edu.cn/uploads/images/2024/04/12141752_38075.jpg'
    },
    // 是否显示ID
    showId: {
      type: Boolean,
      value: true
    },
    // 尺寸变体：'normal', 'large'
    size: {
      type: String,
      value: 'normal'
    },
    // ID标签前缀，如 "用户id："、"教练id："等
    idLabel: {
      type: String,
      value: '用户id：'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 内部计算样式类
    headerClass: '',
    avatarContainerClass: '',
    nameClass: '',
    idClass: ''
  },

  lifetimes: {
    attached() {
      this._updateStyles()
    }
  },

  observers: {
    'size': function(size) {
      this._updateStyles()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _updateStyles() {
      const { size } = this.data
      const headerClass = size === 'large' ? 'header-large' : 'header-normal'
      const avatarContainerClass = size === 'large' ? 'avatar-container-large' : 'avatar-container-normal'
      const nameClass = size === 'large' ? 'name-large' : 'name-normal'
      const idClass = size === 'large' ? 'id-large' : 'id-normal'

      this.setData({
        headerClass,
        avatarContainerClass,
        nameClass,
        idClass
      })
    }
  }
})