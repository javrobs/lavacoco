
export default function cookieCutter(cookieName){
    const cookies = document.cookie.split(";");
    const findCookie = cookies.find(each=>each.includes(cookieName));
    return findCookie?decodeURIComponent(findCookie.split("=")[1]):"";
}