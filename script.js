$(function() {
	$('#cardLayout').on('dblclick', '.card', function() {
		$(this).toggleClass('light dark');
	}).sortable({
		handle: '.card.period',
		items: '> .group.period',
		placeholder: 'ui-state-highlight card placeholder',
		connectWith: '#templates',
		disabled: true,
		stop: function () {
			$('#cardLayout .group.period').removeAttr('style');
			$('#cardLayout').sortable('option', 'disabled', true);
		}
    });
	
	$('#addPeriod').mousedown(function (e) {
		var newCardGroup = $('<div/>', {class:'period group'})/*.draggable()*/.appendTo('#cardLayout');
		var newCard = $('<div/>', {class:'period card light', contenteditable:'true'}).appendTo(newCardGroup);
		
		$('#cardLayout').sortable('refresh').sortable('option', 'disabled', false);
		
		var pos = $('#toolbox').position();
		newCardGroup.css('position', 'absolute');
		newCardGroup.css('left', pos.left);
		newCardGroup.css('top', pos.top);
		
		e.type = 'mousedown.sortable';
		e.target = newCard[0];
		newCard.trigger(e);
		
		return false;
	});
});