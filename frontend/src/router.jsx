import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import About from './pages/About';
import ArticleDetail from './pages/ArticleDetail';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'articles',
        element: <Articles />,
      },
      {
        path: 'articles/:id',
        element: <ArticleDetail />,
      },
      {
        path: 'articles/create',
        element: <CreateArticle />,
      },
      {
        path: 'articles/:id/edit',
        element: <EditArticle />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);

export default router;
