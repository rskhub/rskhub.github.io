$(function(){

    var flg, colw;
    var $g = $('.grid');
    var timer = false;

    $('body').css('overflow', 'hidden');

    $.pjax({
        area: '#content',
        link: 'a:not([target])',
        ajax: {timeout: 30000},
        wait: 500
    });
    
    header_image_update();

        $('#loading').fadeOut(500);
    $('.grid img').imagesLoaded(function(){
        masonry_update($g, $('.grid-item'));
        $('body').css('overflow', '');
    });

    infinitescroll_update($g)

    $('#zoom').anythingZoomer();

    $(window).resize(function(){
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            masonry_update($('.grid'), $('.grid-item'));
            header_image_update();
        }, 200);
    });  

    $(window).scroll(function(){
        var hih = $('.header-image').height();
        var y = $(this).scrollTop();
        var blur = Math.floor((hih + 30 * y) / hih - 1);
        $('.header-image').css({
//            'top': parseInt( y / 2 ) + 'px',
            '-webkit-filter': 'blur(' + blur + 'px)',
            'filter': 'blur(' + blur + 'px)'
        });
        $('.scroll').css({
            'opacity': 1 - y / 200
        });
    });

    $(document).bind('pjax:fetch', function(){
        $('body').css('overflow', 'hidden');
        $('#content').attr({'class': 'fadeOut'});
    });
   
    $(document).bind('pjax:render', function(){
        $('#content').attr({'class': 'fadeIn'});
        header_image_update();
        $('body').css('overflow', '');
        $g = $('.grid');
        $('.grid img').load(function(){
            masonry_update($g, $('.grid-item'));
            $('#zoom').anythingZoomer();
        });
        infinitescroll_update($g)
    });

});

function masonry_update(ag, agi){
    var w = $('html').width();
    if(w > 640){
        colw = Math.floor(ag.width() / Math.floor((w - 120) / 200));
        agi.css({
            'width': colw + 'px',
            'visibility': 'visible'
        });
        ag.masonry({
            itemSelector: '.grid-item',
            columnWidth: colw
        });
        flg = 1;
    }else{
        if(flg){
            agi.css('width', 'auto');
            ag.masonry('destroy');
            flg = 0;
        }
    }
 }

function header_image_update(){
    var h = $(window).height();
    var bh = $('html').width() > 640 ? 120 : 100;
    $('.header-image-wrapper').css('height', (h - bh) + 'px');
    $('.header-image').css('height', h + 'px');
}

function infinitescroll_update(bg){
    bg.infinitescroll({
        navSelector: '#pagination',
        nextSelector: '#pagination a',
        itemSelector: '.grid-item',
        animate: true,
        extraScrollPx: -200,
        loading: {
            finishedMsg: 'the end',
            img: 'loading.gif'
        }
    },
    function(newElements){
		var $newElems = $(newElements);
		$newElems.imagesLoaded(function(){
            $('.grid-item').css({
                'width': Math.floor(bg.width() / Math.floor(($('html').width() - 120) / 200)) + 'px',
                'visibility': 'visible'
            });
			bg.masonry('appended', $newElems, true);
		});
	});
}
