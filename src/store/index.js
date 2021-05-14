import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.prototype.moment = moment
Vue.use(Vuex)

const state = {
  user: localStorage.getItem('LoggedUser') || '',
  role: localStorage.getItem('role') || '',
  docID: '',
  token: localStorage.getItem('token') || '',
  url:{
    data:"https://request.student-portfolio.ml/",
    cert:"https://cert.student-portfolio.ml/",
    school:"https://learn.student-portfolio.ml/",
    main:"https://student-portfolio.ml"
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
  publicReport:{
    owner:"",
    transcript:false,
    certificate:false,
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
  request:{
    docID:"",
    owner: "",
    recordDate: "",
    transcript: "",
    certificate: "",
  },

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
  setPublicReport: (state, publicReport) => {
    state.publicReport = publicReport
  },  
  setType: (state, type) => {
    state.type = type
  },  
  setDocID: (state, docID) => {
    state.docID = docID
  },
  setRequest: (state, request) => {
    state.request = request
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
  request: state => state.request,
  showDetail: state => state.showDetail,
  publicReport: state => state.publicReport
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