import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.prototype.moment = moment
Vue.use(Vuex)

const state = {
  user: '',
  lotID: '',
  token: localStorage.getItem('token') || '',
  url:{
    farmer:"https://farmer.coffee-trace.cf/",
    milling:"https://milling.coffee-trace.cf/",
    stow:"https://stow.coffee-trace.cf/",
    main:"https://coffee-trace.cf"
  },
  farm:{
    species: "",
      harvestDate: "",
      fertilizer: "",
      method: "",
        lotID: "",
        value: 0,
        farmer:""
  },
  showDetail:{
    farm: false,
      mill: false,
      stow: false,
  },
  milling:{
    receiveLotID:"",
    species:"",
    lotID: "",
    millingDate: "",
    Prepare: "",
    value: 0,
    millingUser:"",
    milling_grade_Date:"",
    grade:{
      gradeLotID:"",
      millingExp:"",
      value:"",
      Detail:"",
      grade:""

    }
  },
  stow:{
    receiveLotID:"",
    species:"",
    lotID: "",
    grade:"",
    value: 0,
    roast_Date:"",
    roastExp:"",
    roast_lv:"",
    stowUser:"",

    info:{
      name:"",
      packDate:"",
      expDate:"",
      Detail:"",
      guide:"",
      packValue:""

    }
  },
  location:{
    farmLocation:"",
    farmLotID:"",
    millLocation:"",
    millLotID:"",
    stowLocation:"",
    stowLotID:"",
  }
}

const mutations ={
  
  setUser: (state, user) => {
    state.user = user
  },  
  setFarm: (state, farm) => {
    state.farm = farm
  },  
  setStow: (state, stow) => {
    state.stow = stow
  },  
  setMilling: (state, milling) => {
    state.milling = milling
  },  
  setLotID: (state, lotID) => {
    state.lotID = lotID
  },
  setLocation: (state, location) => {
    state.location = location
  },
  
  setShowDetail: (state, showDetail) => {
    state.showDetail = showDetail
  },
  
  setFarmerList: (state, farmerList) => {
    state.farmerList = farmerList
  },
  
  setAuthorizationToken: (state, token) => {
    state.token = token
  }
}

const getters = {
  user: state => state.user,
  lotID: state => state.lotID,
  milling: state => state.milling,
  farm: state => state.milling,
  stow: state => state.milling,
  url: state => state.url,
  farmerList: state => state.farmerList,
  token: state => state.token,
  location: state => state.location,
  showDetail: state => state.showDetail,
  number: state => state.number
}

const actions = {
  addTodo: (state, name) => {
    store.commit('addText', name)
  },
  addNumber: (state, num) => {
    store.commit('addNum', num)
  },
  logout() {
    store.reset()
  }
}

let store = new Vuex.Store({
  state: state,
  mutations: mutations,
  getters: getters,
  actions: actions
})

global.store = store
export default store

const initialStateCopy = JSON.parse(JSON.stringify(store.state))

export function resetState () {
  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)))
}