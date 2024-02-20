function animateAsync(element, keyframes, options) {
    return new Promise(res => {
      element.animate(keyframes, options);
      return setTimeout(res, options.duration || 0);
    })
  }

function createCarousel(
    images, {
        currentSlideIndex = 0,
        duration = 700,
        easing = 'cubic-bezier(.62,.28,.23,.99)'
    } = {}
) {
    const carousel = document.getElementsByClassName('home-carousel')[0];
    const [carouselContainer, carouselButtonLeft, carouselButtonRight] = carousel.children;
    const carouselSlides = carouselContainer.children;
    const fill = 'forwards';
    let animating = false;

    images.forEach((image, index) => {
        const activeClass = index === currentSlideIndex ? 'active' : '';
        carouselSlides[index].className = `carousel-item ${activeClass}`;
        carouselSlides[index].style.backgroundImage = `url(${image})`;
    });

    function slideTo(index) {
        if (animating) {
          return;
        }
        
        animating = true;
       
        const currentSlide = carouselContainer.children[currentSlideIndex];
        const nextSlide = carouselContainer.children[index];
        

        let pos = index > currentSlideIndex ? '-100%' : '100%';
        pos = index === 2 && currentSlideIndex === 0 ? '100%' : index === 0 && currentSlideIndex === 2 ? '-100%' : pos;


        Promise.all([
          animateAsync(nextSlide, [
            {transform: `translate(${parseInt(pos, 10) * -1}%, 0)`},
            {transform: 'translate(0, 0)'}
          ], {duration, fill, easing}),
          animateAsync(currentSlide, [
            {transform: 'translate(0, 0)'},
            {transform: `translate(${pos}, 0)`}
          ], {duration, fill, easing})
        ]).then(() => {
          currentSlideIndex = index;
          currentSlide.classList.remove('active');
          nextSlide.classList.add('active');
          animating = false;
        });
      };
        
    carouselButtonRight.addEventListener('click', () => 
      slideTo(currentSlideIndex !== images.length - 1 ? currentSlideIndex + 1 : 0));
    carouselButtonLeft.addEventListener('click', () => 
      slideTo(currentSlideIndex !== 0 ? currentSlideIndex - 1 : images.length - 1));
}

function createCategories(categoryData) {
  const categories = document.getElementsByClassName('main-categories')[0].children;

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    category.style.backgroundImage = `url(${categoryData[i].url})`;
    console.log(category.children[0].children[0].children[0].children)
    let [categoryTitle, categoryCaption] = category.children[0].children[0].children[0].children;
    console.log(categoryTitle, categoryCaption)
    categoryTitle.innerHTML = categoryData[i].title;
    categoryCaption.innerHTML = categoryData[i].caption;
  }
}

function redirectTo(path) {
  window.location.href = path;
}

window.addEventListener('load', () => {
    window.location.href.split("#")

    createCarousel([
        "assets/img/slide-1.png",
        "assets/img/slide-2.png",
        "assets/img/slide-3.png",
    ])
    createCategories([
      {
        url: "assets/img/consoles.png",
        title: "Console Exclusive",
        caption: "All the latest consoles, games, reviews and guides"
      },
      {
        url: "assets/img/pcgaming.png",
        title: "PC <br/> Exlcusive",
        caption: "All computer related games and guides."
      },      
      {
        url: "assets/img/mobilegaming.jpg",
        title: "Mobile Exlcusive",
        caption: "All mobile related games and guides."
      }
    ])
})