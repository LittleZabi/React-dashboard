import { createContext, useState } from 'react';
import { getCookies } from '../utilities/globals';

const StoreContext = createContext<any>(undefined)

export const StoreProvider = ({ children }: any) => {
    const [modal, setModal] = useState({ enabled: false })
    const [alert, setAlert] = useState<{ message: boolean, variant: 'success' | 'info' | 'danger' }>({ message: false, variant: 'success' })
    let cookies = getCookies('user')
    const [User, setUser] = useState(cookies ? JSON.parse(cookies) : null)
    const store = {
        modal, setModal,
        alert, setAlert,
        User, setUser
    }
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContext;


