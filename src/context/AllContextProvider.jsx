import React from 'react'
import { ThemeProvider } from './ThemeContext'
import { UserContextProvider } from './UserContext'

function AllContextProvider({children}) {
  return (
    <ThemeProvider>
        <UserContextProvider>
            {children}
        </UserContextProvider>
    </ThemeProvider>
  )
}

export default AllContextProvider;
