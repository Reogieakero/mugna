// app/signup/layout.tsx

// This is a Server Component, and it can safely export metadata
export const metadata = {
  title: 'Mugna - Create Account',
}

// This layout component simply renders its children (page.tsx)
export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}