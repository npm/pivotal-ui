// automatically attach a click listener to any dropdown-driven tab anchors on the page
$(function () {
  $('.dropdown-driven-tabs a').on('click', function (e) {
    e.preventDefault()
    var $a = $(this)
    var $active = $a.closest('.dropdown-driven-tabs').find('.active')
    if ($active) {
      var $activeAnchor = $active.find('a')
      if ($activeAnchor && $activeAnchor.is($a)) return
      $active.removeClass('active')
    }
    $a.tab('show')
  })
})
