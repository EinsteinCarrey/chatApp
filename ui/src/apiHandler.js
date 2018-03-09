import axios from 'axios';

/* base url of the api */
const baseUrl = 'http://localhost:4000';

/* Authorization headers */
const config = () => {
    return {
        headers: {'x-access-token': localStorage.getItem('token')}
    }
};

/* Query the api */
const runRequest = (method, endpoint, data) => {

    /* Concatenate endpoint to the baseUrl */
    endpoint ? endpoint = baseUrl + endpoint :
        endpoint = baseUrl;

    switch (method){
        case 'post':
            return axios.post(endpoint, data, config());
        case 'put':
            return axios.put(endpoint, data, config());
        case 'delete':
            return axios.delete(endpoint, config());

        /* Treat all requests as GET requests if method is not specified */
        default:
            return axios.get(endpoint, config());
    }
};

/* Query the api and handle the output */
const fetchFromApi = (method, endpoint="", data=null) => {
    return new Promise((resolve,reject)=>{

        runRequest(method, endpoint, data).then((response) => {

            /*  resolve if response is 'OK' or 'Created', otherwise reject */
            (response.status !== 200 && response.status !== 201) ? reject(response.statusText):
                resolve(response.data);

        }).catch(error => {
            // if(!endpoint.includes('login')) {
            //     reAuthenticateIfStatusCodeIs401(error);
            // }
            //

            /* Return relevant error message if Network Error occurred */
            (String(error).includes('Network Error')) ?
                reject("Could not connect to server. Please check your network connection"):

                /* If error contains a custom error message, display the error message,
                 otherwise display the default error */
                (error.response && error.response.data.errMsg) ? reject(error.response.data.errMsg): reject(error);

        });
    });
};

export default fetchFromApi;

