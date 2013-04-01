(function(d, s) {
	var js, fjs = d.getElementsByTagName(s)[0], load = function(url, id) {
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.src = url; js.id = id;
	fjs.parentNode.insertBefore(js, fjs);
	};
load('//platform.twitter.com/widgets.js', 'tweetjs');
// load('https://apis.google.com/js/plusone.js', 'gplus1js'); // Checkout http://j.mp/ApDgMr for usage html for this is <div class="g-plusone" data-size="medium"></div>
// load('//connect.facebook.net/en_US/all.js#xfbml=1', 'fbjssdk'); // Checkout http://j.mp/wZw2xR for using open graph protorol html for this is <div class="fb-like" data-href="{{ page.url }}" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false" data-font="verdana"></div>
}(document, 'script'));
