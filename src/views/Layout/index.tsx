import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Link, Outlet } from 'react-router-dom'
import { Content } from 'antd/es/layout/layout'

const { Header, Sider, Footer } = Layout

const GeekLayout = () => {
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className='title'>动态可配置日志分析系统</div>
        <div className="user-info">
          <span className="user-name">user.name</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={250} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to="/">播放中心</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/Aemonplayer">
              Aemonplayer
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/MidWare">
              中间件
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Content>
            
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>©2023 王晓明</Footer>
        </Layout>

      </Layout>
    </Layout>
  )
}

export default GeekLayout