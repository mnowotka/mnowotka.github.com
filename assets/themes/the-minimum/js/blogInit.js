//-----------------------------------------------------------------------------

jQuery(document).ready(function(){
	$(ich.portTemplate({})).prependTo('div.content');
	jQuery('.parallax-layer').parallax({
		mouseport: jQuery("#port")
	});
	
    $.when($.getJSON("http://api.stackoverflow.com/1.1/users/" + soid + "?jsonp=?"),
         $.getJSON("http://pl.gravatar.com/" + mailhash + ".json?callback=?")).then(function(so, gravatar){
        var soData = so[0].users[0];
        var gravData = gravatar[0].entry[0];
        var data = _.extend(soData, gravData);
        data.linkedInUrl = data.accounts[2].url;
        data.rep = addCommas(data.reputation.toString());
        data.ASSET_PATH = "{{ ASSET_PATH }}";
        $(ich.user(data)).prependTo('.bd');
        $(".grav-about").html($(".grav-about").text().substring(1).replace(/\n/g, '<br />'));
        $('.gcard').waypoint('sticky', {offset: 15});
    });
});

//-----------------------------------------------------------------------------
