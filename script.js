$(function() {
	$('#cardLayout').on('dblclick', '.card', function () {
		$(this).toggleClass('light dark');
	})
	
	// adding periods
	setupAdding('#addPeriod', '#cardLayout', 'period', true, 48, 0);
	setupSortable('#cardLayout', 'period', true, function (obj) {
		// initialize event sorting within this new period
		setupSortable('#cardLayout .group.period', 'event', true, undefined, obj);
	});
	
	// adding events
	setupAdding('#addEvent', '#cardLayout .group.period', 'event', true, 248, 0);
	setupSortable('#cardLayout .group.period', 'event', true, function (obj) {
		// initialize scene sorting within this new event
		setupSortable('#cardLayout .group.event', 'scene', true, undefined, obj);
	});
	
	// adding scenes
	setupAdding('#addScene', '#cardLayout .group.event', 'scene', false, 258, 306);
	setupSortable('#cardLayout .group.event', 'scene', false);
});

function setupSortable(rootSelector, cardType, useGroups, addComplete, rootObject) {
	if (rootObject === undefined)
		rootObject = $(rootSelector);

	rootObject.sortable({
			handle: useGroups ? '.card.' + cardType : undefined,
			items: useGroups ? '> .group.' + cardType : '> .card.' + cardType,
			placeholder: 'ui-state-highlight card ' + cardType + 'Placeholder',
			connectWith: rootSelector,
			disabled: true,
			stop: function (e, ui) {
				$('#cardLayout .' + (useGroups ? 'group' : 'card') + '.' + cardType).removeAttr('style');
				$(rootSelector).sortable('option', 'disabled', true);
				
				if (addComplete !== undefined)
					addComplete(ui.item);
					
				$('#newest').removeAttr('id');
			}
		});
}

function setupAdding(buttonSelector, rootSelector, cardType, useGroups, addOffsetX, addOffsetY) {
	$(buttonSelector).mousedown(function (e) {
		var appendTo = $(rootSelector + ':first');
		var newCard = $('<div/>', {class: cardType + ' card light', contenteditable:'true'});
		
		var newRoot;
		if (useGroups) {
			var newCardGroup = $('<div/>', {class: cardType + ' group'}).appendTo(appendTo);
			newCard.appendTo(newCardGroup);
			newRoot = newCardGroup;
		}
		else {
			newCard.appendTo(appendTo);
			newRoot = newCard;
		}
		
		appendTo.sortable('refresh');
		$(rootSelector).sortable('option', 'disabled', false);
		
		var pos = $('#toolbox').position();
		newRoot.attr('id', 'newest');
		newRoot.css('position', 'absolute');
		newRoot.css('left', pos.left + $(window).scrollLeft() - addOffsetX);
		newRoot.css('top', pos.top + $(window).scrollTop() - addOffsetY);
		
		e.type = 'mousedown.sortable';
		e.target = newCard[0];
		newCard.trigger(e);
		
		return false;
	});
}