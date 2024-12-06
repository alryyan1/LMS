import axios from "axios";
import { host, schema } from "./src/pages/constants";
import { toast } from "react-toastify";

const axiosClient =  axios.create({
    // baseURL : `https://intaj-starstechnology.com/jawda1/laravel-react-app/public/api`
    baseURL : `${schema}://${host}/laravel-react-app/public/api`
    //  baseURL : `http://192.168.1.5/laravel-react-app/public/api`
    // baseURL : `https://om-pharmacy.com/laravel-react-app/public/api`
})

axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('ACCESS_TOKEN')
 config.headers.Authorization = `Bearer ${token}`
 return config
})

axiosClient.interceptors.response.use((res)=>{
    if (res.data.show) {
        toast.success("Success");
      }
    return res
},(err)=>{
    console.log(err,'error from client axios')
    const {response} = err
    console.log(response.data)
    console.log(response.status)
    if (response.status == 411) {
      toast.error(response?.data?.message ?? "هنالك خطا", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
        console.log('removing access token')
        localStorage.removeItem('ACCESS_TOKEN')
        
        // alert('Access token removed successfully')
        
    }
    if (response.status == 404) {
        toast.error(response?.data?.message ?? "هنالك خطا", {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        //  localStorage.removeItem('ACCESS_TOKEN')
      }
    
    throw err
})

export default axiosClient