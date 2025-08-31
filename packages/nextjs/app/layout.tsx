import "~~/styles/globals.css";

export const metadata = {
  title: "Flow - Decentralized AI Agents",
  description: "Your decentralized AI agents powered by Flow. Create, manage, and coordinate with AI assistants for the future of web3.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body>
        {children}
      </body>
    </html>
  );
}
