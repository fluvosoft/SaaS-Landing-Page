
const navBarLinks = [
  { name: "হোম", url: "/bn" },
  { name: "পণ্য", url: "/bn/products" },
  { name: "সেবা", url: "/bn/services" },
  { name: "যোগাযোগ", url: "/bn/contact" },
];

const footerLinks = [
  {
    section: "ইকোসিস্টেম",
    links: [
      { name: "ডকুমেন্টেশন", url: "/bn/welcome-to-docs/" },
      { name: "টেমপ্লেট", url: "/bn/products" },
      { name: "সেবা", url: "/bn/services" },
    ],
  },
  {
    section: "কোম্পানি",
    links: [
      { name: "আমাদের সম্পর্কে", url: "#" },
      { name: "ক্যারিয়ার", url: "#" },
      { name: "ক্লায়েন্ট", url: "#" },
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