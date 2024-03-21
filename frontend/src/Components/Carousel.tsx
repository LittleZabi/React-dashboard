import { Carousel } from 'flowbite-react';

export default () => {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel>
        <img src="/media/images/image (1).jpg" alt="..." />
        <img src="/media/images/image (2).jpg" alt="..." />
        <img src="/media/images/image (3).jpg" alt="..." />
        <img src="/media/images/image (4).jpg" alt="..." />
        <img src="/media/images/image (5).jpg" alt="..." />
      </Carousel>
    </div>
  );
}
