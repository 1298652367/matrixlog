import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './views/Layout'
import Home from './views/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={
              
                <Layout />
              
            }>
              {/* 二级路由默认页面 */}
              <Route index element={<Home />} />
              {/* <Route path="" element={</>} />
              <Route path="" element={< />} /> */}
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
