export const metadata = {
  title: 'Ad Generator',
  description: 'Generate ad campaigns from product photos and prompts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
