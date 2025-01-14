export const metadata = {
  title: "StreetEats",
  description: "Street Food Finder and Locator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
