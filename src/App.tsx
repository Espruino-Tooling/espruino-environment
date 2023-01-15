
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "./components/AppShell"
import { routes } from "./routes"
import './styles/app.scss'

export const App = () => {
  return (
    <AppShell>
    <BrowserRouter>
      <Routes>
        {routes.map((page) => <Route path={page.route} element={page.element}/>)}
      </Routes>
    </BrowserRouter>
    </AppShell>
  )
}
