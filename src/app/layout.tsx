import './globals.css'
import { Inter } from 'next/font/google'
// import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Manas Shukla - Portfolio',
  description: 'Portfolio of Manas Shukla, a web developer specializing in modern web technologies.',
}

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Header /> */}
        {children}
      </body>
    </html>
  )
}