import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import Pick_Date from './pages/Pick_Date/Pick_Date';
import Login from './pages/Login/Login';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';



function App() {



  const router = createBrowserRouter([
    {
      path:"/",
      element: <Home />,
    },
    {
      path:"/pick_date",
      element:<Pick_Date/>
    },
    {
      path:"/login",
      element:<Login/>
    }

  ]);

  return (
   
        <RouterProvider router={router} />
   
  );
}

export default App;