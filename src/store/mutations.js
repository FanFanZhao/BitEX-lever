let mutations = {
    setAccountNum(state){
        let accountNum  = window.localStorage.getItem('accountNum')
        this.state.accountNum = accountNum
    },
    setDatas(state,datas){
        this.state.datas = datas;
    }
}
export default mutations