import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// layouts
import Header from "./components/Header";
import Footer from "./components/Footer";
import MenuButton from "./components/MenuButton";
import AdminLayout from "./admin/layout/AdminLayout";

// route guard
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";

// ================= USER PAGES =================
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import BookTable from "./pages/BookTable";
import Register from "./pages/Register";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AdminLogin from "./pages/AdminLogin";

// user featured news
import FeaturedNews from "./components/FeaturedNews";
import FeaturedNewsDetail from "./pages/FeaturedNewsDetail";

// ================= ADMIN PAGES =================
import Dashboard from "./admin/pages/Dashboard";
import TableReservations from "./admin/pages/TableReservations";
import Products from "./admin/pages/Products";
import ProductForm from "./admin/pages/ProductForm";
import Orders from "./admin/pages/Orders";
import Inventory from "./admin/pages/Inventory";
import Discounts from "./admin/pages/Discounts";
import Topping from "./admin/pages/Topping";
import AdminFeaturedNews from "./admin/pages/FeaturedNews"; 
import Users from "./admin/pages/Users";
import Account from "./pages/Account";
import MyTableReservations from "./pages/MyTableReservations";
// ================= USER LAYOUT =================
const UserLayout = () => (
  <>
    <Header />
    <main className="font-sans text-gray-800 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thuc-don" element={<Menu />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/danh-muc/:slug" element={<CategoryPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* USER FEATURED NEWS */}
        <Route path="/tin-tuc" element={<FeaturedNews />} />
        <Route path="/tin-tuc/:slug" element={<FeaturedNewsDetail />} />
        <Route element={<PrivateRoute />}>
        <Route path="/gio-hang" element={<Cart />} />
        <Route path="/dat-ban" element={<BookTable />} />
        <Route path="/don-hang-cua-toi" element={<MyOrders />} />
        <Route path="/tai-khoan" element={<Account />} />
        <Route path="/my-table-reservations" element={<MyTableReservations />} />
</Route>

      </Routes>
    </main>
    <Footer />
    <MenuButton />
  </>
);

// ================= APP =================
export default function App() {
  return (
    <Router>
      <Routes>
        {/* USER */}
        <Route path="/*" element={<UserLayout />} />

        {/* ADMIN */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="toppings" element={<Topping />} />
            <Route path="orders" element={<Orders />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="users" element={<Users />} />

            {/* ADMIN FEATURED NEWS */}
            <Route path="featured-news" element={<AdminFeaturedNews />} />

            <Route path="reservations" element={<TableReservations />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
