import { createContext, useState } from 'react';

const StoreContext = createContext<any>(undefined)

export const StoreProvider = ({ children }: any) => {
    const [modal, setModal] = useState({ enabled: false })
    const [alert, setAlert] = useState<{ message: boolean, variant: 'success' | 'info' | 'danger' }>({ message: false, variant: 'success' })
    const store = {
        modal,
        setModal,
        alert, setAlert
    }
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContext;


