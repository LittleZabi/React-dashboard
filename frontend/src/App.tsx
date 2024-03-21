import Footer from './Components/Footer'
import Header from './Components/Header'
import Carousel from './Components/Carousel'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import ServicesCards from './Components/ServicesCards'
import Contact from './Components/Contact'

function App() {
  const { t, i18n } = useTranslation()

  const [languageClass, setLanguageClass] = useState('');
  useEffect(() => {
    const updateClass = () => {
      const newClass = i18n.language === 'ar' ? 'arabic' : 'english';
      setLanguageClass(newClass);
    };
    updateClass();
    return () => updateClass();
  }, [i18n.language]);

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 super-container ${languageClass}`}>
      <header>
        <Header />
      </header>
      <main className='relative'>
        <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
        <div>
          <Carousel />
        </div>
        <section className={`z-3 relative bg-white dark:bg-gray-900 ${languageClass === 'arabic' ? 'arabic_dir' : 'english_dir'}`}>
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7 text-gray-900 dark:text-white ">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                {t('headline')}
              </h1>
              <p className="max-w-2xl text-gray-900 dark:text-white  mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                {t('sub_heading')}
              </p>
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                {t('get_started')}
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </a>
              <a href="#" className="inline-flex items-center text-gray-900 dark:text-white  justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Hello
              </a>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <img src="/media/images/image (2).jpg" alt="mockup" />
            </div>
          </div>
        </section>
        <ServicesCards languageclassName={languageClass} />
        <div>
          <section className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
              <a href="#" className={`${languageClass === 'arabic' ? 'arabic_dir' : 'english_dir'} inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800`}>
                <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">New</span> <span className="text-sm font-medium">{t('section3rd.aText1')}</span>
                <svg className={`w-2.5 h-2.5 ms-2 ${languageClass === 'arabic' ? 'rotate-180' : 'rotate-0'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
              </a>
              <h1 className={`${languageClass === 'arabic' ? 'arabic_dir' : 'english_dir'} mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white`}>{t('section3rd.title')}</h1>
              <p className={`${languageClass === 'arabic' ? 'arabic_dir' : 'english_dir'} mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200`}>{t('section3rd.sub_title')}</p>
            </div>
          </section>
        </div>
        <div>
          <Contact />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default App
