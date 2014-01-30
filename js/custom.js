var min_price = 1000;
var max_price = 8000;

$(document).ready(function(){

	$("#slider").noUiSlider({
	 	range: [1000, 50000],	
	 	start: [1000, 8000],
	 	handles: 2,
	 	step: 100,
	 	margin: 100,
	 	connect: true,
	 	direction: 'ltr',
	 	orientation: 'horizontal',
	 	behaviour: 'tap-drag',
	 	set: function(){
			var values = $(this).val();
			min_price = values[0];
			max_price = values[0]; 
			search();
		},
	 	serialization: {
		 	resolution: 1,
		 	to: [ 	[$('#price_start'), 'html'] , 
		 			[$('#price_end'), 'html']
		 		]
		}
	});

	$('.price_slider').hide();

	$('#return_label').hide();
	$('#end_date').hide();
    $('#start_date').datepicker();
	$('#end_date').datepicker();

	$('#oneWay').click(function(){
		$('.price_slider').hide();
		$('#oneWay').addClass('clicked');
		$('#roundTrip').removeClass('clicked');
		$('#return_label').hide();
		$('#end_date').hide();
		$('.book_button').text("Book");
	});

	$('#roundTrip').click(function(){
		$('.price_slider').hide();
		$('#roundTrip').addClass('clicked');
		$('#oneWay').removeClass('clicked');
		$('#return_label').show();
		$('#end_date').show();
		$('.book_button').text("Add");
	});
});

function search(){

	$('.price_slider').show();

	$.ajax({
        url: "json/flights.json",
        //force to handle it as text
        dataType: "text",
        success: function(data) {
          	//data downloaded so we call parseJSON function
           	//and pass downloaded data
           	var json = $.parseJSON(data);
       	 	//now json variable contains data in json format
           	//let's display a few items
           	if( $('#select_return_flight').text() === "Select Departure Flight"){
       	  		display_return(json);
       	  	}
       	  	else{
       	  		display(json);
       	  	}
        }
    });
}

function display(data){

	var isReturned = false;

	var searched_source = $('#source').val().toLowerCase();
	var searched_destination = $('#destination').val().toLowerCase();
	var searched_going_date = $('#start_date').val();

	var search_result_heading = '<h3>Search Results</h3>';

	if( $('#roundTrip').hasClass('clicked') ){
		var select_return_flight_button = '<button id="select_return_flight" type="button" onclick="set_return();">Select Return Flight</button>';
	}
	else{
		var select_return_flight_button = "";
	}

	var search_date = '<span id="flight_search_date">Date: ' + searched_going_date + '</span>';

	var search_headers = '<div class="search_headers"> <p class="airline_label">Airline</p> <p class="departure_label">Departure</p> <p class="arrival_label">Arrival</p> <p class="duration_label">Duration</p> </div>';

    var static_content = search_result_heading + select_return_flight_button + search_date + search_headers;

    var content = static_content;

    var searched_data = _.filter(data.flight_data, function(record){ 
                                return (record.from.toLowerCase() === searched_source && record.to.toLowerCase() === searched_destination && record.cost >= min_price && record.cost <= max_price) ; 
                            });

    if(searched_data.length<1){

    	var no_result = '<span class="no_result">Sorry! No flights matched your search</span>';
    	content+= no_result;

    }else{

    	$.each(searched_data, function(index, element){
    	
    		var airline = '<h5 id="airline_name" class="airline_name_style">' + element.airline + '</h5>';

			var flight_number = '<h6 id="flight_number" class="flight_number_style">' + element.flight_number + '</h6>';

			var departure_time = '<span id="departure_time" class="departure_time_style">' + element.departure + '</span>';

			var departure_venue = '<span id="departure_venue" class="departure_venue_style">' + element.from + '</span>';

			var arrival_time = '<span id="arrival_time" class="arrival_time_style">' + element.arrival + '</span>';

			var arrival_venue = '<span id="arrival_venue" class="arrival_venue_style">' + element.to + '</span>';

			var duration = '<span id="duration" class="duration_style">' + element.duration.concat("hrs") + '</span>';

			var flight_cost = '<span id="flight_cost" class="flight_cost_style">' + "Rs.".concat(element.cost) + '</span>';

			var book_button = '<button class="book_button" type="button">Book</button>';

			var flight_details = '<div id="flight_details" class="flight_details_style">' + airline + flight_number + departure_time + departure_venue + arrival_time + arrival_venue + duration + flight_cost + book_button + '</div>'; 
    
			content += flight_details;

    	});
	}

	$('.search_results').html(content);
}

function display_return(data){

	var isReturned = false;

	var searched_source = $('#destination').val().toLowerCase();
	var searched_destination = $('#source').val().toLowerCase();
	var searched_returning_date = $('#end_date').val();

	var search_result_heading = '<h3>Search Results</h3>';

	if( $('#roundTrip').hasClass('clicked') ){
		var select_return_flight_button = '<button id="select_return_flight" type="button" onclick="set_departure();">Select Departure Flight</button>';
	}
	else{
		var select_return_flight_button = "";
	}

	var search_date = '<span id="flight_search_date">Date: ' + searched_returning_date + '</span>';

	var search_headers = '<div class="search_headers"> <p class="airline_label">Airline</p> <p class="departure_label">Departure</p> <p class="arrival_label">Arrival</p> <p class="duration_label">Duration</p> </div>';

    var static_content = search_result_heading + select_return_flight_button + search_date + search_headers;

    var content = static_content;

    var searched_data = _.filter(data.flight_data, function(record){ 
                                return (record.from.toLowerCase() === searched_source && record.to.toLowerCase() === searched_destination) ; 
                            });

    if(searched_data.length<1){

    	var no_result = '<span class="no_result">Sorry! No flights matched your search</span>';
    	content+= no_result;

    }else{

    	$.each(searched_data, function(index, element){
    	
    		var airline = '<h5 id="airline_name" class="airline_name_style">' + element.airline + '</h5>';

			var flight_number = '<h6 id="flight_number" class="flight_number_style">' + element.flight_number + '</h6>';

			var departure_time = '<span id="departure_time" class="departure_time_style">' + element.departure + '</span>';

			var departure_venue = '<span id="departure_venue" class="departure_venue_style">' + element.from + '</span>';

			var arrival_time = '<span id="arrival_time" class="arrival_time_style">' + element.arrival + '</span>';

			var arrival_venue = '<span id="arrival_venue" class="arrival_venue_style">' + element.to + '</span>';

			var duration = '<span id="duration" class="duration_style">' + element.duration.concat("hrs") + '</span>';

			var flight_cost = '<span id="flight_cost" class="flight_cost_style">' + "Rs.".concat(element.cost) + '</span>';

			var book_button = '<button class="book_button" type="button">Book</button>';

			var flight_details = '<div id="flight_details" class="flight_details_style">' + airline + flight_number + departure_time + departure_venue + arrival_time + arrival_venue + duration + flight_cost + book_button + '</div>'; 
    
			content += flight_details;

    	});
	}

	$('.search_results').html(content);
}

function set_return(){
	$('#select_return_flight').text("Select Departure Flight");
	$('#select_return_flight').width(200);
	search();
}

function set_departure(){
	$('#select_return_flight').text("Select Return Flight");
	$('#select_return_flight').width(170);
	search();
}