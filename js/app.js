/**
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JavaScript version: ES2015/ES6
 *
 * JavaScript standard: ESLint (https://eslint.org/)
 *
 * JavaScript documentation comments: JSDoc3 (https://jsdoc.app/)
 */

/*
  The comment below tells ESLint that your environment is a browser.
  This helps to avoid ESLint undefined error messages like:
    "'document' is not defined. (no-undef)"
    and
    "'window' is not defined. (no-undef)"
  when running your code through the ESLint rules tester at https://eslint.org/demo
*/

/* eslint-env browser */

/**
 * Global variables
 */

const navContainer = document.getElementById("nav-container");
const navBar = document.getElementById("nav-ul");
const contentSections = document.querySelectorAll(".content-section");
const darkModeIcon = document.getElementById("dark-mode");
let navBarTimer = null;

/**
 * Helper functions
 */

/**
 * Checks if an element is in the current viewport - note the use of the ES6 arrow function which assign this function as a function expression to a variable - all functions in this JavaScript file are declared/assigned using this ES6 standard
 * @function isInViewport
 * @param {Node} element - Element object
 * @return {Boolean} - Returns true if element is in the viewport
 */
const isInViewport = (element) => {
  const distance = element.getBoundingClientRect();

  // When a section enters bottom third of the viewport it is deemed active
  return (
    distance.top <= (document.documentElement.clientHeight / 3) * 2 &&
    distance.bottom >=
      (window.innerHeight - 56 || document.documentElement.clientHeight - 56) // The "- 56" in this statement excludes the bottom footer (32px) and the bottom content grid gutter (24px) for this calculation
  );

  // Debug/original code that checks if the entire element is in the viewport or not
  /*
	return (
    distance.top >= 0 &&
    distance.left >= 0 &&
    distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    distance.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
  */
};

/**
 * Main functions
 */

/**
 * Builds the navigation bar
 * @function buildNavBar
 * @param {NodeList} sectionList - NodeList object as created by the document.querySelectorAll() method
 */
const buildNavBar = (sectionList) => {
  sectionList.forEach((section) => {
    // For each content section element in your HTML page, perform the following...
    // Create a new navigation item <li> element and style it using a CSS class
    const navItem = document.createElement("li");
    navItem.classList.add("nav-li");

    // Create a new anchor <a> element and append it to the navigation item element
    const navAnchor = document.createElement("a");
    // navAnchor.classList.add('nav-active'); // Debug code
    navAnchor.id = "nav-" + section.id; // Append a 'nav-' string to the start of the section id and then use that as the id for the anchor (to make the anchor id unique throughout the HTML document)
    navAnchor.href = "#" + section.id; // Anchor to the section's id
    navAnchor.textContent = section.getAttribute("data-nav"); // Use the data-nav data attribute on the section to set the anchor's text

    // Append the anchor element to navigation element to add it to the DOM
    navItem.appendChild(navAnchor);

    // And finally, append the navigation item element to navigation bar element to add it to the DOM
    navBar.appendChild(navItem);
  });
};

/**
 * Add an 'active state' (i.e. a highlighting CSS class) to the section title, section image, and related navigation item when the section image in in the current viewport
 * @function setActiveSection
 * @param {NodeList} sectionList - NodeList object as created by the document.querySelectorAll() method
 */
