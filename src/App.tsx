import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routes } from './components/route/routes';
import PublicRoute from './components/route/public-route';
import ProtectedRoute from './components/route/protected-route';
import SignIn from './components/page/signin/signin';
import Dashboard from './components/page/dashboard/dashboard';


const App = () => {
  const Component = (route: any) => {
    return route.layout ?
      <route.layout>
        <route.component></route.component>
      </route.layout>
      :
      <route.component></route.component>;
  }

  // const RouteElement = (route: any) => {
  //   return route.public ?
  //     <PublicRoute>
  //       <Component route={route}></Component>
  //     </PublicRoute>
  //     :
  //     <ProtectedRoute>
  //       <Component route={route}></Component>
  //     </ProtectedRoute>
  // }

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            const Component = route.component;
            if (route.public) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <PublicRoute>
                      {
                        route.layout ? <route.layout><Component /></route.layout> : <Component />
                      }
                    </PublicRoute>
                  }
                />
              );
            } else {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      {
                        route.layout ? <route.layout><Component /></route.layout> : <Component />
                      }
                    </ProtectedRoute>
                  }
                />
              );
            }
          })}
        </Routes>
      </BrowserRouter>
    </ChakraProvider >
  )
}

export default App
