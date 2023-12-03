import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import './index.css';
import Hooks from './pages/Hooks';
import Func from './pages/Hooks/Func';
import HanldeError from './pages/Error';
import reportWebVitals from './reportWebVitals';

function ErrorPage() {
  return (
    <span>404</span>
  )
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Hooks />,
    errorElement: <ErrorPage/>
  },
  {
    children: [
      {
        path: 'handleError',
        element: <HanldeError />
      },
      {
        path: 'hooks/func',
        element: <Func />
      }
    ]
  },
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
