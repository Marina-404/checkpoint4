import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import LandingPage from './pages/LandingPage.tsx';
import ListsPage from './pages/ListsPage.tsx';
import TasksPage from './pages/TasksPage.tsx';


const router = createBrowserRouter([
  {
    element: <App />, 
    children: [
      { path: "/", element: <LandingPage /> },
      {
        path: "/lists", 
        element: <ListsPage />, 
      },
      {
        path: "/lists/:id", 
        element: <TasksPage />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <RouterProvider router={router} />
  </StrictMode>,
)
