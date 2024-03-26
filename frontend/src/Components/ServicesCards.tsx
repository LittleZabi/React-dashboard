import { Card } from "flowbite-react"
import { useTranslation } from "react-i18next"

export default ({ languageClass }: any) => {
    const { t } = useTranslation()
    const citems = new Array(4).fill(0)
    return (
        <section id="cards" className={`bg-white dark:bg-gray-900 ${languageClass === 'arabic' ? 'arabic_dir' : 'english_dir'}`}>
            <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-12">
                <div className="m-auto place-self-center flex items-stretch flex-wrap justify-center w-full">
                    {citems.map((_: any, i: number) => (
                        <Card key={++i} className="max-w-sm m-1 bg-blue-100">
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {t(`servicesCards.t${++i}`)}
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {t(`servicesCards.d${i}`)}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}