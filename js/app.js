/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
 */

document.addEventListener('DOMContentLoaded', function() {

    /**
     * Define Global Variables
     * 
     */
    const sections = document.querySelectorAll('.section_para');

    /**
     * End Global Variables
     * Start Helper Functions
     * 
     */
    //create a document fragment to be appended one time to the unordered list.
    function createFragmemt() {
        const dFragment = document.createDocumentFragment();
        for (let section of sections) {
            const navBar_li = document.createElement('li');
            const navBar_a = document.createElement('a');

            navBar_a.textContent = section.getAttribute('data-nav');
            navBar_a.classList = 'navbar_item';
            navBar_a.setAttribute('id', `a_${section.getAttribute('id')}`);
            // navBar_a.setAttribute('href', `#${section.getAttribute('id')}`);

            navBar_li.appendChild(navBar_a);
            dFragment.appendChild(navBar_li);
        }

        dFragment.appendChild(createBurgerIcon());
        return dFragment;
    }

    //create the burger icon which will be used in small screen sizes,
    //to be appended to the document fragement created above
    function createBurgerIcon() {
        const navIcon_li = document.createElement('li');
        navIcon_li.className = 'icon';

        const navIcon_a = document.createElement('a');
        navIcon_a.setAttribute('id', 'burgerIcon');
        navIcon_a.setAttribute('class', 'navbar_item');

        const navIcon_i = document.createElement('i');
        navIcon_i.className = 'fa fa-bars';

        navIcon_a.appendChild(navIcon_i);
        navIcon_li.appendChild(navIcon_a);
        return navIcon_li;
    }

    //This function called/run when the burger icon clicked
    function openVerticalNavbar() {
        const ul = document.getElementById("navParent");
        ul.classList.toggle('responsive');
    }

    // Set sections as active
    function activate(section) {
        //update Section
        section.classList.add('active-section');
        //update Anchor
        document.querySelector(`#a_${section.getAttribute('id')}`)
            .classList.add('active_nav');
        //update li for responsiveness
        document.querySelector(`#a_${section.getAttribute('id')}`).closest('li')
            .classList.add('active_nav');

    }

    // Set sections as deactive
    function deactivate(section) {
        //update Section
        section.classList.remove('active-section');
        //update Anchor
        document.querySelector(`#a_${section.getAttribute('id')}`)
            .classList.remove('active_nav');
        //update li for responsiveness
        document.querySelector(`#a_${section.getAttribute('id')}`).closest('li')
            .classList.remove('active_nav');

    }


    /**
     * End Helper Functions
     * Begin Main Functions
     * 
     */

    // build the nav
    populateNavBar();

    //Load nav menu items from the html sections
    function populateNavBar() {
        const dFragment = createFragmemt();

        const navBar_ul = document.querySelector('#navbar__list');
        navBar_ul.appendChild(dFragment);

        navBar_ul.addEventListener('click', navItemClick);
    }

    // Add class 'active' to section when near top of viewport
    //create observer to observe for any instersection of any view section with the view port
    let observer = null;

    function createObserver() {
        if (observer != null) { return; }
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: [0.3, 0.7]
        };

        observer = new IntersectionObserver(activateSection, options);
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    //Apply activate or deactivate to the section when scroll to it.
    //It is the call back function of the observer created above.
    function activateSection(ob_sections) {
        ob_sections.forEach(ob_section => {
            if (ob_section.intersectionRatio > 0.7) {
                activate(ob_section.target);
            } else {
                deactivate(ob_section.target);
            }
        });
    }

    // Scroll to anchor ID using scrollTO event.
    // Scroll to section when selected from the nav menu.
    function navItemClick(event) {
        if (event.target.tagName != 'A') { return; }
        let nav_item_id = event.target.getAttribute('id');
        if (nav_item_id[0] != 'a') return;
        let targetSection = document.querySelector(`#${nav_item_id.split('_')[1]}`);
        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        ////Another harder way but not efficient as above one:
        // let secBoundries = targetSection.getBoundingClientRect();
        // let docBoundry = document.body.getBoundingClientRect();
        // window.scrollTo({
        //     top: secBoundries.top - docBoundry.top,
        //     left: secBoundries.left - docBoundry.left,
        //     behavior: 'smooth'
        // });
    }

    //Toggle scrollTop button on scroll
    function toggleScrollTopButton() {
        const scrollTopBtn = document.querySelector('.scrollTop');
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    }

    /**
     * End Main Functions
     * Begin Events
     * 
     */

    //Scroll event to listen for user scroll therefore intiate the observer
    document.addEventListener("scroll", () => {
        createObserver();
        toggleScrollTopButton();
        document.querySelector('.page__header').classList.remove('hidden__nav');
    });

    autoLoopToToggleNavmenu();

    function autoLoopToToggleNavmenu() {
        setTimeout(() => {
            document.querySelectorAll('.active_nav').length > 0 ?
                document.querySelector('.page__header').classList.add('hidden__nav') :
                document.querySelector('.page__header').classList.remove('hidden__nav');
            autoLoopToToggleNavmenu();
        }, 5000);
    }

    //Click event set to burger icon to show the nav menu on small screen sizes
    document.querySelector('#burgerIcon').addEventListener('click', openVerticalNavbar);

});