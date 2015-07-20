$(function() {
	$('#cardLayout').on('dblclick', '.card', function () {
		$(this).toggleClass('light dark');
	})
	
	// adding periods
	setupAdding('#addPeriod', '#periodRoot', 'period', true, 48, 0);
	setupSortable('#periodRoot', 'period', true, addedNewPeriod);
	
	// adding events
	setupAdding('#addEvent', '#cardLayout .group.period', 'event', true, 248, 0);
	setupSortable('#cardLayout .group.period', 'event', true, addedNewEvent);
	
	// adding scenes
	setupAdding('#addScene', '#cardLayout .group.event', 'scene', false, 258, 306);
	setupSortable('#cardLayout .group.event', 'scene', false, addedNewScene);
	
	$('#bigPictureOk').click(function () {
		var bp = $('#bigPicture');
		
		if (bp.text().trim() == '')
			return; // must enter some text
		
		bp.removeAttr('contenteditable');
		
		$('#bigPictureTools').slideUp();
		$('#bookendTools, #cardLayout').slideDown();
		
		$('.bookend.card.start').focus();
	});
	
	$('#bookendOk').click(function () {
		$('.card.bookend').removeAttr('contenteditable');
		
		$('#bookendTools').slideUp();
		$('#paletteTools, #palette').slideDown();
		
		$('#palette').focus();
	});
	
	$('#paletteOk').click(function () {
		$('#palette').removeAttr('contenteditable').addClass('active').hide();

		$('#paletteTools, #palette').slideUp();
		$('#activeTools').slideDown();
	});
	
	$('#showPalette').click(function () {
		$('#palette, #mask').show();
		$('#mask').one('click', function () { $('#palette, #mask').hide(); });
	})
	
	$('#bigPicture').focus();
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
		if (e.which != 1)
			return;
		if (cantAddEvents && cardType == 'event')
			return;
		if (cantAddScenes && cardType == 'scene')
			return;
	
		var appendTo = $(rootSelector + ':first');
		var newCard = $('<div/>', {class: cardType + ' card light', contenteditable:'true'});
		
		$(rootSelector).sortable('option', 'disabled', false);
		appendTo.sortable('refresh');
		
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

var cantAddEvents = true, cantAddScenes = true;

function addedNewPeriod(obj) {
	// initialize event sorting within this new period
	setupSortable('#cardLayout .group.period', 'event', true, addedNewEvent, obj);
	
	// allow adding events, if disabled
	if (cantAddEvents) {
		$('#addEvent').removeClass('disabled');
		cantAddEvents = false;
	}
}

function addedNewEvent(obj) {
	// initialize scene sorting within this new event
	setupSortable('#cardLayout .group.event', 'scene', false, undefined, obj);
	
	// allow adding scenes, if disabled
	if (cantAddScenes) {
		$('#addScene').removeClass('disabled');
		cantAddScenes = false;
	}
}

function addedNewScene(obj) {
	
}