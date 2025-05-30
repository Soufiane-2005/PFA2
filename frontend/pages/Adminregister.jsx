import {Link } from "react-router-dom"


import { AuthContext } from "../context/AuthContext"
import { Sidebar } from "../components/Sidebar"
import '../src/styleCss/adminpage.css'
import {Adminbutton} from '../components/Adminbutton'


export function Adminregister(){
    


    return (
        <>
        <div className="adminPage">        
                <Sidebar/>
                <Adminbutton/>
        </div>

       
        </>
    )
}