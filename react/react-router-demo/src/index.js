import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link, Outlet  } from 'react-router-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

function Aaa() {
  return <div>
    <p>aaa</p>
    <Link to={'/bbb/111'}>to bbb</Link>
    <br/>
    <Link to={'/ccc'}>to ccc</Link>
    <br/>
    <Link to={'/ccc/ddd/1'}>to ddd/1</Link>
    <br/>
    <Link to={'/ccc/fff/2'}>to fff/2</Link>
    <br/>
    <Outlet/>
  </div>;
}

function Bbb() {
  return 'bbb';
}

function Ddd() {
  return 'ddd1';
}

function Fff() {
  return 'fff2';
}

function Ccc() {
  return (
    <div>
      <div>ccc</div>
      <Outlet/>
    </div>
  )
}

function ErrorPage() {
  return 'error';
}

const routes = [
  {
    path: "/",
    element: <Aaa/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "bbb/:id",
        element: <Bbb />,
      },
      {
        path: "ccc",
        element: <Ccc />,
        children: [
          {
            path: "ddd/1",
            element: <Ddd />
          },
          {
            path: "fff/2",
            element: <Fff />
          },
        ]
      }    
    ],
  }
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
