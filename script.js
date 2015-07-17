$(function() {
	$('#cardLayout').on('dblclick', '.card', function() {
		$(this).toggleClass('light dark');
	});
	
	$('#toolbox ul').on('click', 'li', function() {
		var val = $(this).children('.value').text();
		
		var root = $('#cardLayout');
		if (root.attr('mode') == val)
			root.removeAttr('mode');
		else {
			root.attr('mode', val);
			console.log('Entered \'add ' + val + '\' mode');
		}
	});
});