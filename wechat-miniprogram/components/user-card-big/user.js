// components/user-card-big/user.js
Component({
  properties: {
    name: String,
    img: String,
    isPlayer: Boolean,
    isReferee: Boolean,
    isCoach: Boolean,
    has_number: Boolean,
    userId: String,
    idLabel: {
      type: String,
      value: 'ID：'
    },
    has_button: {
      type: Boolean,
      value: false 
    },
    number: Number, 
  },

  data: {

  },

  methods: {

  }
})