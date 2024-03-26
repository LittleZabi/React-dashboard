import { Icon } from '@iconify/react';
import { Badge, DarkThemeToggle, Dropdown, Navbar } from 'flowbite-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t, i18n } = useTranslation()
    const langs: any = {
        en: { nativeName: 'English' },
        ar: { nativeName: 'عربي' }
    }
    const [selectedLang, setSelectedLang] = useState(i18n.language)
    const handleLang = (lang: any) => {
        i18n.changeLanguage(lang)
        setSelectedLang(lang)
    }
    return (
        <Navbar fluid>
            <Navbar.Brand href="https://flowbite-react.com">
                <span className="self-center whitespace-nowrap text-xl font-semibold text-black dark:text-white">
                    {t('logo')}
                </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link className='mt-2' href="/" active>{t('nav_hm')}</Navbar.Link>
                <Navbar.Link className='mt-2' href="#cards">{t('nav_at')}</Navbar.Link>
                <Navbar.Link className='mt-2' href="#contact">{t('nav_ct')}</Navbar.Link>
                <Navbar.Link className='mt-2' href="https://admin.alzainmhc.com">{t('nav_log')}</Navbar.Link>
                <Dropdown label="" inline renderTrigger={() => (
                    <div className='flex mt-3 cursor-pointer text-black dark:text-gray-100'>
                        <span><Icon icon="heroicons:language-solid" className='text-lg' /></span>
                        <Icon icon="majesticons:chevron-down-line" className='text-base' />
                        <Badge color={'gray'} size='xs' className='-mt-4 -ml-5 py-0 px-1'>{selectedLang}</Badge>
                    </div>
                )
                }>
                    {Object.keys(langs).map(lng => (
                        <Dropdown.Item key={lng}>
                            <button className='block' onClick={() => handleLang(lng)} disabled={i18n.resolvedLanguage === lng}>
                                {langs[lng].nativeName}
                            </button>
                        </Dropdown.Item>
                    ))}
                </Dropdown>
                <Navbar.Link>
                    <DarkThemeToggle />
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
