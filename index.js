function smoothScroll(id) {
  if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    // for some reason the built in smooth scrolling doesn't work in firefox for me
    // manually animate a smooth scroll
    EPPZScrollTo.scrollVerticalToElementById("overworld", 20);
  } else {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }
}

window.onload = function () {
  smoothScroll("overworld");
};
