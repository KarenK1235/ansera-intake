import "./globals.css";

export const metadata = {
  title: "Ansera™ Intake Form",
  description: "Otto Growth Lab intake form"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
