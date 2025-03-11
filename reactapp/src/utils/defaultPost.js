import cookieCutter from "./cookieCutter";

const defaultPost = async (url,body) => {
    const response = await fetch(url,{
        method:"POST",
        headers:{"X-CSRFToken":cookieCutter("csrftoken")},
        body:JSON.stringify(body)});
    const data = await response.json()
    return data;
}
export default defaultPost;