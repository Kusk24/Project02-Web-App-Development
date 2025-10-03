import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StyleHub - Fashion Store",
  description: "Your premier destination for stylish clothing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  ); 
}
