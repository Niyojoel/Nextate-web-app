import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import {Layout, RequireAuth, Home, List, SingleDetails, Login, Signup, Profile, Update, Addpost, Editpost, ChangePassword, Agents } from './pages';
import { agentsPageLoader, listsPageLoader, profilePageLoader, singlePostLoader } from './lib/loaders';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout/>,
      children: 
      [
        {
          path: '/',
          element: <Home/>
        },
        {
          path: '/list',
          element: <List/>,
          loader: listsPageLoader,

        },
        {
          path: '/:id',
          element: <SingleDetails/>,
          loader: singlePostLoader,
        },
        {
          path: '/signin',
          element: <Login/>
        },
        {
          path: '/signup',
          element: <Signup/>
        },
        {
          path: '/agents',
          element: <Agents/>,
          loader: agentsPageLoader,
        }
      ]
    },
    {
      path: '/',
      element: <RequireAuth/>,
      children: [
        {
          path: '/profile',
          element: <Profile/>,
          loader: profilePageLoader,
        },
        {
          path: '/profile/update',
          element: <Update/>
        },
        {
          path:"/profile/update/change-password",
          element: <ChangePassword/>
        },
        {
          path: '/profile/addpost',
          element: <Addpost/>
        },
        {
          path: '/profile/editpost/:id',
          element: <Editpost/>,
          loader: singlePostLoader,
        },
      ]
    }
  ])

  return (
    <RouterProvider router = {router}/>
  )
}

export default App
