// components/notification-block.js
Component({

  options: {
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的属性列表
   */
  properties: {

    title: String,

    visible: {
      type: Boolean,
      value: true
    },

    open: {
      type: Boolean,
      value: false
    },

    showRedDot: {
      type: Boolean,
      value: false
    },

    list: {
      type: Array,
      value: []
    },

    hint: String,

    emptyText: String,

    height: {
      type: String,
      value: '200px'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    toggle() {
      this.triggerEvent('toggle')
    },

    itemClick(e) {

      const item = e.currentTarget.dataset.item

      this.triggerEvent('itemclick', {
        item: item
      })

    }

  }
})