// An array of links for navigation bar
const navBarLinks = [
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
  { name: "Services", url: "/services" },
  { name: "Contact", url: "/contact" },
];
// An array of links for footer
const footerLinks = [
  {
    section: "Resources",
    links: [
      { name: "Documentation", url: "/welcome-to-docs/" },
      { name: "Templates", url: "/products" },
      { name: "Services", url: "/services" },
    ],
  },
  {
    section: "Company",
    links: [
      { name: "About us", url: "/" },
      { name: "Contact", url: "/contact" },
      { name: "Get Started", url: "/contact" },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  facebook: "https://www.facebook.com/profile.php?id=61586723829777",
  linkedin: "https://www.linkedin.com/company/fluvo-soft/",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};