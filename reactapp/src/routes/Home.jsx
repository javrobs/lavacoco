import React, {useContext} from "react"
import {userContext} from "../components/App.jsx"
import AdminUser from "./admin/Home.jsx"
import NotLoggedUser from "./guest/Home.jsx"
import LoggedUser from "./user/Home.jsx"


export default function Home(){
    const user = useContext(userContext);   
    
    return user.logged_in?(user.superuser?<AdminUser/>:<LoggedUser user={user}/>):<NotLoggedUser/>
}



