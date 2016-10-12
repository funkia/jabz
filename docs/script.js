window.addEventListener('load', function(event) {
  var sidebar = document.getElementById('sidebar');
  var header = document.getElementsByTagName('header')[0];
  var headerHeight = header.scrollHeight;
  var fixed = undefined;
  console.log(header.scrollHeight, header.offsetHeight);
  window.addEventListener('scroll', function(e) {
    var top  = window.pageYOffset || document.documentElement.scrollTop;
    if (top >= headerHeight && fixed !== true) {
      sidebar.classList.add('fixed');
      fixed = true;
    } else if (top < headerHeight && fixed !== false) {
      sidebar.classList.remove('fixed');
      fixed = false;
    }
  });
});
