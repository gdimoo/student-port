import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.prototype.moment = moment
Vue.use(Vuex)

const state = {
  user: localStorage.getItem('LoggedUser') || '',
  docID: '',
  type: localStorage.getItem('type') || '',
  token: localStorage.getItem('token') || '',
  url:{
    farmer:"http://localhost:5000/",
    cert:"http://localhost:4000/",
    school:"http://localhost:3000/",
    main:"http://localhost:8080/"
  },
  farm:{
    species: "",
      study_reportDate: "",
      fertilizer: "",
      method: "",
        docID: "",
        value: 0,
        farmer:""
  },
  showDetail:{
    farm: false,
      mill: false,
      school: false,
  },
  cert:{
    receivedocID:"",
    species:"",
    docID: "",
    certDate: "",
    Prepare: "",
    value: 0,
    certUser:"",
    cert_grade_Date:"",
    grade:{
      gradedocID:"",
      certExp:"",
      value:"",
      Detail:"",
      grade:""

    }
  },
  school:{
    receivedocID:"",
    species:"",
    docID: "",
    grade:"",
    value: 0,
    roast_Date:"",
    roastExp:"",
    roast_lv:"",
    schoolUser:"",

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
    farmdocID:"",
    millLocation:"",
    milldocID:"",
    schoolLocation:"",
    schooldocID:"",
  }
}

const mutations ={
  
  setUser: (state, user) => {
    state.user = user
  },  
  setFarm: (state, farm) => {
    state.farm = farm
  },  
  setSchool: (state, school) => {
    state.school = school
  },  
  setCert: (state, cert) => {
    state.cert = cert
  },    
  setType: (state, type) => {
    state.type = type
  },  
  setDocID: (state, docID) => {
    state.docID = docID
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
  docID: state => state.docID,
  cert: state => state.cert,
  farm: state => state.cert,
  school: state => state.cert,
  url: state => state.url,
  type: state => state.type,
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