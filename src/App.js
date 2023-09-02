import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { NotFound } from "./404.js";
import Unauthorized from "./Unauthorized.js";
import { About } from "./components/About.js";
import { Home } from "./components/Home.js";
import Register from "./components/Login/Register.jsx";
import ResetPassword from "./components/Login/ResetPassword.jsx";
import Verification from "./components/Login/Verification.jsx";
import ForgetPassword from "./components/Login/forgetpassword.jsx";
import CheckOut from "./components/checkOut/CheckOut.jsx";
import CompareProducts from "./components/compare/CompareProducts.jsx";
import Filter from "./components/filter/Filter.jsx";
import ProductDetail from "./components/product/ProductDetail.jsx";
import Wishlist from "./components/whishlist/Wishlist.jsx";
import FooteradminLayout from "./layouts/admin/footer/FooteradminLayout.jsx";
import MenuLayout from "./layouts/admin/menu/MenuLayout.jsx";
import NavadminLayout from "./layouts/admin/navbar/NavadminLayout.jsx";
import { FooterLayout } from "./layouts/user/FooterLayout.jsx";
import { NavLayout } from "./layouts/user/NavLayout.jsx";
import Category from "./pages/admin/categories/Category.jsx";
import Homeadmin from "./pages/admin/home/Homeadmin.jsx";
import Orders from "./pages/admin/orders/Orders.jsx";
import Payments from "./pages/admin/payments/Payments.jsx";
import Product from "./pages/admin/product/Product.jsx";
import Products from "./pages/admin/products/Products.jsx";
import SettingsPage from "./pages/admin/settings/setting.jsx";
import User from "./pages/admin/user/User.jsx";
import Users from "./pages/admin/users/Users.jsx";
import Login from "./pages/user/Login.jsx";
import "./styles/global.scss";
import ProtectedRoute from "./utils/ProtectedRoute.js";
// import Logs from "./pages/admin/logs/Logs.jsx";
import { PaymentSuccess } from "./components/checkOut/PaymentSuccess.jsx";
import Delivery from "./components/delivery/Delivery.jsx";
import UserDetails from "./components/details/UserDetails.jsx";
import Order from "./components/track/Order.jsx";
import Track from "./components/track/Track.jsx";
import TrackUser from "./components/track/TrackUser.jsx";
import Admin from "./pages/admin/admins/Admin.jsx";
import Refunds from "./pages/admin/refunds/Refunds.jsx";
import Visit from "./pages/admin/visits/Visit.jsx";
import ProtectedRouteDelivery from "./utils/ProtectedRouteDelivery.js";

import Mailing from "./pages/admin/mailing/Mailing.jsx";
import Logs from "./pages/admin/logs/Logs.jsx";

function Layout() {
  return (
    <>
      <NavLayout />

      <FooterLayout />
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <div className="main">
        <NavadminLayout />
        <div className="container">
          <div className="menuContainer">
            <MenuLayout />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
        <FooteradminLayout />
      </div>
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="paymentSuccess" element={<PaymentSuccess />} />
        <Route path="forgotpassword" element={<ForgetPassword />} />
        <Route path="verification" element={<Verification />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route path="/order" element={<Order />} />
        <Route path="/details" element={<UserDetails />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="/productdetails/:id" element={<ProductDetail />} />
        <Route path="/compare" element={<CompareProducts />} />
        <Route path="/Product/:category" element={<Filter />} />
        <Route path="/Product/:category/:subcategory?" element={<Filter />} />
        <Route
          path="/Product/:category/:subcategory/:subsubcategory?"
          element={<Filter />}
        />
        <Route path="/track" element={<Track />} />
        <Route path="/trackorder/:id" element={<TrackUser />} />
        <Route path="join" element={<Register />} />
        <Route
          path="/delivery"
          element={<ProtectedRouteDelivery component={Delivery} />}
        />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute component={AdminLayout} />}>
        <Route index element={<Homeadmin />} />
        <Route path="products" element={<Products />} />
        <Route path="admins" element={<Admin />} />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<Payments />} />
        <Route path="logs" element={<Logs />} />
        <Route path="visits" element={<Visit />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="categories" element={<Category />} />
        <Route path="users" element={<Users />} />
        <Route path="mailing" element={<Mailing />} />
        <Route path="users/:id" element={<User />} />
        <Route path="products/:id" element={<Product />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
