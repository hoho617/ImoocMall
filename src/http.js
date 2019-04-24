import axios from 'axios'

import { Loading,Message } from 'element-ui'

let loading;

function startLoading(){
	loading = Loading.service({
		title:'拼命加载中...',
		lock:true,
        background:"rgba(0,0,0,.6)"
	});
}

function endLoading(){
	loading.close();
}

axios.interceptors.request.use(config=>{
	startLoading();
	return config;
},error=>{
	return Promise.reject(error)
})

axios.interceptors.response.use(response=>{
	endLoading();
	return response;
},error=>{
	endLoading();
	Message.error(error.response.data);
	return Promise.reject(error)
})

export default axios;