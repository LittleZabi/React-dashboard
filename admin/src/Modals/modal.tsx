
import { Modal } from 'flowbite-react';
import { useContext, useState } from 'react';
import StoreContext from '../context/store';

export default ({ children, title }: any) => {
    const { setModal } = useContext(StoreContext)
    const [fadeOut, setFadeOut] = useState(false)
    const closeModal = () => {
        setFadeOut(true)
        setTimeout(() => {
            setModal({ enabled: false })
        }, 400);
    }
    return (
        <>
            <Modal show={true} onClose={closeModal} className={`${fadeOut ? 'fade-out' : 'fade-in'}`}>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </>
    );
}
