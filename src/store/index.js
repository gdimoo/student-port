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
    data:"http://128.199.237.106:5000/",
    cert:"http://128.199.237.106:4000/",
    school:"http://128.199.237.106:3000/",
    main:"http://localhost:8080/"
  },
  report:{
    docID: "",
      recordDate:"",
      semester:"",
      year:"",
      studyReports:"",
    owner:"",
    studentProfile:""
  },
  studentProfile:{
    docID: "",
    owner:"",
    title:"",
    name:"",
    admissionDate:"",
    birthDate:"",
  },
  showDetail:{
    farm: false,
      mill: false,
      report: false,
  },
  cert:{
    docID:"",
    owner: "",
    certDate: "",
    course: "",
    trainer: "",
  },
  location:{
    farmLocation:"",
    farmdocID:"",
    millLocation:"",
    milldocID:"",
    reportLocation:"",
    reportdocID:"",
  }
}

const mutations ={
  
  setUser: (state, user) => {
    state.user = user
  },  
  setFarm: (state, farm) => {
    state.farm = farm
  },  
  setReport: (state, report) => {
    state.report = report
  },  
  setCert: (state, cert) => {
    state.cert = cert
  },    
  setStudentProfile: (state, studentProfile) => {
    state.studentProfile = studentProfile
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
  report: state => state.report,
  url: state => state.url,
  type: state => state.type,
  studentProfile: state => state.studentProfile,
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