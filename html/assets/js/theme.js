$("document").ready(function () {
  $("#doctorSlideshow").owlCarousel({
    nav: true,
    dots: false,
    navText: [
      "<span class='mai-arrow-back'></span>",
      "<span class='mai-arrow-forward'></span>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
  $("#clientSlideshow").owlCarousel({
    nav: true,
    dots: false,
    navText: [
      "<span class='mai-arrow-back'></span>",
      "<span class='mai-arrow-forward'></span>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      1200: {
        // Ajuste para resoluciones mayores donde se mostrarán 5 ítems
        items: 5,
      },
    },
  });
});

$("document").ready(function () {
  $("a[data-role='smoothscroll']").click(function (e) {
    e.preventDefault();

    var position = $($(this).attr("href")).offset().top - nav_height;

    $("body, html").animate(
      {
        scrollTop: position,
      },
      1000
    );
    return false;
  });
});

$("document").ready(function () {
  // Back to top
  var backTop = $(".back-to-top");

  $(window).scroll(function () {
    if ($(document).scrollTop() > 400) {
      backTop.css("visibility", "visible");
    } else if ($(document).scrollTop() < 400) {
      backTop.css("visibility", "hidden");
    }
  });

  backTop.click(function () {
    $("html").animate(
      {
        scrollTop: 0,
      },
      1000
    );
    return false;
  });
});

$("document").ready(function () {
  // Tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Popovers
  $('[data-toggle="popover"]').popover();

  // Page scroll animate
  new WOW().init();
});

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("load", function () {
    // Ocultar el spinner después de que todos los recursos se han cargado
    document.getElementById("loading").style.display = "none";
    // Mostrar el contenido de la página
    document.getElementById("content").style.display = "block";
  });
});
