import axios from "axios";

const axiosClient =  axios.create({
    baseURL : `https://intaj-starstechnology.com/shipping/public/api`
})

axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('ACCESS_TOKEN')
 config.headers.Authorization = `Bearer ${token}`
 return config
})

axiosClient.interceptors.response.use((res)=>{
    return res
},(err)=>{
    console.log(err,'error from client axios')
    const {response} = err
    console.log(response.data)
    console.log(response.status)
    if (response.status == 401) {
        console.log('removing access token')
        localStorage.removeItem('ACCESS_TOKEN')
        
    }
    if (response.status == 404) {
        console.log('removing access token')
      //  localStorage.removeItem('ACCESS_TOKEN')
    }
    
    throw err
})

export default axiosClient