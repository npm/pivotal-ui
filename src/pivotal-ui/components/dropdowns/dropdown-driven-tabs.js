// automatically attach a click listener to any dropdown-driven tab anchors on the page
$(function () {
  $('.dropdown-driven-tabs a').on('click', function (e) {
    e.preventDefault()
    var $a = $(this)
    var $activeLi = $a.closest('.dropdown-driven-tabs').find('.active')

    // short-circuit if clicked is already active
    if ($activeLi.find('a').is($a)) return

    $activeLi.removeClass('active')
    $a.tab('show')
  })
})
