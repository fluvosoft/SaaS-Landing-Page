
const navBarLinks = [
  { name: "হোম", url: "/bn" },
  { name: "পণ্য", url: "/bn/products" },
  { name: "সেবা", url: "/bn/services" },
  { name: "যোগাযোগ", url: "/bn/contact" },
];

const footerLinks = [
  {
    section: "রিসোর্স",
    links: [
      { name: "ডকুমেন্টেশন", url: "/bn/welcome-to-docs/" },
      { name: "টেমপ্লেট", url: "/bn/products" },
      { name: "সেবা", url: "/bn/services" },
    ],
  },
  {
    section: "কোম্পানি",
    links: [
      { name: "আমাদের সম্পর্কে", url: "/bn" },
      { name: "যোগাযোগ", url: "/bn/contact" },
      { name: "শুরু করুন", url: "/bn/contact" },
    ],
  },
];

const socialLinks = {
  facebook: "#",
  x: "#",
  github: "https://github.com/",
  google: "#",
  slack: "#",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};