const setActiveSection = (sectionList) => {
  // Add active state to navigation bar items while scrolling
  sectionList.forEach((section) => {
    if (isInViewport(section)) {
      // Add active state CSS classes
      // section.style.backgroundColor = 'red'; // Debug code
      section.querySelector(".card-title").classList.add("card-title-active");
      section.querySelector(".card-image").classList.add("card-image-active");
      document.getElementById("nav-" + section.id).classList.add("nav-active");
    } else {
      // Remove active state CSS classes
      // section.style.backgroundColor = 'blue'; // Debug code
      section
        .querySelector(".card-title")
        .classList.remove("card-title-active");
      section
        .querySelector(".card-image")
        .classList.remove("card-image-active");
      document
        .getElementById("nav-" + section.id)
        .classList.remove("nav-active");
    }
  });

  // Hide the navigation bar when not scrolling
  if (navBarTimer !== null) {
    // console.log('Scrolling'); // Debug code
    clearTimeout(navBarTimer);

    if (navContainer.style.top !== "0px") {
      // Only show navigation bar once while scrolling, not with every scroll trigger
      navContainer.style.top = "0px"; // Show navigation bar
    }
  }

  navBarTimer = setTimeout(() => {
    // console.log('Scrolling Ended'); // Debug code
    navContainer.style.top = -navContainer.clientHeight + "px"; // Hide navigation bar
  }, 1000);
};

/**
 * Scroll to an anchor ID using a 'scroll to' event  - note the use of event delegation for performance reasons (see event.target related code below) - as documented here: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
 * @function scrollToNavItem
 * @param {Event} event - Event object as passed by the element.addEventListener() method
 */
const scrollToNavItem = (event) => {
  event.preventDefault(); // Prevents the default jump to anchor behaviour when clicking on a link

  if (event.target.nodeName.toLowerCase() === "a") {
    // console.log('An anchor was clicked with an id of ' + event.target.id); // Debug code
    if (event.target.id == "home") {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    } else {
      document
        .getElementById(event.target.id.slice(4))
        .scrollIntoView({ behavior: "smooth" }); // Remove the first 4 characters (i.e. 'nav-') from the start of the navigation item's id and then use that to find and scroll to the appropriate section
    }
  }
};

/**
 * Enable or disable dark mode by toggling the light theme CSS stylesheet on or off
 * @function toggleDarkMode
 */
const toggleDarkMode = () => {
  document.styleSheets[2].disabled = !document.styleSheets[2].disabled; // Enable or disable the light theme CSS stylesheet (depending on if it's currently enabled or not)

  // Change the dark/light mode icon accordingly
  document.getElementById("dark-mode-icon").src.includes("dark-mode.svg")
    ? (document.getElementById("dark-mode-icon").src =
        "images/icons/light-mode.svg")
    : (document.getElementById("dark-mode-icon").src =
        "images/icons/dark-mode.svg");

  // Set the html meta theme-color tag to reflect dark/light mode
  document
    .querySelector("meta[name='theme-color']")
    .setAttribute(
      "content",
      getComputedStyle(document.documentElement).getPropertyValue("--primary")
    );
};

/**
 * Events
 */

/*
  Set sections as active by highlighting the section's title and image when the section is scrolled inside the current viewport
  See the following link for an example on how to call an event listener function with an argument using an arrow function (as it is done when calling the setActiveSection() event listener below):
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#event_listener_with_an_arrow_function
*/
document.addEventListener("DOMContentLoaded", () =>
  setActiveSection(contentSections)
);
document.addEventListener("load", () => setActiveSection(contentSections));
document.addEventListener("scroll", () => setActiveSection(contentSections));
window.addEventListener("resize", () => setActiveSection(contentSections));

// Scroll to a section when a navigation item is clicked
navBar.addEventListener("click", scrollToNavItem);

// Ensure the navigation bar stays visible when the mouse is hovering over it
navContainer.addEventListener("mouseover", (event) => {
  // console.log('Mouse over'); // Debug code
  clearTimeout(navBarTimer);
});

// Hide the navigation bar when the mouse leaves it
navContainer.addEventListener("mouseleave", (event) => {
  // console.log('Mouse leave'); // Debug code
  navContainer.style.top = -navContainer.clientHeight + "px"; // Hide navigation bar
});

// Enable or disable dark mode when the dark mode icon is clicked
darkModeIcon.addEventListener("click", toggleDarkMode);

/**
 * Global code
 */

// Build the navigation bar
buildNavBar(contentSections);
