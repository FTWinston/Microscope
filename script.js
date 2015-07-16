$(function() {
	$('#cardLayout').on('dblclick', '.card', function() {
		$(this).toggleClass('light dark');
	});
});