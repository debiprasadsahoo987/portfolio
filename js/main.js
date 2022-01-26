// navigation menu

(() => {
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const navMenu = document.querySelector(".nav-menu");
    const closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNav);
    closeNavBtn.addEventListener("click", hideNav);

    function showNav() {
        navMenu.classList.add("open");
        bodyScrollingToggle();
    }

    function hideNav() {
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();
    }

    function fadeOutEffect() {
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(() => {
            document.querySelector(".fade-out-effect").classList.remove("active");
        }, 300);
    }
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("link-item")) {
            console.log(event);
            if (event.target.hash !== "") {
                event.preventDefault();
                const hash = event.target.hash;
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");
                // activate new section
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");
                // deactivate existing active navigation
                navMenu
                    .querySelector(".active")
                    .classList.add("outer-shadow", "hover-in-shadow");
                navMenu
                    .querySelector(".active")
                    .classList.remove("active", "inner-shadow");
                if (navMenu.classList.contains("open")) {
                    // activate new navigation menu
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");
                    // hide navigation
                    hideNav();
                } else {
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) => {
                        if (hash === item.hash) {
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("outer-shadow", "hover-in-shadow");
                        }
                    });
                    fadeOutEffect();
                }
                // add hash to url
                window.location.hash = hash;
            }
        }
    });
})();

function bodyScrollingToggle() {
    document.body.classList.toggle("stop-scrolling");
}

// About Section tabs

(() => {
    const aboutSection = document.querySelector(".about-section");
    const tabsContainer = document.querySelector(".about-tabs");
    tabsContainer.addEventListener("click", (event) => {
        if (
            event.target.classList.contains("tab-item") &&
            !event.target.classList.contains("active")
        ) {
            const target = event.target.getAttribute("data-target");
            tabsContainer
                .querySelector(".active")
                .classList.remove("outer-shadow", "active");
            event.target.classList.add("active", "outer-shadow");
            aboutSection
                .querySelector(".tab-content.active")
                .classList.remove("active");
            aboutSection.querySelector(target).classList.add("active");
        }
    });
})();

// Portfolio filter and popups

(() => {
    const filterContainer = document.querySelector(".portfolio-filter");
    const portfolioItemsContainer = document.querySelector(".portfolio-items");
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    const popup = document.querySelector(".portfolio-popup");
    const prevBtn = popup.querySelector(".pp-prev");
    const nextBtn = popup.querySelector(".pp-next");
    const closeBtn = popup.querySelector(".pp-close");
    const projectDetailsContainer = popup.querySelector(".pp-details");
    const projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;
    // filter portfolio items
    filterContainer.addEventListener("click", (event) => {
        if (
            event.target.classList.contains("filter-item") &&
            !event.target.classList.contains("active")
        ) {
            filterContainer
                .querySelector(".active")
                .classList.remove("outer-shadow", "active");
            event.target.classList.add("active", "outer-shadow");
            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) => {
                if (target === item.getAttribute("data-category") || target === "all") {
                    item.classList.remove("hide");
                    item.classList.add("show");
                } else {
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            });
        }
    });
    portfolioItemsContainer.addEventListener("click", (event) => {
        if (event.target.closest(".portfolio-item-inner")) {
            const portfolioItem = event.target.closest(
                ".portfolio-item-inner"
            ).parentElement;
            // get the portfolioitem index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(
                portfolioItem
            );
            screenshots = portfolioItems[itemIndex]
                .querySelector(".portfolio-item-img img")
                .getAttribute("data-screenshot");
            // convert screenshots into array
            screenshots = screenshots.split(",");
            if (screenshots.length === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    });

    closeBtn.addEventListener("click", () => {
        popupToggle();
        if (projectDetailsContainer.classList.contains("active")) {
            popupDetailsToggle();
        }
    });

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        // activate loaded till the image loads
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () => {
            // deactivate loader
            popup.querySelector(".pp-loader").classList.remove("active");
        };
        popup.querySelector(".pp-counter").innerHTML =
            slideIndex + 1 + " of " + screenshots.length;
    }

    // next slide
    nextBtn.addEventListener("click", () => {
        if (slideIndex === screenshots.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        popupSlideshow();
    });

    // prev slide
    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1;
        } else {
            slideIndex--;
        }
        popupSlideshow();
    });
    // popup details

    function popupDetails() {
        if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
            projectDetailsBtn.style.display = "none";
            return;
        }
        projectDetailsBtn.style.display = "block";
        // get the project details
        const details = portfolioItems[itemIndex].querySelector(
            ".portfolio-item-details"
        ).innerHTML;
        popup.querySelector(".pp-project-details").innerHTML = details;
        const title = portfolioItems[itemIndex].querySelector(
            ".portfolio-item-title"
        ).innerHTML;
        popup.querySelector(".pp-title h2").innerHTML = title;
        const category = portfolioItems[itemIndex].getAttribute("data-category");
        popup.querySelector(".pp-project-category").innerHTML = category
            .split("-")
            .join(" ");
    }
    projectDetailsBtn.addEventListener("click", () => {
        popupDetailsToggle();
    });

    function popupDetailsToggle() {
        if (projectDetailsContainer.classList.contains("active")) {
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0;
        } else {
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight =
                projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    }
})();

// Hide sections except the active one

(() => {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        if (!section.classList.contains("active")) {
            section.classList.add("hide");
        }
    });
})();

window.addEventListener("load", () => {
    // preloader
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() => {
        document.querySelector(".preloader").style.display = "none";
    }, 1000);
});