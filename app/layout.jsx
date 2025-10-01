import "./globals.css";

export const metadata = {
  title: "StyleHub - Fashion Store",
  description: "Your premier destination for stylish clothing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
