import './App.css';
import { UserContext, UserContextProvider } from './UserContext';
import Header from './header';
import Layout from './layout';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import RegisterPage from './pages/RegisterPage';
import Post from './post';
import {Route, Routes} from "react-router-dom";


function App() {
  return (

    <UserContextProvider>
    <Routes>
     <Route path="/" element={<Layout />} >


     <Route index element={<IndexPage /> }/>
           
     <Route path={'/login'} element={
        <LoginPage/>
      } />

      <Route path={'/register'} element={<RegisterPage/>} />
      <Route path={'/create'} element={<CreatePost></CreatePost>}></Route>
      <Route path={'/post/:id'} element={<PostPage></PostPage>}></Route>
      <Route path={'/edit/:id'} element={<EditPost></EditPost>}></Route>
     </Route>

     
</Routes>

    </UserContextProvider>
  
    


         
          
           
    
     
    


      
      
      
   

  
  );
}

export default App;
