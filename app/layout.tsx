"use client";
import "@mantine/core/styles.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  MantineProvider,
  Title,
  AppShell,
  Container,
  Text,
} from "@mantine/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
          <AppShell
            padding="md"
            header={{ height: 60 }}
            footer={{ height: 50 }}
          >
            <AppShell.Header className="!bg-gray-200 text-gray-900 flex items-center px-6">
              <Title order={1} size="h1">Pointing Broker</Title>
            </AppShell.Header>

            <AppShell.Main>
              <Container>{children}</Container>
            </AppShell.Main>

            <AppShell.Footer className="!bg-gray-200 text-center text-gray-900 flex items-center justify-center">
              <Text>&copy; 2025 Pointing Broker. All rights reserved.</Text>
            </AppShell.Footer>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
