jQuery(function() {

//----written by Scott Darby scottdarby@redweb.com----//

	//main nav
	//see how many items there are in the menu
	var listItems = jQuery('#nav li').length;

	//calcuate width of container
	var listContWidth = parseInt(jQuery('#nav').css('width'));

	var listItemWidth = (Math.round(listContWidth/listItems));

	//set width of each nav item
	jQuery('#nav li').css('width', listItemWidth);

	//check if all widths fit equally into the container, if not resize last item to fit
	var totalWidths = listItemWidth*listItems;

	if (totalWidths < listContWidth){
		var diff = listContWidth-totalWidths;
		jQuery('#nav li:last').css('width', listItemWidth+diff);
	}

	if (totalWidths > listContWidth){
		var diff = totalWidths-listContWidth;
		jQuery('#nav li:last').css('width', listItemWidth-diff);
	}

	//set height of links
	//select links
	var $links = jQuery('#nav li a');

	//create array for heights
	var heights = Array();

	//create function to numerically sort array in reverse order
	function sortArray(a,b) {
		return b - a;
	}

	//iterate through links
	for( var i = 0, n = $links.length;  i < n;  ++i ) {
		var link = $links[i];
		//add heights to array
		heights.push(jQuery(link).height());
	}

	//sort array so highest number is at start
	var ordered = heights.sort(sortArray);
	var highest = ordered[0];

	//set all list items to the height of the highest
	jQuery('#nav li a').css("height", highest);

	//show menu
	jQuery('#nav').css('left','0');

	//sidenav
	var lNavLinks = jQuery('ul#lNav li');
	var index = lNavLinks.index(jQuery('li.lNavSelected'));
	jQuery('ul#lNav li a').eq(index-1).addClass('above');
	jQuery('ul#lNav li a').eq(index+1).addClass('below');

	if (jQuery('ul#lNav li:first').hasClass('lNavSelected')){
		jQuery('#lNavContainer').addClass('top');
	}

	if (jQuery('ul#lNav li:last').hasClass('lNavSelected')){
		jQuery('#lNavContainer').addClass('bottom');
	}

	//last-child selector for IE
	if ( jQuery.browser.msie ) {
		jQuery('#nav li:last-child a').css('border-right','1px solid #d6d6d6');
	}

	//alternate colors
	jQuery('.serviceNewsImgContainer:odd').addClass('blueBox');

	//datepickers
	jQuery('#DateOfLastContPPATB, #DateOfPrevContTB, #PrescriptionPrePayment1_DateOfLastContPPATB, #LowIncomeSchemeEnq1_DateOfPrevContTB, #ReviewRequest1_DateOfLastContPPATB').datepicker({dateFormat: 'dd-mm-yy'});


});
