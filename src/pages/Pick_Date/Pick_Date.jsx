import Content_Pick_Date from "../../components/Content_Pick_Date/Content_Pick_Date"
import NavbarHead from "../../components/Navbar/Navbar"

function Pick_Date() {
  

    return (
      <>
        <NavbarHead/>
        <h1 style={{textAlign:"center"}}>Pick Your shift</h1>
        <div style={{display:"flex", justifyContent:"center",marginTop:"25px"}}>
            
            <Content_Pick_Date/>
        </div>
      </>
    )
  }
  
  export default Pick_Date